import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { SectionHeading } from '@/components/section-heading'
import { Reveal } from '@/components/reveal'

const IMAGES = [
  { src: '/factoryImages/img0.jpeg', span: 'lg:col-span-2 lg:row-span-2', alt: 'Live Furniture Industrial Facility' },
  { src: '/factoryImages/img4.png', span: '', alt: 'Solid wood joinery & box assembly' },
  { src: '/factoryImages/img5.png', span: '', alt: 'Clean-air PU finishing bay' },
  { src: '/live/hero_solid_wood.png', span: 'lg:col-span-2', alt: 'Solid wood collection' },
]

export function GalleryPreview() {
  return (
    <section className="bg-secondary py-24 md:py-32">
      <div className="container-px mx-auto max-w-7xl">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            kicker="Gallery Preview"
            title="Inside the workshop, from timber to finish"
            description="A glimpse of our facility, machinery and finished pieces — precision you can see."
          />
          <Reveal delay={3}>
            <Link
              href="/gallery"
              className="group inline-flex items-center gap-2 rounded-full border border-border bg-background px-6 py-3 text-sm font-medium text-foreground transition-colors hover:border-primary"
            >
              View Gallery
              <ArrowRight className="h-4 w-4 text-primary transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>

        <div className="mt-14 grid auto-rows-[200px] grid-cols-2 gap-4 sm:auto-rows-[240px] lg:grid-cols-4">
          {IMAGES.map((img, i) => (
            <Reveal key={img.src} delay={i} className={`overflow-hidden rounded-2xl ${img.span}`}>
              <div className="group relative h-full w-full">
                <Image
                  src={img.src || '/placeholder.svg'}
                  alt={img.alt}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
