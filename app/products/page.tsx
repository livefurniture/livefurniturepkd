import { Suspense } from 'react'
import type { Metadata } from 'next'
import { PageHero } from '@/components/page-hero'
import { ProductsView } from '@/components/products/products-view'
import { ContactCta } from '@/components/contact-cta'
import { getProducts, type Product } from '@/services/products'
import { getEnabledCategories, type Category } from '@/services/categories'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = {
  title: 'Products — Live Furniture',
  description:
    'Explore Live Furniture collections: bedroom, living room, dining, home accent and raw material furniture crafted from premium solid wood and engineered panels.',
}

export default async function ProductsPage() {
  let products: Product[] = []
  let categories: Category[] = []
  let error: string | null = null

  try {
    const [prods, cats] = await Promise.all([
      getProducts(),
      getEnabledCategories(),
    ])
    products = prods
    categories = cats
  } catch (err: any) {
    console.error('Products page database error:', err)
    error = err?.message || 'Failed to fetch products from database.'
  }

  return (
    <>
      <PageHero
        kicker="Products"
        title="Furniture crafted for every space"
        description="Browse our B2B collections by category. Every piece is built to specification with precision joinery and premium materials."
        image="/live/hero_living_room.png"
      />
      <Suspense fallback={<ProductsView isLoading />}>
        <ProductsView products={products} categories={categories} error={error} />
      </Suspense>
      <ContactCta />
    </>
  )
}
