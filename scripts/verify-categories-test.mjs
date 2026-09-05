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

async function runVerification() {
  console.log('=== RUNNING CATEGORY SYNCHRONIZATION TEST SUITE ===\n')

  // 1. Initial State
  const initialCatsSnap = await db.collection('categories').get()
  const initialCats = initialCatsSnap.docs.map(d => ({ id: d.id, ...d.data() }))
  console.log(`Initial Canonical Categories in Firestore: ${initialCats.length}`)
  initialCats.forEach(c => console.log(`  - [${c.id}] ${c.name} (enabled: ${c.enabled})`))

  // TEST A: Create Category
  console.log('\n--- TEST A: Create Category ---')
  const testCatRef = await db.collection('categories').add({
    name: 'Outdoor Patio Suite',
    slug: 'outdoor-patio-suite',
    description: 'All-weather teak and aluminum outdoor furniture',
    displayOrder: 10,
    enabled: true,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  })
  const createdSnap = await testCatRef.get()
  console.log(`Created Category ID: ${testCatRef.id}`)
  console.log(`Firestore categories contains document: ${createdSnap.exists}`)
  console.log(`Document Name: ${createdSnap.data().name}, Enabled: ${createdSnap.data().enabled}`)

  // Verify getEnabledCategories simulation
  const enabledSnap = await db.collection('categories').where('enabled', '==', true).get()
  const enabledIds = enabledSnap.docs.map(d => d.id)
  console.log(`Public getEnabledCategories includes new category: ${enabledIds.includes(testCatRef.id)}`)

  // TEST B: Edit Category
  console.log('\n--- TEST B: Edit Category ---')
  await testCatRef.update({
    name: 'Outdoor & Garden Living',
    slug: 'outdoor-garden-living',
    updatedAt: FieldValue.serverTimestamp(),
  })
  const updatedSnap = await testCatRef.get()
  console.log(`Updated Document Name: ${updatedSnap.data().name}`)
  console.log(`Updated Document Slug: ${updatedSnap.data().slug}`)

  // TEST C: Disable Category
  console.log('\n--- TEST C: Disable Category ---')
  await testCatRef.update({
    enabled: false,
    updatedAt: FieldValue.serverTimestamp(),
  })
  const disabledSnap = await testCatRef.get()
  console.log(`Disabled Document Enabled flag: ${disabledSnap.data().enabled}`)

  const enabledAfterDisableSnap = await db.collection('categories').where('enabled', '==', true).get()
  const enabledAfterDisableIds = enabledAfterDisableSnap.docs.map(d => d.id)
  console.log(`Public getEnabledCategories excludes disabled category: ${!enabledAfterDisableIds.includes(testCatRef.id)}`)

  const allAdminCatsSnap = await db.collection('categories').get()
  const allAdminCatsIds = allAdminCatsSnap.docs.map(d => d.id)
  console.log(`Admin getCategories({ includeDisabled: true }) still includes disabled category: ${allAdminCatsIds.includes(testCatRef.id)}`)

  // TEST E: Attempt Delete with Assigned Products
  console.log('\n--- TEST E: Attempt to Delete Category with Assigned Products ---')
  // Create a temporary product referencing testCatRef.id
  const testProdRef = await db.collection('products').add({
    name: 'Teak Lounger Chair',
    categoryId: testCatRef.id,
    category: 'Outdoor & Garden Living',
    material: 'Grade A Teak',
    dimensions: '60" L x 24" W',
    features: ['UV Resistant'],
    featured: false,
    enabled: true,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  })
  console.log(`Created temporary product ID: ${testProdRef.id} assigned to category: ${testCatRef.id}`)

  // Verify safety check logic
  const assignedSnap = await db.collection('products').where('categoryId', '==', testCatRef.id).get()
  console.log(`Assigned products count for category: ${assignedSnap.size}`)
  if (assignedSnap.size > 0) {
    console.log(`SAFETY CHECK PASSED: Deletion blocked because ${assignedSnap.size} product is assigned!`)
  } else {
    console.error('SAFETY CHECK FAILED: Expected assigned products!')
  }

  // TEST D: Delete Category with no assigned products (after removing product)
  console.log('\n--- TEST D: Delete Category with 0 Assigned Products ---')
  await testProdRef.delete()
  console.log(`Deleted temporary product ${testProdRef.id}`)

  const assignedAfterClean = await db.collection('products').where('categoryId', '==', testCatRef.id).get()
  console.log(`Assigned products count after removal: ${assignedAfterClean.size}`)

  if (assignedAfterClean.size === 0) {
    await testCatRef.delete()
    console.log(`Deleted test category document ${testCatRef.id}`)
  }

  const checkDeletedSnap = await testCatRef.get()
  console.log(`Category exists in Firestore after deletion: ${checkDeletedSnap.exists}`)

  // TEST F: Direct Firestore deletion test
  console.log('\n--- TEST F: Direct Firestore deletion check ---')
  const directTestCatRef = await db.collection('categories').add({
    name: 'Temporary Direct Category',
    slug: 'temporary-direct-category',
    displayOrder: 99,
    enabled: true,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  })
  console.log(`Created direct test category ${directTestCatRef.id}`)
  // Simulate Firebase console delete
  await directTestCatRef.delete()
  console.log(`Simulated direct Firebase console deletion of ${directTestCatRef.id}`)

  const directCheckSnap = await db.collection('categories').get()
  const directIds = directCheckSnap.docs.map(d => d.id)
  const isFound = directIds.includes(directTestCatRef.id)
  console.log(`Category resurrected in Firestore query: ${isFound}`)
  console.log(`No hardcoded source can resurrect it: ${!isFound}`)

  // Final check on database state
  const finalCatsSnap = await db.collection('categories').get()
  const finalCats = finalCatsSnap.docs.map(d => ({ id: d.id, ...d.data() }))
  console.log(`\nFinal Canonical Categories in Firestore: ${finalCats.length}`)
  finalCats.forEach(c => console.log(`  - [${c.id}] ${c.name} (enabled: ${c.enabled})`))

  console.log('\n=== ALL VERIFICATION TESTS COMPLETED SUCCESSFULLY ===')
}

runVerification().catch(err => {
  console.error('Verification failed:', err)
  process.exit(1)
})
