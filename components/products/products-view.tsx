'use client'

import { useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { AnimatePresence, motion } from 'motion/react'
import { MessageCircle, X, Ruler, Layers, ArrowRight, Search, AlertCircle, RefreshCw } from 'lucide-react'
import { whatsappUrl } from '@/lib/site-data'
import type { Product } from '@/services/products'
import type { Category } from '@/services/categories'
import { cn } from '@/lib/utils'

interface ProductsViewProps {
  products?: Product[]
  categories?: Category[]
  isLoading?: boolean
  error?: string | null
}

export function ProductsView({
  products = [],
  categories = [],
  isLoading = false,
  error = null,
}: ProductsViewProps) {
  const searchParams = useSearchParams()
  const initialCategory = searchParams.get('category') ?? 'All'

  const filters = useMemo(() => {
    if (categories && categories.length > 0) {
      return ['All', ...categories.map((c) => c.name)]
    }
    // If no categories passed yet, check products
    const unique = Array.from(new Set(products.map((p) => p.category).filter(Boolean)))
    return ['All', ...unique]
  }, [categories, products])

  const [active, setActive] = useState(filters.includes(initialCategory) ? initialCategory : 'All')
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<Product | null>(null)

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchedCat = categories.find((c) => c.name.toLowerCase() === active.toLowerCase())
      const matchCat =
        active === 'All' ||
        (matchedCat && p.categoryId === matchedCat.id) ||
        p.category.toLowerCase() === active.toLowerCase()

      const matchQuery =
        !query.trim() ||
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        (p.material && p.material.toLowerCase().includes(query.toLowerCase())) ||
        (p.description && p.description.toLowerCase().includes(query.toLowerCase()))
      return matchCat && matchQuery
    })
  }, [products, categories, active, query])

  return (
    <section className="container-px mx-auto max-w-7xl py-16 md:py-24">
      {/* Search and Filters */}
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2.5">
          {filters.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActive(cat)}
              className={cn(
                'rounded-full border px-4 py-2 text-xs font-medium transition-all duration-300 sm:px-5 sm:py-2.5 sm:text-sm',
                active === cat
                  ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                  : 'border-border bg-card text-foreground/80 hover:border-primary/50 hover:text-foreground',
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative min-w-[260px] md:max-w-xs">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, materials..."
            className="w-full rounded-full border border-border bg-card py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground/70 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
            >
              Clear
            </button>
          ) : null}
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between border-b border-border/60 pb-4 text-xs text-muted-foreground sm:text-sm">
        <p>
          Showing <span className="font-semibold text-foreground">{filtered.length}</span> {filtered.length === 1 ? 'product' : 'products'}
          {active !== 'All' ? ` in ${active}` : ''}
          {query ? ` matching "${query}"` : ''}
        </p>
        <span className="hidden sm:inline-block">B2B Commercial Specifications</span>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse flex flex-col overflow-hidden rounded-2xl border border-border bg-card"
            >
              <div className="aspect-[4/3] bg-muted" />
              <div className="flex flex-1 flex-col p-6 space-y-4">
                <div className="h-6 w-3/4 bg-muted rounded-md" />
                <div className="h-4 w-full bg-muted rounded-md" />
                <div className="h-4 w-2/3 bg-muted rounded-md" />
                <div className="mt-4 h-12 w-full bg-muted/60 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        /* Error State */
        <div className="mt-12 rounded-2xl border border-destructive/30 bg-destructive/5 py-12 px-6 text-center">
          <AlertCircle className="mx-auto h-10 w-10 text-destructive mb-3" />
          <h3 className="text-base font-semibold text-foreground">Failed to load products</h3>
          <p className="mt-1 text-sm text-muted-foreground max-w-md mx-auto">{error}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-medium text-primary-foreground transition-transform hover:scale-105"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Reload Page
          </button>
        </div>
      ) : filtered.length > 0 ? (
        /* Product Grid */
        <motion.div
          layout
          className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((product) => {
              const categoryName =
                categories.find((c) => c.id === product.categoryId)?.name || product.category
              return (
                <motion.article
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:border-primary/40 hover:shadow-md"
                >
                  <button
                    type="button"
                    onClick={() => setSelected(product)}
                    className="relative block aspect-[4/3] overflow-hidden bg-muted text-left"
                    aria-label={`View details for ${product.name}`}
                  >
                    <Image
                      src={product.image || '/placeholder.svg'}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <span className="absolute left-4 top-4 rounded-full bg-background/90 px-3 py-1 text-xs font-medium text-foreground backdrop-blur">
                      {categoryName}
                    </span>
                  </button>

                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="font-serif text-xl text-foreground">{product.name}</h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                      {product.description}
                    </p>
                    
                    <dl className="mt-5 space-y-2 border-t border-border/60 pt-4 text-xs text-muted-foreground">
                      {product.material && (
                        <div className="flex items-center gap-2">
                          <Layers className="h-3.5 w-3.5 shrink-0 text-primary" />
                          <span className="font-medium text-foreground">Material:</span>
                          <span className="truncate">{product.material}</span>
                        </div>
                      )}
                      {product.dimensions && (
                        <div className="flex items-center gap-2">
                          <Ruler className="h-3.5 w-3.5 shrink-0 text-primary" />
                          <span className="font-medium text-foreground">Dimensions:</span>
                          <span className="truncate">{product.dimensions}</span>
                        </div>
                      )}
                    </dl>

                    <div className="mt-6 flex items-center gap-3 border-t border-border pt-4">
                      <button
                        type="button"
                        onClick={() => setSelected(product)}
                        className="group/btn inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-foreground"
                      >
                        Specifications
                        <ArrowRight className="h-3.5 w-3.5 text-primary transition-transform group-hover/btn:translate-x-1" />
                      </button>
                      <a
                        href={whatsappUrl(`Hello Live Furniture, I am interested in the "${product.name}" (${categoryName}). Please share details.`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-medium text-primary-foreground transition-transform hover:scale-[1.03]"
                      >
                        <MessageCircle className="h-3.5 w-3.5" />
                        Enquire
                      </a>
                    </div>
                  </div>
                </motion.article>
              )
            })}
          </AnimatePresence>
        </motion.div>
      ) : (
        /* Empty State */
        <div className="mt-12 rounded-2xl border border-dashed border-border py-16 text-center">
          <p className="text-base font-medium text-foreground">No products found matching your search</p>
          <p className="mt-1 text-sm text-muted-foreground">Try clearing your search query or selecting a different category.</p>
          <button
            type="button"
            onClick={() => {
              setActive('All')
              setQuery('')
            }}
            className="mt-4 rounded-full border border-primary bg-primary/10 px-5 py-2 text-xs font-medium text-primary hover:bg-primary hover:text-primary-foreground"
          >
            Reset Filters
          </button>
        </div>
      )}

      <ProductModal
        product={selected}
        categoryName={
          selected
            ? categories.find((c) => c.id === selected.categoryId)?.name || selected.category
            : undefined
        }
        onClose={() => setSelected(null)}
      />
    </section>
  )
}

