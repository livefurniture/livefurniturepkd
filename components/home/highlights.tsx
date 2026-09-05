import { Cpu, TreePine, Ruler, Cog, Sparkles, Boxes, type LucideIcon } from 'lucide-react'
import { HIGHLIGHTS } from '@/lib/site-data'
import { SectionHeading } from '@/components/section-heading'
import { Reveal } from '@/components/reveal'

const ICONS: Record<string, LucideIcon> = {
  Cpu,
  TreePine,
  Ruler,
  Cog,
  Sparkles,
  Boxes,
}

export function Highlights() {
  return (
    <section className="bg-foreground py-24 md:py-32">
      <div className="container-px mx-auto max-w-7xl">
        <SectionHeading
          kicker="Manufacturing Highlights"
          title="Engineering excellence at every stage"
          description="From raw timber to flawless finish, our capabilities are built for precision, durability and bulk reliability."
          invert
        />

        <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
          {HIGHLIGHTS.map((item, i) => {
            const Icon = ICONS[item.icon]
            return (
              <Reveal
                key={item.title}
                delay={i % 3}
                className="group bg-foreground p-8 transition-colors hover:bg-white/[0.04] md:p-10"
              >
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-6 font-serif text-xl text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/60">{item.description}</p>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
