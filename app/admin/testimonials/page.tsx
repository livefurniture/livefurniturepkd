'use client'

import { Suspense, useEffect, useMemo, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import {
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  toggleTestimonialEnabled,
  deleteTestimonial,
  type Testimonial,
} from '@/services/testimonials'
import {
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Star,
  X,
  Check,
  AlertCircle,
  Loader2,
  RefreshCw,
  MessageSquareQuote,
  CheckCircle2,
  MapPin,
  Calendar,
  Eye,
  EyeOff,
  ArrowUpDown,
} from 'lucide-react'
import { cn } from '@/lib/utils'

function getInitials(name: string): string {
  if (!name) return '?'
  return name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase()
}

export default function AdminTestimonialsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-12 text-center font-medium text-muted-foreground">
          Loading testimonials manager...
        </div>
      }
    >
      <AdminTestimonialsContent />
    </Suspense>
  )
}

function AdminTestimonialsContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'All' | 'Enabled' | 'Disabled'>('All')
  const [ratingFilter, setRatingFilter] = useState<'All' | '5' | '4' | '3' | '2' | '1'>('All')

  // Modal / Form state
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null)
  const [deleteConfirmTestimonial, setDeleteConfirmTestimonial] = useState<Testimonial | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Form Fields
  const [formCustomerName, setFormCustomerName] = useState('')
  const [formRole, setFormRole] = useState('')
  const [formReview, setFormReview] = useState('')
  const [formRating, setFormRating] = useState<number>(5)
  const [formLocation, setFormLocation] = useState('')
  const [formDate, setFormDate] = useState('')
  const [formEnabled, setFormEnabled] = useState(true)
  const [formDisplayOrder, setFormDisplayOrder] = useState<number>(1)

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

  const loadTestimonials = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getTestimonials({ includeDisabled: true })
      setTestimonials(data)
    } catch (err: any) {
      console.error('Error fetching testimonials:', err)
      setError(err?.message || 'Failed to fetch testimonials from database.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTestimonials()
  }, [])

  // Handle URL query parameters (e.g. ?action=new or ?edit=id)
  useEffect(() => {
    const action = searchParams.get('action')
    const editId = searchParams.get('edit')

    if (action === 'new') {
      openAddForm()
    } else if (editId && testimonials.length > 0) {
      const target = testimonials.find((t) => t.id === editId)
      if (target) openEditForm(target)
    }
  }, [searchParams, testimonials])

  // Filtered testimonials list
  const filteredTestimonials = useMemo(() => {
    return testimonials.filter((t) => {
      const query = searchQuery.toLowerCase().trim()
      const matchQuery =
        !query ||
        t.customerName.toLowerCase().includes(query) ||
        (t.role && t.role.toLowerCase().includes(query)) ||
        t.review.toLowerCase().includes(query) ||
        t.location.toLowerCase().includes(query)

      const matchStatus =
        statusFilter === 'All' ||
        (statusFilter === 'Enabled' && t.enabled) ||
        (statusFilter === 'Disabled' && !t.enabled)

      const matchRating =
        ratingFilter === 'All' || t.rating === Number(ratingFilter)

      return matchQuery && matchStatus && matchRating
    })
  }, [testimonials, searchQuery, statusFilter, ratingFilter])

  // Form open helpers
  const openAddForm = () => {
    setEditingTestimonial(null)
    setFormCustomerName('')
    setFormRole('')
    setFormReview('')
    setFormRating(5)
    setFormLocation('')
    setFormDate(new Date().toISOString().split('T')[0])
    setFormEnabled(true)
    // Next available display order
    const maxOrder = testimonials.length > 0 ? Math.max(...testimonials.map((t) => t.displayOrder || 0)) : 0
    setFormDisplayOrder(maxOrder + 1)
    setFormError(null)
    setIsFormOpen(true)
  }

  const openEditForm = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial)
    setFormCustomerName(testimonial.customerName)
    setFormRole(testimonial.role || '')
    setFormReview(testimonial.review)
    setFormRating(testimonial.rating || 5)
    setFormLocation(testimonial.location || '')
    setFormDate(testimonial.date || new Date().toISOString().split('T')[0])
    setFormEnabled(testimonial.enabled)
    setFormDisplayOrder(testimonial.displayOrder)
    setFormError(null)
    setIsFormOpen(true)
  }

  const closeForm = () => {
    setIsFormOpen(false)
    setEditingTestimonial(null)
    setFormError(null)
    router.replace('/admin/testimonials')
  }

  // Submit Form (Create / Update)
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    if (!formCustomerName.trim()) {
      setFormError('Customer Name is required.')
      return
    }

    if (!formReview.trim()) {
      setFormError('Testimonial Review text is required.')
      return
    }

    setIsSaving(true)

    try {
      const payload = {
        customerName: formCustomerName.trim(),
        role: formRole.trim() || undefined,
        review: formReview.trim(),
        rating: Math.max(1, Math.min(5, Number(formRating) || 5)),
        location: formLocation.trim(),
        date: formDate.trim() || new Date().toISOString().split('T')[0],
        enabled: formEnabled,
        displayOrder: Number(formDisplayOrder) || 1,
      }

      if (editingTestimonial) {
        await updateTestimonial(editingTestimonial.id, payload)
        showToast(`Testimonial for "${payload.customerName}" updated successfully!`)
      } else {
        await createTestimonial(payload)
        showToast(`New testimonial from "${payload.customerName}" added successfully!`)
      }

      await loadTestimonials()
      closeForm()
    } catch (err: any) {
      console.error('Save testimonial error:', err)
      setFormError(err?.message || 'Failed to save testimonial. Please check permissions.')
    } finally {
      setIsSaving(false)
    }
  }

  // Confirm and Delete Testimonial
  const handleDeleteConfirm = async () => {
    if (!deleteConfirmTestimonial) return
    setIsDeleting(true)
    try {
      await deleteTestimonial(deleteConfirmTestimonial.id)
      showToast(`Testimonial from "${deleteConfirmTestimonial.customerName}" deleted successfully.`)
      setDeleteConfirmTestimonial(null)
      await loadTestimonials()
    } catch (err: any) {
      console.error('Delete testimonial error:', err)
      showToast(err?.message || 'Failed to delete testimonial.', 'error')
    } finally {
      setIsDeleting(false)
    }
  }

  // Quick Toggle Enabled status directly in table
  const handleToggleEnabled = async (testimonial: Testimonial) => {
    try {
      const updated = await toggleTestimonialEnabled(testimonial.id, !testimonial.enabled)
      setTestimonials((prev) => prev.map((t) => (t.id === updated.id ? updated : t)))
      showToast(
        `"${testimonial.customerName}" review ${updated.enabled ? 'enabled' : 'disabled'}.`
      )
    } catch (err: any) {
      console.error('Toggle testimonial error:', err)
      showToast('Failed to update testimonial status.', 'error')
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

      {/* Top Bar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground">Testimonial Management</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage client testimonials, star ratings, visibility, and presentation order.
          </p>
        </div>
        <button
          type="button"
          onClick={openAddForm}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <Plus className="h-4 w-4" />
          Add New Testimonial
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
            placeholder="Search by customer name, role, review, location..."
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
          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground hidden sm:inline-block" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="rounded-xl border border-border bg-background py-2.5 px-3 text-xs sm:text-sm font-medium text-foreground outline-none focus:border-primary"
            >
              <option value="All">All Statuses</option>
              <option value="Enabled">Enabled Only</option>
              <option value="Disabled">Disabled Only</option>
            </select>
          </div>

          {/* Rating Filter */}
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value as any)}
            className="rounded-xl border border-border bg-background py-2.5 px-3 text-xs sm:text-sm font-medium text-foreground outline-none focus:border-primary"
          >
            <option value="All">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>
      </div>

      {/* Main Table View */}
      <div className="border border-border rounded-2xl bg-card overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-16 flex flex-col items-center justify-center space-y-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm font-medium text-muted-foreground">Loading testimonials...</p>
          </div>
        ) : error ? (
          <div className="p-12 text-center text-destructive">
            <AlertCircle className="mx-auto h-8 w-8 mb-2" />
            <p className="text-sm font-semibold">{error}</p>
            <button
              type="button"
              onClick={loadTestimonials}
              className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Retry Fetching
            </button>
          </div>
        ) : filteredTestimonials.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <MessageSquareQuote className="mx-auto h-10 w-10 text-muted-foreground/50" />
            <h3 className="text-base font-semibold text-foreground">No testimonials found</h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              {searchQuery || statusFilter !== 'All' || ratingFilter !== 'All'
                ? 'Try adjusting your search query or filter options.'
                : 'Your database is currently empty. Click "Add New Testimonial" to create your first client review.'}
            </p>
            {(searchQuery || statusFilter !== 'All' || ratingFilter !== 'All') && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('')
                  setStatusFilter('All')
                  setRatingFilter('All')
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
                  <th className="py-4 px-6">Customer</th>
                  <th className="py-4 px-6">Review</th>
                  <th className="py-4 px-6">Rating</th>
                  <th className="py-4 px-6">Location & Date</th>
                  <th className="py-4 px-6 text-center">Order</th>
                  <th className="py-4 px-6 text-center">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredTestimonials.map((testimonial) => (
                  <tr key={testimonial.id} className="hover:bg-muted/20 transition-colors">
                    {/* Customer */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-xs font-bold text-primary border border-primary/20">
                          {getInitials(testimonial.customerName)}
                        </div>
                        <div>
                          <span className="font-semibold text-foreground block">
                            {testimonial.customerName}
                          </span>
                          {testimonial.role && (
                            <span className="text-[11px] text-muted-foreground line-clamp-1">
                              {testimonial.role}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Review */}
                    <td className="py-4 px-6 max-w-xs md:max-w-md">
                      <p className="text-muted-foreground line-clamp-2 text-xs leading-relaxed italic">
                        &ldquo;{testimonial.review}&rdquo;
                      </p>
                    </td>

                    {/* Rating */}
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <div className="flex text-amber-500">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={cn(
                                'h-3.5 w-3.5',
                                star <= testimonial.rating
                                  ? 'fill-amber-500 text-amber-500'
                                  : 'text-muted-foreground/30'
                              )}
                            />
                          ))}
                        </div>
                        <span className="text-xs font-medium text-muted-foreground ml-1">
                          {testimonial.rating}/5
                        </span>
                      </div>
                    </td>

                    {/* Location & Date */}
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="space-y-0.5">
                        {testimonial.location ? (
                          <div className="flex items-center gap-1.5 text-xs text-foreground font-medium">
                            <MapPin className="h-3 w-3 text-primary shrink-0" />
                            <span>{testimonial.location}</span>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                        {testimonial.date && (
                          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                            <Calendar className="h-3 w-3 shrink-0" />
                            <span>{testimonial.date}</span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Display Order */}
                    <td className="py-4 px-6 text-center whitespace-nowrap">
                      <span className="inline-flex items-center justify-center rounded-lg bg-secondary px-2.5 py-1 text-xs font-semibold text-secondary-foreground">
                        #{testimonial.displayOrder}
                      </span>
                    </td>

                    {/* Enabled/Disabled Toggle */}
                    <td className="py-4 px-6 text-center whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleToggleEnabled(testimonial)}
                        title="Click to toggle display status"
                        className={cn(
                          'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors',
                          testimonial.enabled
                            ? 'bg-emerald-500/15 text-emerald-600 border border-emerald-500/30 hover:bg-emerald-500/25'
                            : 'bg-muted text-muted-foreground hover:bg-muted/80'
                        )}
                      >
                        {testimonial.enabled ? (
                          <>
                            <Eye className="h-3.5 w-3.5" />
                            Enabled
                          </>
                        ) : (
                          <>
                            <EyeOff className="h-3.5 w-3.5" />
                            Disabled
                          </>
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEditForm(testimonial)}
                          className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                          title="Edit Testimonial"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmTestimonial(testimonial)}
                          className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                          title="Delete Testimonial"
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

      {/* Add / Edit Testimonial Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-card border border-border rounded-3xl shadow-2xl overflow-hidden my-8">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-border bg-muted/30">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <MessageSquareQuote className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-serif text-xl font-bold text-foreground">
                    {editingTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {editingTestimonial
                      ? 'Update client feedback and display preferences'
                      : 'Add a new client review to the live website showcase'}
                  </p>
                </div>
              </div>
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

              {/* Customer Name & Role */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formCustomerName}
                    onChange={(e) => setFormCustomerName(e.target.value)}
                    placeholder="e.g. Rajesh Menon"
                    className="w-full rounded-xl border border-border bg-background py-2.5 px-3.5 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Customer Role / Organization
                  </label>
                  <input
                    type="text"
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value)}
                    placeholder="e.g. Procurement Head, Premium Showrooms Co."
                    className="w-full rounded-xl border border-border bg-background py-2.5 px-3.5 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Rating & Location */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Star Rating (1–5) *
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 bg-background border border-border rounded-xl px-3 py-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFormRating(star)}
                          className="p-0.5 hover:scale-110 transition-transform focus:outline-none"
                          aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                        >
                          <Star
                            className={cn(
                              'h-5 w-5',
                              star <= formRating
                                ? 'fill-amber-500 text-amber-500'
                                : 'text-muted-foreground/30 hover:text-amber-400'
                            )}
                          />
                        </button>
                      ))}
                    </div>
                    <span className="text-xs font-bold text-foreground">
                      {formRating} / 5 Stars
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    placeholder="e.g. Kochi, Kerala"
                    className="w-full rounded-xl border border-border bg-background py-2.5 px-3.5 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Date & Display Order */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Date
                  </label>
                  <input
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background py-2.5 px-3.5 text-sm text-foreground outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Display Order
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={formDisplayOrder}
                    onChange={(e) => setFormDisplayOrder(Number(e.target.value))}
                    placeholder="e.g. 1"
                    className="w-full rounded-xl border border-border bg-background py-2.5 px-3.5 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-primary"
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Lower numbers appear first in the carousel.
                  </p>
                </div>
              </div>

              {/* Review Text */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Review / Testimonial Quote *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formReview}
                  onChange={(e) => setFormReview(e.target.value)}
                  placeholder="Share the full testimonial feedback provided by the client..."
                  className="w-full rounded-xl border border-border bg-background py-2.5 px-3.5 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-primary resize-none leading-relaxed"
                />
              </div>

              {/* Enabled Toggle */}
              <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/20">
                <div>
                  <span className="text-sm font-semibold text-foreground block">
                    Display on Public Website
                  </span>
                  <span className="text-xs text-muted-foreground">
                    When enabled, this review will be visible to public website visitors in the Testimonials section.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={formEnabled}
                  onChange={(e) => setFormEnabled(e.target.checked)}
                  className="h-5 w-5 rounded border-border text-primary focus:ring-primary cursor-pointer"
                />
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
                      {editingTestimonial ? 'Update Testimonial' : 'Save Testimonial'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmTestimonial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-card border border-border rounded-3xl shadow-2xl p-6 space-y-5 text-center">
            <div className="h-12 w-12 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center mx-auto">
              <Trash2 className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold text-foreground">Delete Testimonial?</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Are you sure you want to delete the testimonial from{' '}
                <strong className="text-foreground">
                  "{deleteConfirmTestimonial.customerName}"
                </strong>
                ? This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmTestimonial(null)}
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
                  'Yes, Delete Testimonial'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
