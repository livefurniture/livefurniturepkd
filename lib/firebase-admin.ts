import { initializeApp, getApps, getApp, cert, type App } from 'firebase-admin/app'
import { getAuth, type Auth } from 'firebase-admin/auth'
import { getFirestore, type Firestore } from 'firebase-admin/firestore'

function formatPrivateKey(key: string | undefined): string | undefined {
  if (!key) return undefined
  let formatted = key.replace(/\\n/g, '\n')
  if (formatted.startsWith('"') && formatted.endsWith('"')) {
    formatted = formatted.slice(1, -1)
  }
  return formatted
}

function initAdminApp(): App {
  if (getApps().length > 0) {
    return getApp()
  }

  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL
  const privateKey = formatPrivateKey(process.env.FIREBASE_ADMIN_PRIVATE_KEY)

  if (projectId && clientEmail && privateKey) {
    try {
      return initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      })
    } catch (err) {
      console.warn('Firebase Admin credential initialization warning:', err)
    }
  }

  // Fallback for environments with Google Application Default Credentials or build phase
  return initializeApp({
    projectId: projectId || 'live-furniture-fallback',
  })
}

// Lazy singletons to ensure safe build-time execution
let adminAppInstance: App | null = null
let adminAuthInstance: Auth | null = null
let adminDbInstance: Firestore | null = null

export function getAdminApp(): App {
  if (!adminAppInstance) {
    adminAppInstance = initAdminApp()
  }
  return adminAppInstance
}

export function getAdminAuth(): Auth {
  if (!adminAuthInstance) {
    adminAuthInstance = getAuth(getAdminApp())
  }
  return adminAuthInstance
}

export function getAdminDb(): Firestore {
  if (!adminDbInstance) {
    adminDbInstance = getFirestore(getAdminApp())
  }
  return adminDbInstance
}

// Export adminAuth proxy so consumers can call adminAuth.verifyIdToken(...) cleanly
export const adminAuth = {
  verifyIdToken: async (token: string, checkRevoked?: boolean) => {
    return getAdminAuth().verifyIdToken(token, checkRevoked)
  },
  getUser: async (uid: string) => {
    return getAdminAuth().getUser(uid)
  },
  setCustomUserClaims: async (uid: string, customUserClaims: object | null) => {
    return getAdminAuth().setCustomUserClaims(uid, customUserClaims)
  },
}

export const adminDb = {
  collection: (collectionPath: string) => getAdminDb().collection(collectionPath),
  doc: (documentPath: string) => getAdminDb().doc(documentPath),
}

export const adminApp = {
  get name() {
    return getAdminApp().name
  },
  get options() {
    return getAdminApp().options
  },
}
