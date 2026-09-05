import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { Reveal } from '@/components/reveal'

const STATS = [
  { value: 'B2B', label: 'Manufacturing Partner' },
  { value: 'CNC', label: 'Precision Machining' },
  { value: 'BIS', label: 'Standards Compliant' },
  { value: '100%', label: 'Solid Wood & Panel' },
]

export function Intro() {
  return (
    <section className="container-px mx-auto max-w-7xl py-24 md:py-32">
      <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <div className="relative">
          <Reveal>
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
              <Image
                src="/live/hero_cnc_facility.png"
                alt="Master craftsman finishing a solid wood surface"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </Reveal>
          <Reveal delay={2}>
            <div className="absolute -bottom-8 -right-4 hidden w-56 rounded-xl border border-border bg-card p-6 shadow-xl sm:block md:-right-8">
              <p className="font-serif text-3xl text-primary">Kanjikode</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Palakkad, Kerala — our manufacturing home
              </p>
            </div>
          </Reveal>
        </div>

        <div>
          <Reveal>
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
              <span className="h-px w-8 bg-primary" />
              Who We Are
            </span>
          </Reveal>
          <Reveal delay={1}>
            <h2 className="mt-4 text-balance font-serif text-3xl leading-[1.12] sm:text-4xl md:text-[2.75rem]">
              A heritage of uncompromising craftsmanship and industrial precision
            </h2>
          </Reveal>
          <Reveal delay={2}>
            <p className="mt-6 leading-relaxed text-muted-foreground">
              Live Furniture is a premier B2B furniture manufacturing enterprise specializing in
              high-end solid wood and precision-engineered panel furniture. We cater to premium
              showrooms, corporate offices and institutional procurement networks across regions.
            </p>
          </Reveal>
          <Reveal delay={3}>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Our ecosystem blends advanced automation with traditional joinery excellence —
              turning raw timber and high-density panels into structurally flawless furniture built
              to last a lifetime.
            </p>
          </Reveal>

          <Reveal delay={4}>
            <div className="mt-10 grid grid-cols-2 gap-6 border-t border-border pt-8 sm:grid-cols-4">
              {STATS.map((s) => (
                <div key={s.label}>
                  <p className="font-serif text-2xl text-foreground">{s.value}</p>
                  <p className="mt-1 text-xs leading-snug text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={5}>
            <Link
              href="/about"
              className="group mt-10 inline-flex items-center gap-2 text-sm font-medium text-foreground"
            >
              Discover our story
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform group-hover:translate-x-1">
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
