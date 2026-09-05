import { initializeApp, getApps, getApp, cert, type App } from 'firebase-admin/app'
import { getAuth, type Auth } from 'firebase-admin/auth'
import { getFirestore, type Firestore } from 'firebase-admin/firestore'

function formatPrivateKey(key: string | undefined): string | undefined {
  if (!key) return undefined
  return key.replace(/\\n/g, '\n')
}

function initAdminApp(): App {
  if (getApps().length > 0) {
    return getApp()
  }

  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL
  const privateKey = formatPrivateKey(process.env.FIREBASE_ADMIN_PRIVATE_KEY)

  if (projectId && clientEmail && privateKey) {
    return initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    })
  }

  // Fallback for environments with Google Application Default Credentials or build phase
  return initializeApp({
    projectId: projectId || 'live-furniture-fallback',
  })
}

const adminApp: App = initAdminApp()
const adminAuth: Auth = getAuth(adminApp)
const adminDb: Firestore = getFirestore(adminApp)

export { adminApp, adminAuth, adminDb }
