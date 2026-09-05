import { Check } from 'lucide-react'
import { WHY_CHOOSE } from '@/lib/site-data'
import { SectionHeading } from '@/components/section-heading'
import { Reveal } from '@/components/reveal'

export function WhyChoose() {
  return (
    <section className="container-px mx-auto max-w-7xl py-24 md:py-32">
      <SectionHeading
        kicker="Why Choose Live Furniture"
        title="A B2B partner engineered for trust"
        description="Quality is not a post-production checkpoint — it is embedded into every millimeter of our workflow."
        align="center"
      />

      <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {WHY_CHOOSE.map((item, i) => (
          <Reveal
            key={item.title}
            delay={i % 3}
            className="group rounded-2xl border border-border bg-card p-8 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
          >
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-primary/12 text-primary">
              <Check className="h-5 w-5" />
            </span>
            <h3 className="mt-6 font-serif text-xl text-foreground">{item.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
