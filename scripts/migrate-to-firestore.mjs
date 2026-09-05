/**
 * Live Furniture - Comprehensive Firestore Migration & Seeding Script
 * 
 * Usage:
 *   node scripts/migrate-to-firestore.mjs [--admin=admin@livefurniture.in]
 */

import { initializeApp, cert, getApps } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore, FieldValue } from 'firebase-admin/firestore'
import * as dotenv from 'dotenv'
import { resolve } from 'path'
import * as fs from 'fs'

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
  console.log('\n💡 Please provide your Firebase service account credentials in .env.local before running.')
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

// Canonical Categories Specification
const CANONICAL_CATEGORIES = [
  {
    name: 'Bedroom',
    slug: 'bedroom',
    displayOrder: 1,
    description: 'Solid wood cots, hydraulic box beds, wardrobes, and bedside nightstands engineered for longevity.',
  },
  {
    name: 'Living Room',
    slug: 'living-room',
    displayOrder: 2,
    description: 'Engineered LCD wall units, ergonomic sofa suites, display consoles, and coffee tables.',
  },
  {
    name: 'Dining Room',
    slug: 'dining-room',
    displayOrder: 3,
    description: '6-seater and 8-seater solid wood dining tables with ergonomically contoured chairs.',
  },
  {
    name: 'Home Accent & Utility',
    slug: 'home-accent-utility',
    displayOrder: 4,
    description: 'Solid wood shoe racks, foyer credenzas, bookshelf dividers, and decorative pooja mandirs.',
  },
  {
    name: 'Raw Material / General',
    slug: 'raw-material-general',
    displayOrder: 5,
    description: 'Bulk seasoned timber frames, CNC milled sub-assemblies, and industrial joinery supplies.',
  },
]

