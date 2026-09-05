import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { FEATURED_CATEGORIES } from '@/lib/site-data'
import { SectionHeading } from '@/components/section-heading'
import { Reveal } from '@/components/reveal'

export function FeaturedCategories() {
  return (
    <section className="container-px mx-auto max-w-7xl py-24 md:py-32">
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <SectionHeading
          kicker="Featured Categories"
          title="Signature collections, built to specification"
        />
        <Reveal delay={2}>
          <Link
            href="/products"
            className="group inline-flex items-center gap-2 text-sm font-medium text-foreground"
          >
            View all products
            <ArrowRight className="h-4 w-4 text-primary transition-transform group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </div>

      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURED_CATEGORIES.map((cat, i) => (
          <Reveal key={cat.name} delay={i}>
            <Link href={cat.href} className="group block">
              <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-muted">
                <Image
                  src={cat.image || '/placeholder.svg'}
                  alt={cat.name}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-6">
                  <h3 className="font-serif text-xl text-white">{cat.name}</h3>
                  <span className="inline-flex h-9 w-9 shrink-0 translate-y-2 items-center justify-center rounded-full bg-primary text-primary-foreground opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
