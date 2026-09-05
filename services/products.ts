import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp,
  type DocumentData,
  type QueryDocumentSnapshot,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { deleteCloudinaryImage } from '@/services/storage'

export interface Product {
  id: string
  name: string
  description: string
  imageUrl?: string
  imagePublicId?: string
  image?: string // Compatibility alias for imageUrl in UI components
  categoryId?: string
  category: string
  material: string
  dimensions: string
  features: string[]
  featured?: boolean
  enabled?: boolean
  createdAt?: string
  updatedAt?: string
}

export type ProductInput = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>

function formatTimestamp(value: any): string {
  if (!value) return new Date().toISOString()
  if (typeof value.toDate === 'function') {
    return value.toDate().toISOString()
  }
  if (value instanceof Date) {
    return value.toISOString()
  }
  if (typeof value === 'string') {
    return value
  }
  return new Date().toISOString()
}

export function normalizeProduct(id: string, data: DocumentData): Product {
  let features: string[] = []
  if (Array.isArray(data.features)) {
    features = data.features.map(String).filter(Boolean)
  } else if (typeof data.features === 'string') {
    try {
      const parsed = JSON.parse(data.features)
      if (Array.isArray(parsed)) features = parsed.map(String).filter(Boolean)
    } catch {
      features = data.features.split('\n').map((s) => s.trim()).filter(Boolean)
    }
  }

  const imageUrl = String(data.imageUrl || data.image || '/placeholder.svg')

  return {
    id,
    name: String(data.name || ''),
    description: String(data.description || ''),
    imageUrl,
    image: imageUrl, // Compatibility alias
    imagePublicId: String(data.imagePublicId || ''),
    categoryId: String(data.categoryId || ''),
    category: String(data.category || 'Uncategorized'),
    material: String(data.material || ''),
    dimensions: String(data.dimensions || ''),
    features,
    featured: Boolean(data.featured),
    enabled: data.enabled !== false, // Defaults to true
    createdAt: formatTimestamp(data.createdAt),
    updatedAt: formatTimestamp(data.updatedAt),
  }
}

/**
 * Fetch products from Firestore.
 * By default (public view), filters exclusively for `enabled == true`.
 * Admin console can specify `{ includeDisabled: true }` to retrieve all products.
 */
export async function getProducts({
  includeDisabled = false,
}: {
  includeDisabled?: boolean
} = {}): Promise<Product[]> {
  try {
    const productsRef = collection(db, 'products')
    const q = includeDisabled
      ? query(productsRef)
      : query(productsRef, where('enabled', '==', true))

    const snapshot = await getDocs(q)
    const list: Product[] = snapshot.docs.map((docSnap: QueryDocumentSnapshot) =>
      normalizeProduct(docSnap.id, docSnap.data())
    )

    // Sort by createdAt descending in memory
    return list.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
  } catch (err: any) {
    console.error('Error fetching products from Firestore:', err?.message || err)
    throw new Error(err?.message || 'Failed to fetch products from Firestore.')
  }
}

/**
 * Fetch featured products for homepage / highlighted showcases.
 */
export async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const productsRef = collection(db, 'products')
    const q = query(
      productsRef,
      where('enabled', '==', true),
      where('featured', '==', true)
    )

    const snapshot = await getDocs(q)
    const list: Product[] = snapshot.docs.map((docSnap: QueryDocumentSnapshot) =>
      normalizeProduct(docSnap.id, docSnap.data())
    )

    return list.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
  } catch (err: any) {
    console.error('Error fetching featured products from Firestore:', err?.message || err)
    throw new Error(err?.message || 'Failed to fetch featured products from Firestore.')
  }
}

/**
 * Fetch a single product by document ID.
 */
export async function getProductById(id: string): Promise<Product | null> {
  try {
    const docRef = doc(db, 'products', id)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) {
      return null
    }

    return normalizeProduct(docSnap.id, docSnap.data())
  } catch (err: any) {
    console.error(`Error fetching product (${id}) from Firestore:`, err?.message || err)
    return null
  }
}

