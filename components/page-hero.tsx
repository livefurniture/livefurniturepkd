import Image from 'next/image'
import Link from 'next/link'
import { Reveal } from '@/components/reveal'

export function PageHero({
  kicker,
  title,
  description,
  image = '/hero-1.png',
}: {
  kicker: string
  title: string
  description?: string
  image?: string
}) {
  return (
    <section className="relative flex min-h-[52vh] items-end overflow-hidden bg-foreground pb-14 pt-32 md:min-h-[60vh] md:pb-20">
      <Image
        src={image || '/hero-1.png'}
        alt=""
        fill
        priority
        className="object-cover"
        sizes="100vw"
        aria-hidden
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/55 to-black/40" />
      <div className="container-px relative z-10 mx-auto w-full max-w-7xl">
        <Reveal>
          <nav className="mb-6 flex items-center gap-2 text-xs text-white/60" aria-label="Breadcrumb">
            <Link href="/" className="transition-colors hover:text-primary">
              Home
            </Link>
            <span>/</span>
            <span className="text-white/90">{kicker}</span>
          </nav>
        </Reveal>
        <Reveal delay={1}>
          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            {kicker}
          </span>
        </Reveal>
        <Reveal delay={2}>
          <h1 className="mt-4 max-w-3xl text-balance font-serif text-4xl leading-[1.05] text-white sm:text-5xl md:text-6xl">
            {title}
          </h1>
        </Reveal>
        {description ? (
          <Reveal delay={3}>
            <p className="mt-5 max-w-xl text-pretty leading-relaxed text-white/70">{description}</p>
          </Reveal>
        ) : null}
      </div>
    </section>
  )
}
