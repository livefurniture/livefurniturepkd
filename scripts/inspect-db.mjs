import { initializeApp, cert, getApps } from 'firebase-admin/app'
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

const app = getApps().length > 0 ? getApps()[0] : initializeApp({
  credential: cert({
    projectId,
    clientEmail,
    privateKey,
  }),
})

const db = getFirestore(app)

async function main() {
  const catSnap = await db.collection('categories').get()
  console.log(`\n=== FIRESTORE CATEGORIES (${catSnap.size}) ===`)
  catSnap.forEach(doc => {
    console.log(`ID: ${doc.id} =>`, JSON.stringify(doc.data()))
  })

  const prodSnap = await db.collection('products').get()
  console.log(`\n=== FIRESTORE PRODUCTS (${prodSnap.size}) ===`)
  prodSnap.forEach(doc => {
    const data = doc.data()
    console.log(`ID: ${doc.id} | name: "${data.name}" | categoryId: "${data.categoryId}" | category: "${data.category}"`)
  })
}

main().catch(console.error)
