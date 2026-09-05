'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  getCategories,
  createCategory,
  updateCategory,
  toggleCategoryEnabled,
  deleteCategory,
  type Category,
} from '@/services/categories'
import { getProducts, type Product } from '@/services/products'
import {
  FolderTree,
  Plus,
  Search,
  Edit2,
  Trash2,
  Check,
  X,
  AlertCircle,
  CheckCircle2,
  Loader2,
  RefreshCw,
  Eye,
  EyeOff,
  Layers,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Search filter
  const [searchQuery, setSearchQuery] = useState('')

  // Modal / Form state
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [deleteConfirmCategory, setDeleteConfirmCategory] = useState<Category | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  // Form Fields
  const [formName, setFormName] = useState('')
  const [formSlug, setFormSlug] = useState('')
  const [formDescription, setFormDescription] = useState('')
  const [formDisplayOrder, setFormDisplayOrder] = useState(1)
  const [formEnabled, setFormEnabled] = useState(true)

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
      const [cats, prods] = await Promise.all([
        getCategories({ includeDisabled: true }),
        getProducts({ includeDisabled: true }),
      ])
      setCategories(cats)
      setProducts(prods)
    } catch (err: any) {
      console.error('Error fetching categories:', err)
      setError(err?.message || 'Failed to fetch categories from database.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // Product counts per category
  const productCountMap = useMemo(() => {
    const map: Record<string, number> = {}
    products.forEach((p) => {
      if (p.categoryId) {
        map[p.categoryId] = (map[p.categoryId] || 0) + 1
      } else if (p.category) {
        // Fallback for legacy products
        const matched = categories.find(
          (c) => c.name.toLowerCase() === p.category.toLowerCase()
        )
        if (matched) {
          map[matched.id] = (map[matched.id] || 0) + 1
        }
      }
    })
    return map
  }, [products, categories])

  // Filtered categories
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories
    const q = searchQuery.toLowerCase()
    return categories.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.slug.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
    )
  }, [categories, searchQuery])

  // Form open helpers
  const openAddForm = () => {
    setEditingCategory(null)
    setFormName('')
    setFormSlug('')
    setFormDescription('')
    setFormDisplayOrder(categories.length + 1)
    setFormEnabled(true)
    setFormError(null)
    setIsFormOpen(true)
  }

  const openEditForm = (cat: Category) => {
    setEditingCategory(cat)
    setFormName(cat.name)
    setFormSlug(cat.slug)
    setFormDescription(cat.description || '')
    setFormDisplayOrder(cat.displayOrder)
    setFormEnabled(cat.enabled)
    setFormError(null)
    setIsFormOpen(true)
  }

  const closeForm = () => {
    setIsFormOpen(false)
    setEditingCategory(null)
    setFormError(null)
  }

  // Handle Form Submit (Create / Update)
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    if (!formName.trim()) {
      setFormError('Category Name is required.')
      return
    }

    setIsSaving(true)

    try {
      const payload = {
        name: formName.trim(),
        slug: formSlug.trim() || undefined,
        description: formDescription.trim(),
        displayOrder: Number(formDisplayOrder) || 1,
        enabled: formEnabled,
      }

      if (editingCategory) {
        const updated = await updateCategory(editingCategory.id, payload)
        setCategories((prev) =>
          prev
            .map((c) => (c.id === updated.id ? updated : c))
            .sort((a, b) => a.displayOrder - b.displayOrder)
        )
        showToast(`Category "${payload.name}" updated successfully!`)
      } else {
        const created = await createCategory(payload)
        setCategories((prev) =>
          [...prev, created].sort((a, b) => a.displayOrder - b.displayOrder)
        )
        showToast(`Category "${payload.name}" created successfully!`)
      }

      closeForm()
    } catch (err: any) {
      console.error('Save category error:', err)
      setFormError(err?.message || 'Failed to save category.')
    } finally {
      setIsSaving(false)
    }
  }

  // Toggle Category Enabled Status
  const handleToggleEnabled = async (cat: Category) => {
    try {
      const updated = await toggleCategoryEnabled(cat.id, !cat.enabled)
      setCategories((prev) =>
        prev.map((c) => (c.id === updated.id ? updated : c))
      )
      showToast(
        `Category "${cat.name}" is now ${updated.enabled ? 'Enabled' : 'Disabled'}.`
      )
    } catch (err: any) {
      showToast(err?.message || 'Failed to update category status.', 'error')
    }
  }

  // Delete Category
  const handleDeleteConfirm = async () => {
    if (!deleteConfirmCategory) return
    setIsDeleting(true)
    try {
      await deleteCategory(deleteConfirmCategory.id)
      setCategories((prev) =>
        prev.filter((c) => c.id !== deleteConfirmCategory.id)
      )
      showToast(`Category "${deleteConfirmCategory.name}" deleted successfully.`)
      setDeleteConfirmCategory(null)
    } catch (err: any) {
      console.error('Delete category error:', err)
      showToast(err?.message || 'Failed to delete category.', 'error')
    } finally {
      setIsDeleting(false)
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
              : 'bg-destructive text-white border-destructive'
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

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground">Category Management</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage official product categories in Firestore. Categories here are the single source of truth for the entire website.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={loadData}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-xs font-medium text-foreground shadow-sm hover:bg-muted transition-colors disabled:opacity-50"
          >
            <RefreshCw className={cn('h-3.5 w-3.5', loading ? 'animate-spin' : '')} />
            Refresh
          </button>
          <button
            type="button"
            onClick={openAddForm}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Plus className="h-4 w-4" />
            Add New Category
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-4 bg-card border border-border p-4 rounded-2xl shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by category name, slug, or description..."
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
        <div className="text-xs text-muted-foreground whitespace-nowrap">
          Total: <span className="font-semibold text-foreground">{categories.length}</span> categories
        </div>
      </div>

      {/* Main Categories Table */}
      <div className="border border-border rounded-2xl bg-card overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-16 flex flex-col items-center justify-center space-y-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm font-medium text-muted-foreground">Loading categories from Firestore...</p>
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
              Retry
            </button>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <FolderTree className="mx-auto h-10 w-10 text-muted-foreground/50" />
            <h3 className="text-base font-semibold text-foreground">No categories found</h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              {searchQuery
                ? 'Try adjusting your search query.'
                : 'Your Firestore categories collection is empty. Click "Add New Category" to create your first category.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="border-b border-border bg-muted/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="py-4 px-6 w-16 text-center">Order</th>
                  <th className="py-4 px-6">Category Name</th>
                  <th className="py-4 px-6">Slug</th>
                  <th className="py-4 px-6">Assigned Products</th>
                  <th className="py-4 px-6 text-center">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredCategories.map((cat) => {
                  const assignedCount = productCountMap[cat.id] || 0
                  return (
                    <tr key={cat.id} className="hover:bg-muted/20 transition-colors">
                      {/* Display Order */}
                      <td className="py-4 px-6 text-center font-mono font-medium text-muted-foreground">
                        {cat.displayOrder}
                      </td>

                      {/* Name & Description */}
                      <td className="py-4 px-6">
                        <div>
                          <span className="font-semibold text-foreground text-sm">{cat.name}</span>
                          {cat.description && (
                            <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1 max-w-md">
                              {cat.description}
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Slug */}
                      <td className="py-4 px-6 font-mono text-xs text-muted-foreground">
                        {cat.slug}
                      </td>

                      {/* Assigned Products Count */}
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-foreground">
                          <Layers className="h-3.5 w-3.5 text-primary" />
                          <span>{assignedCount} {assignedCount === 1 ? 'product' : 'products'}</span>
                        </span>
                      </td>

                      {/* Status Toggle */}
                      <td className="py-4 px-6 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleEnabled(cat)}
                          className={cn(
                            'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors',
                            cat.enabled
                              ? 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20'
                              : 'bg-muted text-muted-foreground hover:bg-muted/80'
                          )}
                        >
                          {cat.enabled ? (
                            <>
                              <Eye className="h-3.5 w-3.5" />
                              <span>Enabled</span>
                            </>
                          ) : (
                            <>
                              <EyeOff className="h-3.5 w-3.5" />
                              <span>Disabled</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openEditForm(cat)}
                            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                            title="Edit Category"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmCategory(cat)}
                            className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                            title="Delete Category"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit Category Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl bg-card border border-border shadow-2xl p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={closeForm}
              className="absolute top-5 right-5 p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted"
            >
              <X className="h-5 w-5" />
            </button>

            <h2 className="font-serif text-2xl font-bold text-foreground">
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              Changes will immediately update Firestore and synchronize across all products.
            </p>

            {formError && (
              <div className="mt-4 p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmitForm} className="mt-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => {
                    setFormName(e.target.value)
                    if (!editingCategory) {
                      setFormSlug(
                        e.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9]+/g, '-')
                          .replace(/^-|-$/g, '')
                      )
                    }
                  }}
                  placeholder="e.g. Living Room"
                  className="w-full rounded-xl border border-border bg-background py-2.5 px-3.5 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    value={formSlug}
                    onChange={(e) => setFormSlug(e.target.value)}
                    placeholder="e.g. living-room"
                    className="w-full rounded-xl border border-border bg-background py-2.5 px-3.5 text-sm font-mono text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formDisplayOrder}
                    onChange={(e) => setFormDisplayOrder(Number(e.target.value))}
                    min={1}
                    className="w-full rounded-xl border border-border bg-background py-2.5 px-3.5 text-sm font-mono text-foreground outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Describe the collection or types of furniture in this category..."
                  className="w-full rounded-xl border border-border bg-background py-2.5 px-3.5 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-primary resize-none"
                />
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-muted/20">
                <div>
                  <span className="text-xs font-semibold text-foreground block">
                    Public Visibility (Enabled)
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    Enabled categories appear in public navigation & product filters.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={formEnabled}
                  onChange={(e) => setFormEnabled(e.target.checked)}
                  className="h-5 w-5 rounded border-border text-primary focus:ring-primary cursor-pointer"
                />
              </div>

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
                  {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                  <span>{editingCategory ? 'Update Category' : 'Create Category'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-card border border-border shadow-2xl p-6 relative">
            <h3 className="font-serif text-xl font-bold text-foreground">
              Delete Category &ldquo;{deleteConfirmCategory.name}&rdquo;?
            </h3>

            {(productCountMap[deleteConfirmCategory.id] || 0) > 0 ? (
              <div className="mt-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 text-xs space-y-2">
                <div className="flex items-center gap-2 font-semibold">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>Deletion Blocked for Safety</span>
                </div>
                <p className="leading-relaxed">
                  There are currently <strong>{productCountMap[deleteConfirmCategory.id]}</strong> products assigned to this category.
                  To prevent orphaned products, please reassign those products in Product Management before deleting this category.
                </p>
              </div>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Are you sure you want to delete this category? This action removes the document from Firestore and cannot be undone.
              </p>
            )}

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteConfirmCategory(null)}
                className="rounded-xl border border-border px-4 py-2.5 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
              >
                Close
              </button>
              {(productCountMap[deleteConfirmCategory.id] || 0) === 0 && (
                <button
                  type="button"
                  onClick={handleDeleteConfirm}
                  disabled={isDeleting}
                  className="inline-flex items-center gap-2 rounded-xl bg-destructive px-5 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-destructive/90 transition-colors disabled:opacity-50"
                >
                  {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                  <span>Delete Category</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
