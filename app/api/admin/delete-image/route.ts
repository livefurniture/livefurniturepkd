import { NextRequest, NextResponse } from 'next/server'
import { adminAuth } from '@/lib/firebase-admin'
import { cloudinary, CLOUDINARY_FOLDER } from '@/lib/cloudinary'

export const dynamic = 'force-dynamic'

async function verifyAdminAuth(req: NextRequest): Promise<{ authorized: boolean; error?: string; status?: number }> {
  const authHeader = req.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { authorized: false, error: 'Missing or malformed Authorization header.', status: 401 }
  }

  const token = authHeader.split('Bearer ')[1]?.trim()
  if (!token) {
    return { authorized: false, error: 'Empty bearer token provided.', status: 401 }
  }

  try {
    const decodedToken = await adminAuth.verifyIdToken(token)
    if (decodedToken.admin !== true) {
      return { authorized: false, error: 'Forbidden: Administrator privileges required.', status: 403 }
    }
    return { authorized: true }
  } catch (err: any) {
    console.error('Firebase token verification error in /api/admin/delete-image:', err?.message || err)
    return { authorized: false, error: 'Invalid or expired authentication token.', status: 401 }
  }
}

export async function POST(req: NextRequest) {
  try {
    // 1. Authoritative Firebase ID token and custom claim verification
    const authCheck = await verifyAdminAuth(req)
    if (!authCheck.authorized) {
      return NextResponse.json({ error: authCheck.error || 'Unauthorized' }, { status: authCheck.status || 401 })
    }

    // 2. Parse and validate JSON payload
    let body: any
    try {
      body = await req.json()
    } catch (parseErr: any) {
      return NextResponse.json(
        { error: 'Bad Request: Invalid JSON body.' },
        { status: 400 }
      )
    }

    const { imagePublicId } = body || {}

    if (!imagePublicId || typeof imagePublicId !== 'string' || !imagePublicId.trim()) {
      return NextResponse.json(
        { error: 'Bad Request: "imagePublicId" must be a non-empty string.' },
        { status: 400 }
      )
    }

    const sanitizedPublicId = imagePublicId.trim()

    // 3. Safety constraint: Verify public ID belongs to project folder
    if (!sanitizedPublicId.startsWith(CLOUDINARY_FOLDER) && !sanitizedPublicId.startsWith('live-furniture/')) {
      return NextResponse.json(
        { error: 'Bad Request: Operation restricted to Live Furniture project assets.' },
        { status: 400 }
      )
    }

    // 4. Execute Cloudinary asset destruction
    const destroyResult = await cloudinary.uploader.destroy(sanitizedPublicId, {
      invalidate: true,
      resource_type: 'image',
    })

    return NextResponse.json(
      {
        success: true,
        result: destroyResult.result,
      },
      { status: 200 }
    )
  } catch (err: any) {
    console.error('Server asset deletion error in /api/admin/delete-image:', err?.message || err)
    return NextResponse.json(
      { error: err?.message ? `Failed to delete Cloudinary asset: ${err.message}` : 'Internal Server Error: Failed to delete Cloudinary asset.' },
      { status: 500 }
    )
  }
}
