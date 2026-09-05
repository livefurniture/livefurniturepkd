import { getAdminToken } from '@/services/auth'

export interface UploadImageResult {
  imageUrl: string
  imagePublicId: string
}

/**
 * Upload an image file securely to Cloudinary via the server-side API route.
 * Attaches the current administrator's Firebase ID token for authoritative verification.
 */
export async function uploadImage(file: File): Promise<UploadImageResult> {
  const token = await getAdminToken()
  if (!token) {
    throw new Error('Authentication required: You must be signed in as an administrator to upload images.')
  }

  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch('/api/admin/upload', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })

  const data = await response.json()

  if (!response.ok) {
    console.error('Image upload API error:', data)
    throw new Error(data?.error || `Image upload failed with status ${response.status}.`)
  }

  return {
    imageUrl: data.imageUrl,
    imagePublicId: data.imagePublicId,
  }
}

/**
 * Delete an asset from Cloudinary via the authenticated server-side route handler.
 */
export async function deleteImage(imagePublicId: string): Promise<boolean> {
  if (!imagePublicId || !imagePublicId.trim()) return false

  const token = await getAdminToken()
  if (!token) {
    console.warn('Cannot delete Cloudinary image: No active admin token.')
    return false
  }

  try {
    const response = await fetch('/api/admin/delete-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ imagePublicId: imagePublicId.trim() }),
    })

    const data = await response.json()
    if (!response.ok) {
      console.warn('Cloudinary delete image API response error:', data)
      return false
    }

    return true
  } catch (err) {
    console.error('Failed to request Cloudinary image deletion:', err)
    return false
  }
}

/**
 * Compatibility alias: Uploads image and returns URL string.
 */
export async function uploadProductImage(file: File): Promise<string> {
  const result = await uploadImage(file)
  return result.imageUrl
}

/**
 * Compatibility alias: Uploads image and returns full { imageUrl, imagePublicId } metadata.
 */
export async function uploadProductImageWithMeta(file: File): Promise<UploadImageResult> {
  return uploadImage(file)
}

/**
 * Compatibility alias: Deletes image by Cloudinary Public ID.
 */
export async function deleteCloudinaryImage(imagePublicId: string): Promise<boolean> {
  return deleteImage(imagePublicId)
}
