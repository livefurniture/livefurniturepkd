/**
 * Server-side Admin Provisioning Script (Firebase Admin SDK)
 * 
 * Usage:
 *   node scripts/set-admin-claim.mjs <admin-email-or-uid> [role]
 * 
 * Example:
 *   node scripts/set-admin-claim.mjs admin@livefurniture.in superadmin
 * 
 * Authoritatively sets:
 *   { admin: true, role: 'superadmin' }
 */

import { initializeApp, cert, getApps } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'
import * as dotenv from 'dotenv'
import { resolve } from 'path'

dotenv.config({ path: resolve(process.cwd(), '.env.local') })

function formatPrivateKey(key) {
  if (!key) return undefined
  return key.replace(/\\n/g, '\n')
}

const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL
const privateKey = formatPrivateKey(process.env.FIREBASE_ADMIN_PRIVATE_KEY)

if (!projectId || !clientEmail || !privateKey) {
  console.error('❌ Error: Missing Firebase Admin environment variables in .env.local')
  console.error('Required: FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL, FIREBASE_ADMIN_PRIVATE_KEY')
  process.exit(1)
}

const app = getApps().length > 0 ? getApps()[0] : initializeApp({
  credential: cert({
    projectId,
    clientEmail,
    privateKey,
  }),
})

const auth = getAuth(app)
const db = getFirestore(app)

const identifier = process.argv[2]
const role = process.argv[3] || 'superadmin'

if (!identifier) {
  console.log('Usage: node scripts/set-admin-claim.mjs <admin-email-or-uid> [role]')
  process.exit(1)
}

async function setAdminClaim() {
  try {
    let user
    if (identifier.includes('@')) {
      user = await auth.getUserByEmail(identifier)
    } else {
      user = await auth.getUser(identifier)
    }

    console.log(`Found user: ${user.email} (UID: ${user.uid})`)

    // 1. Authoritatively set Custom Claims on Firebase Auth
    await auth.setCustomUserClaims(user.uid, {
      admin: true,
      role: role,
    })

    console.log(`✅ Set custom claims on Auth for ${user.email}: { admin: true, role: '${role}' }`)

    // 2. Update/create metadata in /admins/{uid} Firestore collection
    await db.collection('admins').doc(user.uid).set({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || 'Live Furniture Administrator',
      role: role,
      updatedAt: new Date().toISOString(),
    }, { merge: true })

    console.log(`✅ Updated Firestore metadata in /admins/${user.uid}`)
    console.log(`\n🎉 Admin privileges successfully granted to ${user.email}!`)
    process.exit(0)
  } catch (err) {
    console.error('❌ Failed to set admin claims:', err.message || err)
    process.exit(1)
  }
}

setAdminClaim()