function ProductModal({
  product,
  categoryName,
  onClose,
}: {
  product: Product | null
  categoryName?: string
  onClose: () => void
}) {
  return (
    <AnimatePresence>
      {product ? (
        <motion.div
          className="fixed inset-0 z-[60] flex items-end justify-center p-0 sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-black/65 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={product.name}
            initial={{ y: 40, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-t-3xl bg-card shadow-2xl sm:rounded-3xl"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 z-20 inline-flex h-10 w-10 items-center justify-center rounded-full bg-background/90 text-foreground backdrop-blur transition-colors hover:bg-background"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="grid md:grid-cols-2">
              <div className="relative aspect-[4/3] bg-muted md:aspect-auto md:min-h-[460px]">
                <Image
                  src={product.image || '/placeholder.svg'}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>

              <div className="flex flex-col justify-between p-8 md:p-10">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                    {categoryName || product.category}
                  </span>
                  <h2 className="mt-2 font-serif text-2xl text-foreground sm:text-3xl">{product.name}</h2>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{product.description}</p>

                  <div className="mt-6 space-y-4 border-t border-border pt-6">
                    {product.material && (
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Material & Craftsmanship
                        </p>
                        <p className="mt-1 text-sm font-medium text-foreground">{product.material}</p>
                      </div>
                    )}

                    {product.dimensions && (
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Measurements / Dimensions
                        </p>
                        <p className="mt-1 text-sm font-medium text-foreground">{product.dimensions}</p>
                      </div>
                    )}

                    {product.features && product.features.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Key Features & Specifications
                        </p>
                        <ul className="mt-2.5 flex flex-wrap gap-2">
                          {product.features.map((f) => (
                            <li
                              key={f}
                              className="rounded-full bg-secondary px-3.5 py-1.5 text-xs font-medium text-secondary-foreground"
                            >
                              {f}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-8 border-t border-border pt-6">
                  <a
                    href={whatsappUrl(`Hello Live Furniture, I am interested in the "${product.name}" (${categoryName || product.category}). Please share details.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.02]"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Enquire on WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
