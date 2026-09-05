import type { Metadata } from 'next'
import { PageHero } from '@/components/page-hero'
import { GalleryView } from '@/components/gallery/gallery-view'
import { ContactCta } from '@/components/contact-cta'

export const metadata: Metadata = {
  title: 'Gallery — Live Furniture',
  description:
    'Explore our manufacturing facility, machinery, finished products and furniture collections through the Live Furniture gallery.',
}

export default function GalleryPage() {
  return (
    <>
      <PageHero
        kicker="Gallery"
        title="Precision you can see"
        description="From our CNC machining floor to finished collections — a curated look inside Live Furniture."
        image="/live/hero_cnc_facility.png"
      />
      <GalleryView />
      <ContactCta />
    </>
  )
}
