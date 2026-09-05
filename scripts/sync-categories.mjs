import { initializeApp, cert, getApps } from 'firebase-admin/app'
import { getFirestore, FieldValue } from 'firebase-admin/firestore'
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

const CANONICAL_CATEGORIES = [
  {
    name: 'Bedroom',
    slug: 'bedroom',
    displayOrder: 1,
    description: 'Solid wood cots, hydraulic box beds, wardrobes, and bedside nightstands engineered for longevity.',
    enabled: true,
  },
  {
    name: 'Living Room',
    slug: 'living-room',
    displayOrder: 2,
    description: 'Engineered LCD wall units, ergonomic sofa suites, display consoles, and coffee tables.',
    enabled: true,
  },
  {
    name: 'Dining Room',
    slug: 'dining-room',
    displayOrder: 3,
    description: '6-seater and 8-seater solid wood dining tables with ergonomically contoured chairs.',
    enabled: true,
  },
  {
    name: 'Home Accent & Utility',
    slug: 'home-accent-utility',
    displayOrder: 4,
    description: 'Pooja mandirs, room partition screens, shoe storage benches, and artisanal accents.',
    enabled: true,
  },
  {
    name: 'Raw Material / General',
    slug: 'raw-material-general',
    displayOrder: 5,
    description: 'Bulk seasoned timber frames, CNC milled sub-assemblies, and industrial joinery supplies.',
    enabled: true,
  },
]

async function sync() {
  console.log('--- STARTING CATEGORY & PRODUCT SYNCHRONIZATION ---')

  // 1. Fetch all existing categories
  const categoriesRef = db.collection('categories')
  const catSnap = await categoriesRef.get()
  const existingCats = []
  
  catSnap.forEach(doc => {
    const data = doc.data()
    // Clean up malformed documents like {"kitchen": "d"}
    if (!data.name || typeof data.name !== 'string') {
      console.log(`🗑️ Removing malformed category document: ${doc.id}`, data)
      categoriesRef.doc(doc.id).delete()
    } else {
      existingCats.push({ id: doc.id, ...data })
    }
  })

  // Map of lowercase name/slug -> category doc id
  const categoryMap = new Map()
  existingCats.forEach(c => {
    categoryMap.set(c.name.toLowerCase().trim(), c.id)
    if (c.slug) categoryMap.set(c.slug.toLowerCase().trim(), c.id)
  })

  // 2. Ensure all canonical categories exist and have valid fields
  for (const cat of CANONICAL_CATEGORIES) {
    const key = cat.name.toLowerCase().trim()
    let existingId = categoryMap.get(key) || categoryMap.get(cat.slug.toLowerCase().trim())
    
    // Special check for "living showcase" -> "Living Room"
    if (!existingId && cat.name === 'Living Room' && categoryMap.has('living showcase')) {
      existingId = categoryMap.get('living showcase')
    }

    const payload = {
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      displayOrder: cat.displayOrder,
      enabled: cat.enabled,
      updatedAt: FieldValue.serverTimestamp(),
    }

    if (existingId) {
      await categoriesRef.doc(existingId).set(payload, { merge: true })
      categoryMap.set(key, existingId)
      console.log(`✅ Updated existing category "${cat.name}" (ID: ${existingId})`)
    } else {
      const newDoc = await categoriesRef.add({
        ...payload,
        createdAt: FieldValue.serverTimestamp(),
      })
      categoryMap.set(key, newDoc.id)
      console.log(`✨ Created missing category "${cat.name}" (ID: ${newDoc.id})`)
    }
  }

  // 3. Re-fetch clean categories map
  const updatedCatSnap = await categoriesRef.get()
  const finalCatMap = new Map() // ID -> Category Name
  const nameToIdMap = new Map() // lower name -> ID

  updatedCatSnap.forEach(doc => {
    const data = doc.data()
    if (data.name) {
      finalCatMap.set(doc.id, data.name)
      nameToIdMap.set(data.name.toLowerCase().trim(), doc.id)
      if (data.slug) nameToIdMap.set(data.slug.toLowerCase().trim(), doc.id)
    }
  })

  console.log('\n--- CURRENT CLEAN CATEGORIES IN FIRESTORE ---')
  for (const [id, name] of finalCatMap.entries()) {
    console.log(`📁 [${id}] => ${name}`)
  }

  // 4. Synchronize all products so categoryId and category match
  const productsRef = db.collection('products')
  const prodSnap = await productsRef.get()
  let prodsSynced = 0

  console.log(`\n--- SYNCHRONIZING PRODUCTS (${prodSnap.size}) ---`)
  for (const docSnap of prodSnap.docs) {
    const data = docSnap.data()
    let targetCatId = data.categoryId || ''
    let targetCatName = data.category || ''

    // If categoryId is missing or points to a non-existent category doc
    if (!targetCatId || !finalCatMap.has(targetCatId)) {
      // Resolve by category name
      const matchedId = nameToIdMap.get(targetCatName.toLowerCase().trim())
      if (matchedId) {
        targetCatId = matchedId
        targetCatName = finalCatMap.get(matchedId)
      } else {
        // Fallback to first available category
        const defaultCatId = updatedCatSnap.docs[0].id
        targetCatId = defaultCatId
        targetCatName = finalCatMap.get(defaultCatId)
      }
    } else {
      // categoryId exists in Firestore categories, ensure product.category name matches
      targetCatName = finalCatMap.get(targetCatId)
    }

    await productsRef.doc(docSnap.id).update({
      categoryId: targetCatId,
      category: targetCatName,
      updatedAt: FieldValue.serverTimestamp(),
    })

    console.log(`🛋️ Synced Product [${docSnap.id}] "${data.name}" -> Category: "${targetCatName}" (${targetCatId})`)
    prodsSynced++
  }

  console.log(`\n🎉 Synchronization complete! ${prodsSynced} products synced.`)
}

sync().catch(console.error)
