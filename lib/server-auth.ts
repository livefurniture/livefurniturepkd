import type { NextRequest } from 'next/server'
import { createRemoteJWKSet, jwtVerify } from 'jose'

export interface DecodedAdminToken {
  uid: string
  email?: string
  admin?: boolean
  [key: string]: any
}

export interface VerifyAuthResult {
  authorized: boolean
  token?: DecodedAdminToken
  error?: string
  status?: number
}

// Google's official public JWKS endpoint for Firebase Authentication
const FIREBASE_JWKS_URL = 'https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com'
const googleJwks = createRemoteJWKSet(new URL(FIREBASE_JWKS_URL), {
  cacheMaxAge: 3600000, // 1 hour
  cooldownDuration: 30000, // 30s
})

/**
 * Authoritatively verifies a Firebase ID Token using Google's public JWKS and standard OIDC RS256 verification.
 * Also attempts Firebase Admin SDK verification if available.
 * Validates issuer, audience (projectId), expiration, signature, and admin custom claim.
 */
export async function verifyAdminIdToken(token: string): Promise<DecodedAdminToken> {
  const projectId =
    process.env.FIREBASE_ADMIN_PROJECT_ID ||
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
    'live-furniture'

  // Strategy 1: Dynamic import of Firebase Admin SDK (when available in runtime)
  try {
    const { getAdminAuth } = await import('@/lib/firebase-admin')
    const adminAuth = getAdminAuth()
    const decoded = await adminAuth.verifyIdToken(token)
    return decoded as DecodedAdminToken
  } catch (adminErr: any) {
    // If Firebase Admin SDK loading encounters any CJS/ESM or config issues, fallback to authoritative Google JWKS verification
  }

  // Strategy 2: Authoritative Native Web Crypto OIDC JWKS verification (100% ESM, universal runtime compatibility)
  const expectedIssuer = `https://securetoken.google.com/${projectId}`
  const { payload } = await jwtVerify(token, googleJwks, {
    issuer: expectedIssuer,
    audience: projectId,
    algorithms: ['RS256'],
  })

  if (!payload.sub || typeof payload.sub !== 'string') {
    throw new Error('Invalid Firebase token subject.')
  }

  return {
    uid: payload.sub,
    email: typeof payload.email === 'string' ? payload.email : undefined,
    admin: payload.admin === true,
    ...payload,
  }
}

/**
 * Extracts Bearer token from NextRequest, verifies signature against Google Auth servers,
 * and confirms that the caller has authoritative admin claims (admin === true).
 */
export async function verifyAdminAuth(req: NextRequest): Promise<VerifyAuthResult> {
  const authHeader = req.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { authorized: false, error: 'Missing or malformed Authorization header.', status: 401 }
  }

  const token = authHeader.split('Bearer ')[1]?.trim()
  if (!token) {
    return { authorized: false, error: 'Empty bearer token provided.', status: 401 }
  }

  try {
    const decodedToken = await verifyAdminIdToken(token)
    if (decodedToken.admin !== true) {
      return { authorized: false, error: 'Forbidden: Administrator privileges required.', status: 403 }
    }
    return { authorized: true, token: decodedToken }
  } catch (err: any) {
    console.error('Admin token verification error:', err?.message || err)
    return { authorized: false, error: 'Invalid or expired authentication token.', status: 401 }
  }
}
