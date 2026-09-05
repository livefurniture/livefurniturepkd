import { NextRequest, NextResponse } from 'next/server'
import { adminAuth } from '@/lib/firebase-admin'
import { cloudinary, CLOUDINARY_FOLDER } from '@/lib/cloudinary'

export const dynamic = 'force-dynamic'

const MAX_FILE_SIZE = 4.5 * 1024 * 1024 // 4.5 MB
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/jpg']

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
    console.error('Firebase token verification error in /api/admin/upload:', err?.message || err)
    return { authorized: false, error: 'Invalid or expired authentication token.', status: 401 }
  }
}

export async function POST(req: NextRequest) {
  // 1. Authoritative Firebase ID token and custom claim verification
  const authCheck = await verifyAdminAuth(req)
  if (!authCheck.authorized) {
    return NextResponse.json({ error: authCheck.error }, { status: authCheck.status || 401 })
  }

  // 2. Parse and validate multipart form-data
  try {
    const formData = await req.formData()
    const file = formData.get('file')

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: 'Bad Request: Missing image file in multipart field "file".' },
        { status: 400 }
      )
    }

    // 3. Size validation (max 4.5MB)
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `Payload Too Large: File size exceeds the maximum limit of ${MAX_FILE_SIZE / (1024 * 1024)}MB.` },
        { status: 413 }
      )
    }

    // 4. MIME type validation
    const mimeType = file.type.toLowerCase()
    if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
      return NextResponse.json(
        { error: `Bad Request: Unsupported image MIME type (${file.type}). Allowed formats: JPEG, PNG, WebP, AVIF.` },
        { status: 400 }
      )
    }

    // 5. Convert file buffer and stream to Cloudinary
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const uploadResult = await new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: CLOUDINARY_FOLDER,
          resource_type: 'image',
        },
        (error, result) => {
          if (error || !result) {
            return reject(error || new Error('Upload completed with undefined Cloudinary result.'))
          }
          resolve({
            secure_url: result.secure_url,
            public_id: result.public_id,
          })
        }
      )
      uploadStream.end(buffer)
    })

    // 6. Return secure URL and public ID
    return NextResponse.json(
      {
        imageUrl: uploadResult.secure_url,
        imagePublicId: uploadResult.public_id,
      },
      { status: 200 }
    )
  } catch (err: any) {
    console.error('Server upload error in /api/admin/upload:', err?.message || err)
    return NextResponse.json(
      { error: 'Internal Server Error: Failed to process image upload.' },
      { status: 500 }
    )
  }
}
