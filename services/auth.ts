import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User,
  type Unsubscribe,
} from 'firebase/auth'
import { auth } from '@/lib/firebase'

export interface AdminUser {
  uid: string
  email: string | null
  displayName: string | null
  isAdmin: boolean
  role?: string
}

function mapAuthErrorMessage(errorCode: string): string {
  switch (errorCode) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Invalid email address or password.'
    case 'auth/user-disabled':
      return 'This administrator account has been disabled.'
    case 'auth/too-many-requests':
      return 'Access temporarily locked due to multiple failed login attempts. Please try again later.'
    case 'auth/network-request-failed':
      return 'Network connection error. Please check your internet connection.'
    case 'auth/invalid-email':
      return 'Please provide a valid email address.'
    default:
      return 'Authentication failed. Please check your credentials.'
  }
}

/**
 * Authoritative administrator sign-in using Firebase Authentication & Custom Claims.
 */
export async function signIn({ email, password }: { email: string; password: string }) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password)
    const user = userCredential.user

    // Force refresh token once upon sign-in to retrieve latest custom claims
    const tokenResult = await user.getIdTokenResult(true)

    if (tokenResult.claims.admin !== true) {
      // Immediately sign out unprivileged non-admin users
      await firebaseSignOut(auth)
      throw new Error('Access Denied: This account is not registered as an authorized administrator.')
    }

    return user
  } catch (err: any) {
    // If it is our custom access denied error, pass it through directly
    if (err?.message?.startsWith('Access Denied:')) {
      throw err
    }
    const friendlyMessage = mapAuthErrorMessage(err?.code || '')
    throw new Error(friendlyMessage)
  }
}

/**
 * Sign out the currently active administrator session.
 */
export async function signOut(): Promise<void> {
  await firebaseSignOut(auth)
}

/**
 * Get current active Firebase user.
 */
export function getCurrentUser(): User | null {
  return auth.currentUser
}

/**
 * Legacy compatibility alias for getUser.
 */
export async function getUser(): Promise<User | null> {
  return auth.currentUser
}

/**
 * Check if a given or active user has the authoritative custom claim admin === true.
 */
export async function isAdmin(user?: User | null, forceRefresh = false): Promise<boolean> {
  const targetUser = user ?? auth.currentUser
  if (!targetUser) return false
  try {
    const result = await targetUser.getIdTokenResult(forceRefresh)
    return result.claims.admin === true
  } catch (err) {
    console.error('Error verifying admin custom claim:', err)
    return false
  }
}

/**
 * Retrieve the current administrator ID token for server-side API calls.
 */
export async function getAdminToken(forceRefresh = false): Promise<string | null> {
  const user = auth.currentUser
  if (!user) return null
  try {
    return await user.getIdToken(forceRefresh)
  } catch (err) {
    console.error('Error fetching admin ID token:', err)
    return null
  }
}

/**
 * Subscribe to Firebase Auth state changes.
 */
export function subscribeToAuthState(callback: (user: User | null) => void): Unsubscribe {
  return onAuthStateChanged(auth, callback)
}

/**
 * Legacy compatibility subscription wrapper.
 */
export function onAuthStateChange(
  callback: (event: string, session: { user: User | null } | null) => void
): { data: { subscription: { unsubscribe: () => void } } } {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    callback(user ? 'SIGNED_IN' : 'SIGNED_OUT', user ? { user } : null)
  })

  return {
    data: {
      subscription: {
        unsubscribe,
      },
    },
  }
}

/**
 * Legacy compatibility session getter.
 */
export async function getSession(): Promise<{ user: User | null } | null> {
  const user = auth.currentUser
  return user ? { user } : null
}
