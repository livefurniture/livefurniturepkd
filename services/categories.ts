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

export interface Category {
  id: string
  name: string
  slug: string
  description: string
  displayOrder: number
  enabled: boolean
  createdAt: string
  updatedAt: string
}

export type CategoryInput = Omit<Category, 'id' | 'createdAt' | 'updatedAt'>

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

export function normalizeCategory(id: string, data: DocumentData): Category {
  return {
    id,
    name: String(data.name || ''),
    slug: String(data.slug || data.name || '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, ''),
    description: String(data.description || ''),
    displayOrder: typeof data.displayOrder === 'number' ? data.displayOrder : 99,
    enabled: data.enabled !== false,
    createdAt: formatTimestamp(data.createdAt),
    updatedAt: formatTimestamp(data.updatedAt),
  }
}

/**
 * Fetch categories from Firestore.
 * By default (public view), filters exclusively for `enabled == true`.
 * Admin console can specify `{ includeDisabled: true }` to retrieve all categories.
 */
export async function getCategories({
  includeDisabled = false,
}: {
  includeDisabled?: boolean
} = {}): Promise<Category[]> {
  try {
    const categoriesRef = collection(db, 'categories')
    const q = includeDisabled
      ? query(categoriesRef)
      : query(categoriesRef, where('enabled', '==', true))

    const snapshot = await getDocs(q)
    const list: Category[] = snapshot.docs
      .map((docSnap: QueryDocumentSnapshot) =>
        normalizeCategory(docSnap.id, docSnap.data())
      )
      .filter((c) => c.name.trim().length > 0) // Guard against malformed documents

    // Sort by displayOrder ascending
    return list.sort((a, b) => a.displayOrder - b.displayOrder)
  } catch (err: any) {
    console.error('Error fetching categories from Firestore:', err?.message || err)
    throw new Error(err?.message || 'Failed to fetch categories from database.')
  }
}

/**
 * Fetch enabled categories exclusively for public consumer components.
 */
export async function getEnabledCategories(): Promise<Category[]> {
  return getCategories({ includeDisabled: false })
}

/**
 * Fetch a single category by ID.
 */
export async function getCategoryById(id: string): Promise<Category | null> {
  try {
    const docRef = doc(db, 'categories', id)
    const docSnap = await getDoc(docRef)
    if (!docSnap.exists()) return null
    return normalizeCategory(docSnap.id, docSnap.data())
  } catch (err: any) {
    console.error(`Error fetching category (${id}):`, err?.message || err)
    return null
  }
}

/**
 * Create a new category in Firestore.
 */
export async function createCategory(data: Partial<CategoryInput>): Promise<Category> {
  try {
    const name = String(data.name || '').trim()
    if (!name) {
      throw new Error('Category name is required.')
    }

    const slug = String(data.slug || name)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')

    const payload = {
      name,
      slug,
      description: String(data.description || '').trim(),
      displayOrder: typeof data.displayOrder === 'number' ? data.displayOrder : 99,
      enabled: data.enabled !== false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }

    const docRef = await addDoc(collection(db, 'categories'), payload)
    const createdSnap = await getDoc(docRef)

    return normalizeCategory(docRef.id, createdSnap.data() || payload)
  } catch (err: any) {
    console.error('Error creating category in Firestore:', err?.message || err)
    throw new Error(err?.message || 'Failed to create category in database.')
  }
}

/**
 * Update an existing category in Firestore.
 */
export async function updateCategory(id: string, data: Partial<CategoryInput>): Promise<Category> {
  try {
    const docRef = doc(db, 'categories', id)
    const existingSnap = await getDoc(docRef)
    const previousName = existingSnap.exists() ? String(existingSnap.data()?.name || '') : ''

    const payload: Record<string, any> = {
      updatedAt: serverTimestamp(),
    }

    if (data.name !== undefined) {
      const name = String(data.name).trim()
      if (!name) throw new Error('Category name cannot be empty.')
      payload.name = name
    }
    if (data.slug !== undefined) {
      payload.slug = String(data.slug).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    }
    if (data.description !== undefined) payload.description = String(data.description).trim()
    if (data.displayOrder !== undefined) payload.displayOrder = Number(data.displayOrder)
    if (data.enabled !== undefined) payload.enabled = Boolean(data.enabled)

    await updateDoc(docRef, payload)
    const updatedSnap = await getDoc(docRef)

    // If category name changed, cascade update to assigned products in background
    if (payload.name && payload.name !== previousName) {
      try {
        const productsRef = collection(db, 'products')
        const q = query(productsRef, where('categoryId', '==', id))
        const snapshot = await getDocs(q)
        const updatePromises = snapshot.docs.map((pDoc) =>
          updateDoc(doc(db, 'products', pDoc.id), {
            category: payload.name,
            updatedAt: serverTimestamp(),
          })
        )
        await Promise.all(updatePromises)
      } catch (cascadeErr) {
        console.warn('Could not cascade update product category names:', cascadeErr)
      }
    }

    return normalizeCategory(id, updatedSnap.data() || payload)
  } catch (err: any) {
    console.error(`Error updating category (${id}) in Firestore:`, err?.message || err)
    throw new Error(err?.message || 'Failed to update category.')
  }
}

/**
 * Toggle category enabled status directly.
 */
export async function toggleCategoryEnabled(id: string, enabled: boolean): Promise<Category> {
  return updateCategory(id, { enabled })
}

/**
 * Delete a category with safety check preventing deletion if active products are assigned.
 */
export async function deleteCategory(id: string): Promise<boolean> {
  try {
    const docRef = doc(db, 'categories', id)
    const existingSnap = await getDoc(docRef)
    const categoryName = existingSnap.exists() ? String(existingSnap.data()?.name || '') : ''

    // 1. Safety verification: Check for assigned products by categoryId
    const productsRef = collection(db, 'products')
    const assignedById = await getDocs(query(productsRef, where('categoryId', '==', id)))
    let count = assignedById.size

    // Fallback: check by category name if legacy products had missing categoryId
    if (count === 0 && categoryName) {
      const assignedByName = await getDocs(query(productsRef, where('category', '==', categoryName)))
      count = assignedByName.size
    }

    if (count > 0) {
      throw new Error(
        `Category cannot be deleted because ${count} ${count === 1 ? 'product is' : 'products are'} currently assigned to it. Please reassign the products to another category first.`
      )
    }

    // 2. Delete Firestore category document
    await deleteDoc(docRef)
    return true
  } catch (err: any) {
    console.error(`Error deleting category (${id}):`, err?.message || err)
    throw err
  }
}
