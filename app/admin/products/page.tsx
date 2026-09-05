'use client'

import { Suspense, useEffect, useMemo, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  type Product,
} from '@/services/products'
import {
  getCategories,
  type Category,
} from '@/services/categories'
import { uploadProductImage } from '@/services/storage'
import {
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Star,
  Upload,
  X,
  Check,
  AlertCircle,
  Loader2,
  RefreshCw,
  Image as ImageIcon,
  CheckCircle2,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function AdminProductsPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center font-medium text-muted-foreground">Loading products manager...</div>}>
      <AdminProductsContent />
    </Suspense>
  )
}

function AdminProductsContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [featuredFilter, setFeaturedFilter] = useState<'All' | 'Featured' | 'Standard'>('All')

  // Modal / Form state
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [deleteConfirmProduct, setDeleteConfirmProduct] = useState<Product | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Form Fields
  const [formName, setFormName] = useState('')
  const [formDescription, setFormDescription] = useState('')
  const [formCategoryId, setFormCategoryId] = useState('')
  const [formMaterial, setFormMaterial] = useState('')
  const [formDimensions, setFormDimensions] = useState('')
  const [formFeatures, setFormFeatures] = useState<string[]>([])
  const [formFeatured, setFormFeatured] = useState(false)
  const [formImageUrl, setFormImageUrl] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const [isSaving, setIsSaving] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  // Toast Notification
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ type, message })
    setTimeout(() => {
      setToast(null)
    }, 4000)
  }

  const loadData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [prodList, catList] = await Promise.all([
        getProducts({ includeDisabled: true }),
        getCategories({ includeDisabled: true }),
      ])
      setProducts(prodList)
      setCategories(catList)
    } catch (err: any) {
      console.error('Error fetching data:', err)
      setError(err?.message || 'Failed to fetch products and categories from database.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // Handle URL query parameters (e.g. ?action=new or ?edit=id)
  useEffect(() => {
    const action = searchParams.get('action')
    const editId = searchParams.get('edit')

    if (action === 'new') {
      openAddForm()
    } else if (editId && products.length > 0) {
      const target = products.find((p) => p.id === editId)
      if (target) openEditForm(target)
    }
  }, [searchParams, products, categories])

  // Filtered product list
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchQuery =
        !searchQuery.trim() ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.material.toLowerCase().includes(searchQuery.toLowerCase())

      const selectedCat = categories.find((c) => c.id === categoryFilter)
      const matchCategory =
        categoryFilter === 'All' ||
        p.categoryId === categoryFilter ||
        (selectedCat && p.category.toLowerCase() === selectedCat.name.toLowerCase()) ||
        p.category === categoryFilter

      const matchFeatured =
        featuredFilter === 'All' ||
        (featuredFilter === 'Featured' && p.featured) ||
        (featuredFilter === 'Standard' && !p.featured)

      return matchQuery && matchCategory && matchFeatured
    })
  }, [products, categories, searchQuery, categoryFilter, featuredFilter])

  // Form open helpers
  const openAddForm = () => {
    setEditingProduct(null)
    setFormName('')
    setFormDescription('')
    setFormCategoryId(categories[0]?.id || '')
    setFormMaterial('')
    setFormDimensions('')
    setFormFeatures([''])
    setFormFeatured(false)
    setFormImageUrl('')
    setSelectedFile(null)
    setImagePreview(null)
    setFormError(null)
    setIsFormOpen(true)
  }

  const openEditForm = (product: Product) => {
    setEditingProduct(product)
    setFormName(product.name)
    setFormDescription(product.description || '')

    const matchedCat =
      categories.find((c) => c.id === product.categoryId) ||
      categories.find((c) => c.name.toLowerCase() === (product.category || '').toLowerCase())

    setFormCategoryId(matchedCat ? matchedCat.id : (categories[0]?.id || ''))
    setFormMaterial(product.material || '')
    setFormDimensions(product.dimensions || '')
    setFormFeatures(product.features && product.features.length > 0 ? product.features : [''])
    setFormFeatured(Boolean(product.featured))
    setFormImageUrl(product.image || '')
    setSelectedFile(null)
    setImagePreview(product.image || null)
    setFormError(null)
    setIsFormOpen(true)
  }

  const closeForm = () => {
    setIsFormOpen(false)
    setEditingProduct(null)
    setSelectedFile(null)
    setImagePreview(null)
    setFormError(null)
    router.replace('/admin/products')
  }

  // Handle Image File selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  // Feature Input Handlers
  const handleFeatureChange = (index: number, value: string) => {
    const updated = [...formFeatures]
    updated[index] = value
    setFormFeatures(updated)
  }

  const addFeatureInput = () => {
    setFormFeatures([...formFeatures, ''])
  }

  const removeFeatureInput = (index: number) => {
    setFormFeatures(formFeatures.filter((_, i) => i !== index))
  }

  // Submit Form (Create / Update)
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    if (!formName.trim()) {
      setFormError('Product Name is required.')
      return
    }

    const selectedCat = categories.find((c) => c.id === formCategoryId)
    if (!selectedCat) {
      setFormError('Please select a valid Category from Firestore.')
      return
    }

    setIsSaving(true)

    try {
      let finalImageUrl = formImageUrl

      // If a new image file was selected, upload it to Cloudinary Storage first
      if (selectedFile) {
        finalImageUrl = await uploadProductImage(selectedFile)
      }

      if (!finalImageUrl) {
        finalImageUrl = '/placeholder.svg' // Fallback image if none specified
      }

      const cleanFeatures = formFeatures.map((f) => f.trim()).filter(Boolean)

      const payload = {
        name: formName.trim(),
        description: formDescription.trim(),
        categoryId: selectedCat.id,
        category: selectedCat.name,
        material: formMaterial.trim(),
        dimensions: formDimensions.trim(),
        features: cleanFeatures,
        featured: formFeatured,
        image: finalImageUrl,
      }

      if (editingProduct) {
        await updateProduct(editingProduct.id, payload)
        showToast(`Product "${payload.name}" updated successfully!`)
      } else {
        await createProduct(payload)
        showToast(`New product "${payload.name}" added successfully!`)
      }

      await loadData()
      closeForm()
    } catch (err: any) {
      console.error('Save product error:', err)
      setFormError(err?.message || 'Failed to save product. Please check permissions.')
    } finally {
      setIsSaving(false)
    }
  }

  // Confirm and Delete Product
  const handleDeleteConfirm = async () => {
    if (!deleteConfirmProduct) return
    setIsDeleting(true)
    try {
      await deleteProduct(deleteConfirmProduct.id)
      showToast(`Product "${deleteConfirmProduct.name}" deleted successfully.`)
      setDeleteConfirmProduct(null)
      await loadData()
    } catch (err: any) {
      console.error('Delete product error:', err)
      showToast(err?.message || 'Failed to delete product.', 'error')
    } finally {
      setIsDeleting(false)
    }
  }

  // Quick Toggle Featured status directly in table
  const handleToggleFeatured = async (product: Product) => {
    try {
      const updated = await updateProduct(product.id, { featured: !product.featured })
      setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))
      showToast(
        `"${product.name}" marked as ${updated.featured ? 'Featured' : 'Standard'}.`,
      )
    } catch (err: any) {
      showToast('Failed to update featured status.', 'error')
    }
  }

  return (
    <div className="space-y-8">
      {/* Toast Alert */}
      {toast && (
        <div
          className={cn(
            'fixed bottom-6 right-6 z-[100] flex items-center gap-3 rounded-2xl px-5 py-3.5 shadow-xl border text-sm font-medium transition-all animate-bounce',
            toast.type === 'success'
              ? 'bg-emerald-600 text-white border-emerald-500'
              : 'bg-destructive text-white border-destructive',
          )}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="h-5 w-5 shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Top Bar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground">Product Management</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your furniture catalog, upload images, and control featured items.
          </p>
        </div>
        <button
          type="button"
          onClick={openAddForm}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <Plus className="h-4 w-4" />
          Add New Product
        </button>
      </div>

      {/* Search and Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card border border-border p-4 rounded-2xl shadow-sm">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by product name, category, material..."
            className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground/70 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Category Filter Dropdown */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground hidden sm:inline-block" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded-xl border border-border bg-background py-2.5 px-3 text-xs sm:text-sm font-medium text-foreground outline-none focus:border-primary"
            >
              <option value="All">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name} {!cat.enabled ? '(Disabled)' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Featured Filter Dropdown */}
          <select
            value={featuredFilter}
            onChange={(e) => setFeaturedFilter(e.target.value as any)}
            className="rounded-xl border border-border bg-background py-2.5 px-3 text-xs sm:text-sm font-medium text-foreground outline-none focus:border-primary"
          >
            <option value="All">All Statuses</option>
            <option value="Featured">Featured Only</option>
            <option value="Standard">Standard Only</option>
          </select>
        </div>
      </div>

      {/* Main Table View */}
      <div className="border border-border rounded-2xl bg-card overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-16 flex flex-col items-center justify-center space-y-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm font-medium text-muted-foreground">Loading products...</p>
          </div>
        ) : error ? (
          <div className="p-12 text-center text-destructive">
            <AlertCircle className="mx-auto h-8 w-8 mb-2" />
            <p className="text-sm font-semibold">{error}</p>
            <button
              type="button"
              onClick={loadData}
              className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Retry Fetching
            </button>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <ImageIcon className="mx-auto h-10 w-10 text-muted-foreground/50" />
            <h3 className="text-base font-semibold text-foreground">No products found</h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              {searchQuery || categoryFilter !== 'All' || featuredFilter !== 'All'
                ? 'Try adjusting your search query or filter options.'
                : 'Your database is currently empty. Click "Add New Product" to populate your catalog.'}
            </p>
            {(searchQuery || categoryFilter !== 'All' || featuredFilter !== 'All') && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('')
                  setCategoryFilter('All')
                  setFeaturedFilter('All')
                }}
                className="mt-2 text-xs font-semibold text-primary hover:underline"
              >
                Reset Filters
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="border-b border-border bg-muted/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="py-4 px-6">Image</th>
                  <th className="py-4 px-6">Product Name</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Material</th>
                  <th className="py-4 px-6 text-center">Featured</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-muted/20 transition-colors">
                    {/* Image */}
                    <td className="py-3.5 px-6">
                      <div className="relative h-12 w-16 rounded-lg overflow-hidden bg-muted border border-border shrink-0">
                        <Image
                          src={product.image || '/placeholder.svg'}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </td>

                    {/* Name */}
                    <td className="py-3.5 px-6 font-semibold text-foreground">
                      <div>
                        <span>{product.name}</span>
                        {product.dimensions && (
                          <span className="block text-[11px] font-normal text-muted-foreground">
                            {product.dimensions}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-6 text-muted-foreground">
                      <span className="inline-flex rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
                        {categories.find((c) => c.id === product.categoryId)?.name || product.category}
                      </span>
                    </td>

                    {/* Material */}
                    <td className="py-3.5 px-6 text-muted-foreground truncate max-w-[180px]">
                      {product.material || '—'}
                    </td>

                    {/* Featured Toggle */}
                    <td className="py-3.5 px-6 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleFeatured(product)}
                        title="Click to toggle featured status"
                        className={cn(
                          'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors',
                          product.featured
                            ? 'bg-amber-500/15 text-amber-600 border border-amber-500/30'
                            : 'bg-muted text-muted-foreground hover:bg-muted/80',
                        )}
                      >
                        <Star
                          className={cn('h-3.5 w-3.5', product.featured ? 'fill-amber-500 text-amber-500' : '')}
                        />
                        {product.featured ? 'Featured' : 'Standard'}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEditForm(product)}
                          className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                          title="Edit Product"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmProduct(product)}
                          className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Product Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-card border border-border rounded-3xl shadow-2xl overflow-hidden my-8">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-border bg-muted/30">
              <h2 className="font-serif text-xl font-bold text-foreground">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button
                type="button"
                onClick={closeForm}
                className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSubmitForm} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              {formError && (
                <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-start gap-2.5">
                  <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Product Name */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Heritage Solid Wood Box Bed"
                  className="w-full rounded-xl border border-border bg-background py-2.5 px-3.5 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-primary"
                />
              </div>

              {/* Category Selection */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Category *
                  </label>
                  <Link
                    href="/admin/categories"
                    target="_blank"
                    className="text-xs text-primary hover:underline"
                  >
                    Manage Categories &rarr;
                  </Link>
                </div>
                <select
                  required
                  value={formCategoryId}
                  onChange={(e) => setFormCategoryId(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background py-2.5 px-3.5 text-sm text-foreground outline-none focus:border-primary"
                >
                  {categories.length === 0 && (
                    <option value="">No categories found - create one in Category Management</option>
                  )}
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name} {!cat.enabled ? '(Disabled)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Material & Dimensions */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Material
                  </label>
                  <input
                    type="text"
                    value={formMaterial}
                    onChange={(e) => setFormMaterial(e.target.value)}
                    placeholder="e.g. Solid Teak / Metal Frame"
                    className="w-full rounded-xl border border-border bg-background py-2.5 px-3.5 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Dimensions / Measurements
                  </label>
                  <input
                    type="text"
                    value={formDimensions}
                    onChange={(e) => setFormDimensions(e.target.value)}
                    placeholder='e.g. 78" L x 72" W x 42" H'
                    className="w-full rounded-xl border border-border bg-background py-2.5 px-3.5 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Provide a detailed commercial description of craftsmanship, joinery, and features..."
                  className="w-full rounded-xl border border-border bg-background py-2.5 px-3.5 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-primary resize-none"
                />
              </div>

              {/* Dynamic Features List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Key Features & Bullet Points
                  </label>
                  <button
                    type="button"
                    onClick={addFeatureInput}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add Feature
                  </button>
                </div>

                <div className="space-y-2">
                  {formFeatures.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={feat}
                        onChange={(e) => handleFeatureChange(idx, e.target.value)}
                        placeholder={`Feature ${idx + 1} (e.g. Hydraulic storage lift)`}
                        className="flex-1 rounded-xl border border-border bg-background py-2 px-3.5 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-primary"
                      />
                      {formFeatures.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeFeatureInput(idx)}
                          className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Featured Toggle */}
              <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/20">
                <div>
                  <span className="text-sm font-semibold text-foreground block">
                    Highlight as Featured Product
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Featured products appear prominently on homepage banners.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={formFeatured}
                  onChange={(e) => setFormFeatured(e.target.checked)}
                  className="h-5 w-5 rounded border-border text-primary focus:ring-primary cursor-pointer"
                />
              </div>

              {/* Image Upload Component */}
              <div className="space-y-3">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Product Image (Cloudinary Storage)
                </label>

                {imagePreview && (
                  <div className="relative h-44 w-full rounded-2xl overflow-hidden bg-muted border border-border">
                    <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFile(null)
                        setImagePreview(null)
                        setFormImageUrl('')
                      }}
                      className="absolute top-3 right-3 p-1.5 rounded-full bg-black/60 text-white hover:bg-black"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}

                <div className="grid sm:grid-cols-2 gap-3">
                  {/* Local File Upload */}
                  <label className="cursor-pointer flex flex-col items-center justify-center p-4 rounded-2xl border border-dashed border-border hover:border-primary/60 bg-muted/20 transition-colors text-center">
                    <Upload className="h-5 w-5 text-primary mb-1" />
                    <span className="text-xs font-medium text-foreground">
                      {selectedFile ? selectedFile.name : 'Upload New File'}
                    </span>
                    <span className="text-[11px] text-muted-foreground mt-0.5">
                      PNG, JPG, WebP up to 5MB
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>

                  {/* Or Direct URL Input */}
                  <div className="flex flex-col justify-center p-4 rounded-2xl border border-border bg-muted/20 space-y-2">
                    <span className="text-xs font-medium text-muted-foreground">
                      Or Image URL:
                    </span>
                    <input
                      type="text"
                      value={formImageUrl}
                      onChange={(e) => {
                        setFormImageUrl(e.target.value)
                        setImagePreview(e.target.value)
                      }}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full rounded-xl border border-border bg-background py-1.5 px-3 text-xs text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={closeForm}
                  className="rounded-xl border border-border px-5 py-2.5 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-xs font-semibold text-primary-foreground shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4" />
                      {editingProduct ? 'Update Product' : 'Save Product'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-card border border-border rounded-3xl shadow-2xl p-6 space-y-5 text-center">
            <div className="h-12 w-12 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center mx-auto">
              <Trash2 className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold text-foreground">Delete Product?</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Are you sure you want to delete{' '}
                <strong className="text-foreground">"{deleteConfirmProduct.name}"</strong>? This action
                cannot be undone.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmProduct(null)}
                disabled={isDeleting}
                className="rounded-xl border border-border px-5 py-2.5 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="inline-flex items-center gap-2 rounded-xl bg-destructive px-5 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-destructive/90 transition-colors disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Yes, Delete Product'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