// Fallback Baseline Products (Reconciled from site-data.ts)
const BASELINE_PRODUCTS = [
  {
    id: 'box-bed',
    name: 'Heritage Solid Wood Box Bed',
    category: 'Bedroom',
    image: '/live/hero_solid_wood.png',
    description: 'A heavy-duty solid wood box bed with integrated hydraulic storage and a sculpted headboard, built for a lifetime of structural durability.',
    material: 'Solid Sheesham / High-density panel',
    dimensions: '78" L x 72" W x 42" H (King Size)',
    features: ['Hydraulic storage lift', 'Load-bearing frame', 'Dust-free matte finish'],
    featured: true,
  },
  {
    id: 'cot-classic',
    name: 'Classic Solid Wood Cot',
    category: 'Bedroom',
    image: '/live/LIVE (1).png',
    description: 'Robust load-bearing cot with precision joinery, engineered for institutional and residential durability.',
    material: 'Solid Teak Wood',
    dimensions: '75" L x 60" W x 36" H (Queen Size)',
    features: ['Reinforced corner joinery', 'Anti-termite treatment', 'Hand-finished edges'],
    featured: false,
  },
  {
    id: 'bunker-bed',
    name: 'Heavy-Duty Solid Wood Bunker Bed',
    category: 'Bedroom',
    image: '/live/prod_bunker_bed.png',
    description: 'Space-maximizing solid wood bunker bed engineered with heavy load-bearing corner posts and built-in safety ladder.',
    material: 'Solid Seasoned Hardwood',
    dimensions: '78" L x 42" W x 68" H',
    features: ['Modular stackable design', 'Integrated safety guardrail', 'Smooth-sanded rungs'],
    featured: true,
  },
  {
    id: 'almira-wardrobe',
    name: 'Executive Multi-Door Almira Wardrobe',
    category: 'Bedroom',
    image: '/live/prod_almira_wardrobe.png',
    description: 'Executive multi-door wardrobe with modular inner shelves, hanging rods, and German soft-close door hinges.',
    material: 'Engineered Panel + Natural Veneer',
    dimensions: '72" W x 24" D x 84" H',
    features: ['Soft-close hinges', 'Concealed security drawer', 'Moisture-sealed back panel'],
    featured: false,
  },
  {
    id: 'bedside-table',
    name: 'Heritage Bedside Table',
    category: 'Bedroom',
    image: '/live/LIVE (43).png',
    description: 'Compact nightstand with smooth-gliding storage drawer and open shelf, crafted from seasoned solid wood.',
    material: 'Solid Teak / Sheesham',
    dimensions: '20" W x 16" D x 22" H',
    features: ['Telescopic drawer channels', 'Solid brass hardware', 'Beveled top edge'],
    featured: false,
  },
  {
    id: 'dressing-table',
    name: 'Contemporary Mirror Dressing Console',
    category: 'Bedroom',
    image: '/live/prod_dressing_table.png',
    description: 'Modern dressing unit featuring a full-length vanity mirror, concealed jewelry shelves, and soft-close drawers.',
    material: 'High-Density Engineered Panel + Mirror',
    dimensions: '36" W x 18" D x 72" H',
    features: ['Integrated vanity mirror', 'Partitioned accessory drawer', 'Scratch-resistant melamine finish'],
    featured: false,
  },
  {
    id: 'wardrobe-2door',
    name: '2-Door Compact Utility Wardrobe',
    category: 'Bedroom',
    image: '/live/LIVE (4).png',
    description: 'Space-efficient 2-door wardrobe designed for guest suites, staff accommodation, and compact bedrooms.',
    material: 'Commercial Pre-Laminated Board',
    dimensions: '36" W x 20" D x 75" H',
    features: ['Dual hanging rail', 'Lockable lower compartment', 'Heavy-gauge PVC edge banding'],
    featured: false,
  },
  {
    id: 'tv-unit',
    name: 'Architectural Seamless LCD TV Unit',
    category: 'Living Room',
    image: '/live/hero_wall_unit.png',
    description: 'Contemporary entertainment wall system featuring integrated wire raceways and floating display shelves.',
    material: 'Veneered Panel + Concealed LED Cavities',
    dimensions: '96" W x 16" D x 78" H',
    features: ['Integrated wire raceways', 'Concealed LED light channels', 'Push-to-open drawer units'],
    featured: true,
  },
  {
    id: 'sofa-suite',
    name: 'Ergonomic Executive Sofa Suite',
    category: 'Living Room',
    image: '/live/hero_living_room.png',
    description: 'Executive three-seater sofa suite with high-resilience foam cushioning and stain-resistant upholstery.',
    material: 'Hardwood Frame + HR Foam + Fabric',
    dimensions: '84" L x 36" D x 34" H',
    features: ['High-density 40-density foam', 'Anti-sag spring base', 'Removable zipped covers'],
    featured: true,
  },
  {
    id: 'sofa-bench',
    name: 'Architectural Solid Wood 3-Seater Bench',
    category: 'Living Room',
    image: '/live/prod_sofa_bench.png',
    description: 'Solid wood bench featuring sculpted slatted seating and mortise-and-tenon structural joinery.',
    material: 'Solid Seasoned Teak',
    dimensions: '66" L x 22" D x 32" H',
    features: ['Mortise-and-tenon joinery', 'Ergonomically contoured backrest', 'Polyurethane weather seal'],
    featured: false,
  },
  {
    id: 'coffee-table',
    name: 'Linea Solid Wood Coffee Table',
    category: 'Living Room',
    image: '/live/prod_coffee_table.png',
    description: 'Clean-lined coffee table featuring a lower display shelf and rounded safety corner edges.',
    material: 'Solid Walnut / Teak',
    dimensions: '48" L x 24" W x 18" H',
    features: ['Lower storage tier', 'Rounded child-safe corners', 'High-gloss lacquer finish'],
    featured: false,
  },
  {
    id: 'crockery-shelf',
    name: 'Glass Crockery Display Cabinet',
    category: 'Living Room',
    image: '/live/prod_crockery_shelf.png',
    description: 'Refined crockery display cabinet with tempered glass doors, adjustable shelving, and lower storage drawers.',
    material: 'Solid Wood + Tempered Glass',
    dimensions: '48" W x 18" D x 78" H',
    features: ['Tempered safety glass', 'Adjustable shelf levels', 'Felt-lined cutlery drawers'],
    featured: false,
  },
  {
    id: 'room-divider',
    name: 'Artisan Jali Folding Room Divider',
    category: 'Living Room',
    image: '/live/LIVE (26).png',
    description: 'Three-panel folding room partition crafted with geometric lattice woodwork for elegant space privacy.',
    material: 'Solid Sheesham Wood',
    dimensions: '60" W x 72" H x 1.5" D',
    features: ['Precision CNC lattice cutwork', 'Brass piano hinges', 'Fold-flat storage capability'],
    featured: false,
  },
  {
    id: 'dining-set',
    name: 'Crafted 6-Seater Solid Teak Dining Set',
    category: 'Dining Room',
    image: '/live/hero_dining_room.png',
    description: 'Six-seater solid teak dining table paired with ergonomically contoured dining chairs in a protective polyurethane coat.',
    material: 'Solid Teak Wood',
    dimensions: 'Table: 72" L x 40" W x 30" H',
    features: ['Heat & water resistant coating', 'Ergonomic lumbar chair support', 'Reinforced trestle base'],
    featured: true,
  },
  {
    id: 'dining-table-4s',
    name: 'Compact 4-Seater Solid Wood Dining Table',
    category: 'Dining Room',
    image: '/live/LIVE (109).png',
    description: 'Space-conscious 4-seater dining ensemble suited for apartments, dining alcoves, and boutique hospitality dining.',
    material: 'Seasoned Hardwood',
    dimensions: 'Table: 48" L x 36" W x 30" H',
    features: ['Chamfered edge profile', 'Anti-wobble leveler feet', 'Stain-resistant top coat'],
    featured: false,
  },
  {
    id: 'shoe-rack',
    name: 'Modular Ventilated Shoe Credenza',
    category: 'Home Accent & Utility',
    image: '/live/prod_shoe_rack.png',
    description: 'Multi-tier ventilated shoe cabinet with louvered front doors and top utility drawer.',
    material: 'Engineered Board + Solid Timber Trim',
    dimensions: '36" W x 15" D x 42" H',
    features: ['Louvered ventilation slots', 'Holds up to 18 pairs', 'Top drawer for keys and polish'],
    featured: false,
  },
  {
    id: 'pooja-mandir',
    name: 'Hand-Carved Solid Teak Pooja Mandir',
    category: 'Home Accent & Utility',
    image: '/live/LIVE (25).png',
    description: 'Traditional carved prayer cabinet with brass fitting details, prasad storage drawers, and protective top finish.',
    material: 'Solid Teak Wood + Brass Accessories',
    dimensions: '36" W x 18" D x 60" H',
    features: ['Hand-sculpted shikhara top', 'Pull-out diya tray', 'Brass bell mountings'],
    featured: false,
  },
  {
    id: 'bookshelf-display',
    name: 'Tiered Solid Wood Display Bookshelf',
    category: 'Home Accent & Utility',
    image: '/live/LIVE (40).png',
    description: 'Open five-tier architectural display shelving unit with solid timber uprights for library and living spaces.',
    material: 'Solid Hardwood + Heavy Metal Frame',
    dimensions: '36" W x 14" D x 72" H',
    features: ['Heavy load shelf capacity', 'Open back aesthetic', 'Anti-topple wall anchor included'],
    featured: false,
  },
  {
    id: 'timber-subassemblies',
    name: 'Kiln-Seasoned Bulk Timber Frames',
    category: 'Raw Material / General',
    image: '/live/LIVE (30).png',
    description: 'Precision-milled raw timber sub-assemblies produced at scale for multi-brand furniture dealers and workshops.',
    material: 'Kiln-Dried Hardwood Slabs',
    dimensions: 'Custom Batch Dimensions',
    features: ['Moisture content strictly <12%', 'CNC pre-drilled joint holes', 'Fungicide dipped'],
    featured: false,
  },
]

