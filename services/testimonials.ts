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

export interface Testimonial {
  id: string
  customerName: string
  role?: string // Preserved from site-data.ts
  review: string
  rating: number
  location: string
  date: string
  enabled: boolean
  displayOrder: number
  createdAt: string
  updatedAt: string
}

export type TestimonialInput = Omit<Testimonial, 'id' | 'createdAt' | 'updatedAt'>

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

export function normalizeTestimonial(id: string, data: DocumentData): Testimonial {
  return {
    id,
    customerName: String(data.customerName || data.name || ''),
    role: data.role ? String(data.role) : undefined,
    review: String(data.review || data.quote || ''),
    rating: typeof data.rating === 'number' ? Math.max(1, Math.min(5, data.rating)) : 5,
    location: String(data.location || ''),
    date: data.date ? String(data.date) : new Date().toISOString().split('T')[0],
    enabled: data.enabled !== false,
    displayOrder: typeof data.displayOrder === 'number' ? data.displayOrder : 99,
    createdAt: formatTimestamp(data.createdAt),
    updatedAt: formatTimestamp(data.updatedAt),
  }
}

/**
 * Fetch testimonials from Firestore.
 * By default (public view), filters for `enabled == true`.
 * Admin console can specify `{ includeDisabled: true }` to retrieve all testimonials.
 */
export async function getTestimonials({
  includeDisabled = false,
}: {
  includeDisabled?: boolean
} = {}): Promise<Testimonial[]> {
  try {
    const testimonialsRef = collection(db, 'testimonials')
    const q = includeDisabled
      ? query(testimonialsRef)
      : query(testimonialsRef, where('enabled', '==', true))

    const snapshot = await getDocs(q)
    const list: Testimonial[] = snapshot.docs.map((docSnap: QueryDocumentSnapshot) =>
      normalizeTestimonial(docSnap.id, docSnap.data())
    )

    // Sort by displayOrder ascending
    return list.sort((a, b) => a.displayOrder - b.displayOrder)
  } catch (err: any) {
    console.error('Error fetching testimonials from Firestore:', err?.message || err)
    throw new Error(err?.message || 'Failed to fetch testimonials.')
  }
}

/**
 * Fetch enabled testimonials exclusively for public views.
 */
export async function getEnabledTestimonials(): Promise<Testimonial[]> {
  return getTestimonials({ includeDisabled: false })
}

/**
 * Fetch a single testimonial by ID.
 */
export async function getTestimonialById(id: string): Promise<Testimonial | null> {
  try {
    const docRef = doc(db, 'testimonials', id)
    const docSnap = await getDoc(docRef)
    if (!docSnap.exists()) return null
    return normalizeTestimonial(docSnap.id, docSnap.data())
  } catch (err: any) {
    console.error(`Error fetching testimonial (${id}):`, err?.message || err)
    return null
  }
}

/**
 * Create a new testimonial document in Firestore.
 */
export async function createTestimonial(data: Partial<TestimonialInput>): Promise<Testimonial> {
  try {
    const payload: Record<string, any> = {
      customerName: String(data.customerName || '').trim(),
      review: String(data.review || '').trim(),
      rating: typeof data.rating === 'number' ? Math.max(1, Math.min(5, data.rating)) : 5,
      location: String(data.location || '').trim(),
      date: data.date ? String(data.date).trim() : new Date().toISOString().split('T')[0],
      enabled: data.enabled !== false,
      displayOrder: typeof data.displayOrder === 'number' ? data.displayOrder : 99,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }

    if (data.role !== undefined) {
      payload.role = String(data.role).trim()
    }

    const docRef = await addDoc(collection(db, 'testimonials'), payload)
    const createdSnap = await getDoc(docRef)

    return normalizeTestimonial(docRef.id, createdSnap.data() || payload)
  } catch (err: any) {
    console.error('Error creating testimonial in Firestore:', err?.message || err)
    throw new Error(err?.message || 'Failed to create testimonial.')
  }
}

/**
 * Update an existing testimonial document in Firestore.
 */
export async function updateTestimonial(
  id: string,
  data: Partial<TestimonialInput>
): Promise<Testimonial> {
  try {
    const docRef = doc(db, 'testimonials', id)
    const payload: Record<string, any> = {
      updatedAt: serverTimestamp(),
    }

    if (data.customerName !== undefined) payload.customerName = String(data.customerName).trim()
    if (data.role !== undefined) payload.role = String(data.role).trim()
    if (data.review !== undefined) payload.review = String(data.review).trim()
    if (data.rating !== undefined) payload.rating = Math.max(1, Math.min(5, Number(data.rating)))
    if (data.location !== undefined) payload.location = String(data.location).trim()
    if (data.date !== undefined) payload.date = String(data.date).trim()
    if (data.enabled !== undefined) payload.enabled = Boolean(data.enabled)
    if (data.displayOrder !== undefined) payload.displayOrder = Number(data.displayOrder)

    await updateDoc(docRef, payload)
    const updatedSnap = await getDoc(docRef)

    return normalizeTestimonial(id, updatedSnap.data() || payload)
  } catch (err: any) {
    console.error(`Error updating testimonial (${id}) in Firestore:`, err?.message || err)
    throw new Error(err?.message || 'Failed to update testimonial.')
  }
}

/**
 * Toggle testimonial enabled status directly.
 */
export async function toggleTestimonialEnabled(id: string, enabled: boolean): Promise<Testimonial> {
  return updateTestimonial(id, { enabled })
}

/**
 * Delete a testimonial document from Firestore.
 */
export async function deleteTestimonial(id: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, 'testimonials', id))
    return true
  } catch (err: any) {
    console.error(`Error deleting testimonial (${id}):`, err?.message || err)
    throw new Error(err?.message || 'Failed to delete testimonial.')
  }
}
