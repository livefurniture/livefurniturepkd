'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getProducts, type Product } from '@/services/products'
import { getCategories, type Category } from '@/services/categories'
import { Package, Star, FolderTree, Plus, ArrowRight, Loader2, RefreshCw, Eye } from 'lucide-react'

export default function AdminDashboardPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDashboardData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [prods, cats] = await Promise.all([
        getProducts({ includeDisabled: true }),
        getCategories({ includeDisabled: true }),
      ])
      setProducts(prods)
      setCategories(cats)
    } catch (err: any) {
      console.error('Error loading dashboard data:', err)
      setError(err?.message || 'Failed to load products and categories statistics.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const totalProducts = products.length
  const featuredProductsCount = products.filter((p) => p.featured).length
  const categoriesCount = categories.length

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Overview of your product catalog and live database statistics.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchDashboardData}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-xs font-medium text-foreground shadow-sm hover:bg-muted transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh Data
          </button>
          <Link
            href="/admin/products?action=new"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Plus className="h-4 w-4" />
            Add Product
          </Link>
        </div>
      </div>

      {error ? (
        <div className="p-6 rounded-2xl border border-destructive/30 bg-destructive/5 text-center">
          <p className="text-sm font-medium text-destructive">{error}</p>
          <button
            type="button"
            onClick={fetchDashboardData}
            className="mt-3 text-xs font-semibold text-primary hover:underline"
          >
            Try Again
          </button>
        </div>
      ) : null}

      {/* Metrics Cards */}
      <div className="grid gap-6 sm:grid-cols-3">
        {/* Total Products Card */}
        <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Total Products
            </span>
            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Package className="h-5 w-5" />
            </div>
          </div>
          {loading ? (
            <div className="h-9 w-20 bg-muted animate-pulse rounded-md" />
          ) : (
            <p className="font-serif text-3xl font-bold text-foreground">{totalProducts}</p>
          )}
          <p className="text-xs text-muted-foreground">Active products in catalog</p>
        </div>

        {/* Featured Products Card */}
        <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Featured Products
            </span>
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Star className="h-5 w-5 fill-amber-500/20" />
            </div>
          </div>
          {loading ? (
            <div className="h-9 w-20 bg-muted animate-pulse rounded-md" />
          ) : (
            <p className="font-serif text-3xl font-bold text-foreground">{featuredProductsCount}</p>
          )}
          <p className="text-xs text-muted-foreground">Highlighted on homepage & banners</p>
        </div>

        {/* Total Categories Card */}
        <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Categories
            </span>
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <FolderTree className="h-5 w-5" />
            </div>
          </div>
          {loading ? (
            <div className="h-9 w-20 bg-muted animate-pulse rounded-md" />
          ) : (
            <p className="font-serif text-3xl font-bold text-foreground">{categoriesCount}</p>
          )}
          <p className="text-xs text-muted-foreground">Active product classification groups</p>
        </div>
      </div>

      {/* Recent Products Table Preview */}
      <div className="border border-border rounded-2xl bg-card overflow-hidden shadow-sm">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="font-serif text-lg font-bold text-foreground">Recent Products</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Latest items added or modified in your collection.
            </p>
          </div>
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
          >
            View All Products
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="p-12 flex justify-center items-center">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center text-sm text-muted-foreground">
            No products found in database. Click "Add Product" to create your first item.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="border-b border-border/80 bg-muted/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="py-3.5 px-6">Product</th>
                  <th className="py-3.5 px-6">Category</th>
                  <th className="py-3.5 px-6">Material</th>
                  <th className="py-3.5 px-6">Featured</th>
                  <th className="py-3.5 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {products.slice(0, 5).map((product) => (
                  <tr key={product.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3.5 px-6">
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 rounded-lg overflow-hidden bg-muted border border-border shrink-0">
                          <Image
                            src={product.image || '/placeholder.svg'}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <span className="font-semibold text-foreground block">{product.name}</span>
                          <span className="text-xs text-muted-foreground line-clamp-1">
                            {product.description}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-6 text-muted-foreground font-medium">
                      {product.category}
                    </td>
                    <td className="py-3.5 px-6 text-muted-foreground truncate max-w-[150px]">
                      {product.material || '—'}
                    </td>
                    <td className="py-3.5 px-6">
                      {product.featured ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-amber-600">
                          <Star className="h-3 w-3 fill-amber-500" />
                          Featured
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">Standard</span>
                      )}
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <Link
                        href={`/admin/products?edit=${product.id}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