// Testimonials Baseline (from site-data.ts)
const BASELINE_TESTIMONIALS = [
  {
    customerName: 'Rajesh Menon',
    role: 'Procurement Head, Premium Showrooms Co.',
    location: 'Kochi, Kerala',
    review: 'Live Furniture has been our most dependable manufacturing partner. The structural consistency across bulk orders is remarkable.',
    rating: 5,
    displayOrder: 1,
  },
  {
    customerName: 'Anita Verma',
    role: 'Lead Interior Architect, Studio Atelier',
    location: 'Bengaluru, Karnataka',
    review: 'The precision joinery and dust-free finish rival imported lines at a fraction of the turnaround time. Truly industrial grade.',
    rating: 5,
    displayOrder: 2,
  },
  {
    customerName: 'Suresh Iyer',
    role: 'Facilities Director, Corporate Infrastructure',
    location: 'Chennai, Tamil Nadu',
    review: 'From CNC cut precision to clean-air finishing, their manufacturing discipline shows in every single piece delivered.',
    rating: 5,
    displayOrder: 3,
  },
  {
    customerName: 'Vikram Nair',
    role: 'Project Director, Horizon Hospitality',
    location: 'Coimbatore, Tamil Nadu',
    review: 'Their load-bearing solid wood bunker beds and cots have passed all our rigid commercial standards with flying colors.',
    rating: 5,
    displayOrder: 4,
  },
  {
    customerName: 'Meera Deshmukh',
    role: 'Retail Network Director, Urban Living',
    location: 'Mumbai, Maharashtra',
    review: 'As a high-volume furniture retailer, finding suppliers with strict BIS compliance and reliable delivery schedules is rare. Live Furniture delivers on both every time.',
    rating: 5,
    displayOrder: 5,
  },
  {
    customerName: 'Arjun Nambiar',
    role: 'Principal Designer, Nambiar Spaces',
    location: 'Kozhikode, Kerala',
    review: 'The bespoke LCD wall units and dining sets we ordered for our luxury residential project exceeded all client expectations. Flawless timber quality.',
    rating: 5,
    displayOrder: 6,
  },
  {
    customerName: 'Priya Sundaram',
    role: 'Supply Chain Manager, Grand Monarch Resorts',
    location: 'Goa',
    review: 'Working with Live Furniture on our 200-room resort fit-out was completely seamless. Zero defect returns and pristine finish throughout.',
    rating: 5,
    displayOrder: 7,
  },
  {
    customerName: 'Ketan Patel',
    role: 'Managing Partner, Heritage Woodworks',
    location: 'Ahmedabad, Gujarat',
    review: 'Their custom raw timber frame sub-assemblies saved our workshop weeks of manual milling. The CNC accuracy is spot on.',
    rating: 5,
    displayOrder: 8,
  },
]