/**
 * Create a new product document in Firestore.
 */
export async function createProduct(product: Partial<ProductInput>): Promise<Product> {
  try {
    const imageUrl = product.imageUrl || product.image || '/placeholder.svg'
    const payload = {
      name: String(product.name || '').trim(),
      description: String(product.description || '').trim(),
      imageUrl,
      imagePublicId: String(product.imagePublicId || '').trim(),
      categoryId: String(product.categoryId || '').trim(),
      category: String(product.category || 'Uncategorized').trim(),
      material: String(product.material || '').trim(),
      dimensions: String(product.dimensions || '').trim(),
      features: Array.isArray(product.features) ? product.features.map(String).filter(Boolean) : [],
      featured: Boolean(product.featured),
      enabled: product.enabled !== false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }

    const docRef = await addDoc(collection(db, 'products'), payload)
    const createdSnap = await getDoc(docRef)

    return normalizeProduct(docRef.id, createdSnap.data() || payload)
  } catch (err: any) {
    console.error('Error creating product in Firestore:', err?.message || err)
    throw new Error(err?.message || 'Failed to create product.')
  }
}

/**
 * Update an existing product document in Firestore.
 */
export async function updateProduct(id: string, product: Partial<ProductInput>): Promise<Product> {
  try {
    const docRef = doc(db, 'products', id)
    const payload: Record<string, any> = {
      updatedAt: serverTimestamp(),
    }

    if (product.name !== undefined) payload.name = String(product.name).trim()
    if (product.description !== undefined) payload.description = String(product.description).trim()
    if (product.imageUrl !== undefined || product.image !== undefined) {
      payload.imageUrl = String(product.imageUrl || product.image || '').trim()
    }
    if (product.imagePublicId !== undefined) payload.imagePublicId = String(product.imagePublicId).trim()
    if (product.categoryId !== undefined) payload.categoryId = String(product.categoryId).trim()
    if (product.category !== undefined) payload.category = String(product.category).trim()
    if (product.material !== undefined) payload.material = String(product.material).trim()
    if (product.dimensions !== undefined) payload.dimensions = String(product.dimensions).trim()
    if (product.features !== undefined) {
      payload.features = Array.isArray(product.features) ? product.features.map(String).filter(Boolean) : []
    }
    if (product.featured !== undefined) payload.featured = Boolean(product.featured)
    if (product.enabled !== undefined) payload.enabled = Boolean(product.enabled)

    await updateDoc(docRef, payload)
    const updatedSnap = await getDoc(docRef)

    return normalizeProduct(id, updatedSnap.data() || payload)
  } catch (err: any) {
    console.error(`Error updating product (${id}) in Firestore:`, err?.message || err)
    throw new Error(err?.message || 'Failed to update product.')
  }
}

/**
 * Delete a product document from Firestore and safely remove its Cloudinary asset if present.
 */
export async function deleteProduct(id: string, imagePublicId?: string): Promise<boolean> {
  try {
    let targetPublicId = imagePublicId
    if (!targetPublicId) {
      const existing = await getProductById(id)
      if (existing?.imagePublicId) {
        targetPublicId = existing.imagePublicId
      }
    }

    // 1. Delete Firestore Document
    await deleteDoc(doc(db, 'products', id))

    // 2. Clean up Cloudinary asset if public ID is present
    if (targetPublicId) {
      try {
        await deleteCloudinaryImage(targetPublicId)
      } catch (cloudErr) {
        console.warn(`Could not delete Cloudinary asset (${targetPublicId}):`, cloudErr)
      }
    }

    return true
  } catch (err: any) {
    console.error(`Error deleting product (${id}) from Firestore:`, err?.message || err)
    throw new Error(err?.message || 'Failed to delete product.')
  }
}