async function executeMigration() {
  console.log('====================================================')
  console.log('🚀 LIVE FURNITURE - FIRESTORE MIGRATION & SEEDING')
  console.log('====================================================\n')

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const dataDir = resolve(process.cwd(), 'data')
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }

  // ----------------------------------------------------
  // 1. SAVE BACKUP OF BASELINE DATASET
  // ----------------------------------------------------
  const backupFile = resolve(dataDir, `backup-catalog-${timestamp}.json`)
  fs.writeFileSync(
    backupFile,
    JSON.stringify(
      {
        timestamp: new Date().toISOString(),
        canonicalCategories: CANONICAL_CATEGORIES,
        products: BASELINE_PRODUCTS,
        testimonials: BASELINE_TESTIMONIALS,
      },
      null,
      2
    )
  )
  console.log(`💾 Saved catalog backup to: ${backupFile}`)

  // ----------------------------------------------------
  // 2. MIGRATE & SEED CATEGORIES
  // ----------------------------------------------------
  console.log('\n📂 Migrating categories...')
  const categoriesRef = db.collection('categories')
  const existingCategoriesSnap = await categoriesRef.get()
  const existingCategoryDocs = existingCategoriesSnap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }))

  const categoryMap = new Map() // maps lowercase name -> categoryId

  // Populate existing in map
  existingCategoryDocs.forEach((cat) => {
    if (cat.name) categoryMap.set(cat.name.toLowerCase().trim(), cat.id)
    if (cat.slug) categoryMap.set(cat.slug.toLowerCase().trim(), cat.id)
  })

  let categoriesCreated = 0
  let categoriesUpdated = 0

  for (const cat of CANONICAL_CATEGORIES) {
    const key = cat.name.toLowerCase().trim()
    const existingId = categoryMap.get(key) || categoryMap.get(cat.slug.toLowerCase().trim())

    const payload = {
      name: cat.name,
      slug: cat.slug,
      displayOrder: cat.displayOrder,
      description: cat.description,
      enabled: true,
      updatedAt: FieldValue.serverTimestamp(),
    }

    if (existingId) {
      await categoriesRef.doc(existingId).set(payload, { merge: true })
      categoryMap.set(key, existingId)
      categoriesUpdated++
    } else {
      const newDocRef = await categoriesRef.add({
        ...payload,
        createdAt: FieldValue.serverTimestamp(),
      })
      categoryMap.set(key, newDocRef.id)
      categoriesCreated++
    }
  }

  // Check if any product has a custom category
  for (const prod of BASELINE_PRODUCTS) {
    const prodCatKey = (prod.category || 'Uncategorized').toLowerCase().trim()
    if (!categoryMap.has(prodCatKey)) {
      const customSlug = prodCatKey.replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
      const newCatRef = await categoriesRef.add({
        name: prod.category,
        slug: customSlug,
        displayOrder: 20 + categoryMap.size,
        description: `Catalog collection for ${prod.category}`,
        enabled: true,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      })
      categoryMap.set(prodCatKey, newCatRef.id)
      categoriesCreated++
      console.log(`  ➕ Added dynamic category from product catalog: "${prod.category}"`)
    }
  }

  console.log(`✅ Categories Migration: ${categoriesCreated} created, ${categoriesUpdated} synchronized.`)

  // ----------------------------------------------------
  // 3. MIGRATE & SEED PRODUCTS
  // ----------------------------------------------------
  console.log('\n🛋️ Migrating products...')
  const productsRef = db.collection('products')
  const existingProductsSnap = await productsRef.get()
  const existingProductDocs = existingProductsSnap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }))

  const existingProductMap = new Map() // name or id -> docId
  existingProductDocs.forEach((p) => {
    if (p.id) existingProductMap.set(p.id, p.id)
    if (p.name) existingProductMap.set(p.name.toLowerCase().trim(), p.id)
  })

  let productsCreated = 0
  let productsUpdated = 0

  for (const prod of BASELINE_PRODUCTS) {
    const catId = categoryMap.get((prod.category || '').toLowerCase().trim()) || ''
    const matchId = existingProductMap.get(prod.id) || existingProductMap.get(prod.name.toLowerCase().trim())

    const payload = {
      name: prod.name,
      description: prod.description || '',
      imageUrl: prod.image || '/live/LIVE (1).png',
      imagePublicId: '',
      categoryId: catId,
      category: prod.category || 'Uncategorized',
      material: prod.material || '',
      dimensions: prod.dimensions || '',
      features: prod.features || [],
      featured: Boolean(prod.featured),
      enabled: true,
      updatedAt: FieldValue.serverTimestamp(),
    }

    if (matchId) {
      // Merge update to preserve any existing Cloudinary imagePublicId if already customized in Firestore
      await productsRef.doc(matchId).set(payload, { merge: true })
      productsUpdated++
    } else {
      await productsRef.doc(prod.id).set({
        ...payload,
        createdAt: FieldValue.serverTimestamp(),
      })
      productsCreated++
    }
  }

  console.log(`✅ Products Migration: ${productsCreated} created, ${productsUpdated} synchronized.`)

  // ----------------------------------------------------
  // 4. MIGRATE & SEED TESTIMONIALS
  // ----------------------------------------------------
  console.log('\n⭐ Migrating testimonials...')
  const testimonialsRef = db.collection('testimonials')
  const existingTestimonialsSnap = await testimonialsRef.get()
  const existingTestimonialMap = new Map()

  existingTestimonialsSnap.docs.forEach((doc) => {
    const data = doc.data()
    if (data.customerName) existingTestimonialMap.set(data.customerName.toLowerCase().trim(), doc.id)
  })

  let testimonialsCreated = 0
  let testimonialsUpdated = 0

  for (const test of BASELINE_TESTIMONIALS) {
    const key = test.customerName.toLowerCase().trim()
    const existingId = existingTestimonialMap.get(key)

    const payload = {
      customerName: test.customerName,
      review: test.review,
      rating: test.rating || 5,
      location: test.location || '',
      date: new Date().toISOString().split('T')[0],
      displayOrder: test.displayOrder,
      enabled: true,
      updatedAt: FieldValue.serverTimestamp(),
    }

    if (existingId) {
      await testimonialsRef.doc(existingId).set(payload, { merge: true })
      testimonialsUpdated++
    } else {
      await testimonialsRef.add({
        ...payload,
        createdAt: FieldValue.serverTimestamp(),
      })
      testimonialsCreated++
    }
  }

  console.log(`✅ Testimonials Migration: ${testimonialsCreated} created, ${testimonialsUpdated} synchronized.`)

  // ----------------------------------------------------
  // 5. ADMIN CUSTOM CLAIM PROVISIONING (OPTIONAL)
  // ----------------------------------------------------
  const adminArg = process.argv.find((arg) => arg.startsWith('--admin='))
  const adminEmail = adminArg ? adminArg.split('=')[1] : process.env.ADMIN_EMAIL

  let adminProvisioned = 0
  if (adminEmail) {
    console.log(`\n🔑 Provisioning Superadmin user: ${adminEmail}...`)
    try {
      const user = await auth.getUserByEmail(adminEmail)
      await auth.setCustomUserClaims(user.uid, {
        admin: true,
        role: 'superadmin',
      })
      await db.collection('admins').doc(user.uid).set(
        {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || 'Superadmin',
          role: 'superadmin',
          updatedAt: FieldValue.serverTimestamp(),
        },
        { merge: true }
      )
      console.log(`✅ Superadmin custom claims authoritatively granted to ${user.email} (UID: ${user.uid})`)
      adminProvisioned++
    } catch (authErr) {
      console.warn(`⚠️ Note: Could not find existing Firebase Auth user for "${adminEmail}".`)
      console.log('   Create the user in Firebase Console first, then run: node scripts/set-admin-claim.mjs <email>')
    }
  }

  // ----------------------------------------------------
  // SUMMARY REPORT
  // ----------------------------------------------------
  console.log('\n====================================================')
  console.log('🎉 MIGRATION SUMMARY REPORT')
  console.log('====================================================')
  console.log(`📂 Categories total:   ${categoryMap.size} (Created: ${categoriesCreated}, Synced: ${categoriesUpdated})`)
  console.log(`🛋️ Products total:     ${BASELINE_PRODUCTS.length} (Created: ${productsCreated}, Synced: ${productsUpdated})`)
  console.log(`⭐ Testimonials total: ${BASELINE_TESTIMONIALS.length} (Created: ${testimonialsCreated}, Synced: ${testimonialsUpdated})`)
  console.log(`🔑 Admins provisioned: ${adminProvisioned}`)
  console.log('====================================================\n')

  process.exit(0)
}

executeMigration().catch((err) => {
  console.error('\n❌ Migration failed with error:', err.message || err)
  process.exit(1)
})
