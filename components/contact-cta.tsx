import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, MessageCircle } from 'lucide-react'
import { whatsappUrl } from '@/lib/site-data'
import { Reveal } from '@/components/reveal'
import { SocialLinksRow } from '@/components/social-links'

export function ContactCta() {
  return (
    <section className="container-px mx-auto max-w-7xl pb-24 md:pb-32">
      <div className="relative overflow-hidden rounded-3xl bg-foreground px-8 py-16 md:px-16 md:py-24">
        <Image
          src="/gallery-2.png"
          alt=""
          fill
          className="object-cover opacity-20"
          sizes="100vw"
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground via-foreground/90 to-foreground/60" />
        <div className="relative z-10 max-w-2xl">
          <Reveal>
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
              <span className="h-px w-8 bg-primary" />
              Let&apos;s build together
            </span>
          </Reveal>
          <Reveal delay={1}>
            <h2 className="mt-5 text-balance font-serif text-3xl leading-[1.1] text-white sm:text-4xl md:text-5xl">
              Ready to furnish your next project at scale?
            </h2>
          </Reveal>
          <Reveal delay={2}>
            <p className="mt-5 max-w-lg text-pretty leading-relaxed text-white/70">
              Partner with a manufacturer that delivers uncompromised design consistency and bulk
              supply reliability. Talk to our team today.
            </p>
          </Reveal>
          <Reveal delay={3}>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.03]"
              >
                Contact Us
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href={whatsappUrl('Hello Live Furniture, I would like to discuss a bulk order.')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 px-7 py-3.5 text-sm font-medium text-white transition-colors hover:bg-white/10"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </a>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-white/10 pt-6">
              <span className="text-xs font-medium text-white/70">Official Social Media:</span>
              <SocialLinksRow
                variant="subtle"
                buttonClassName="bg-white/10 text-white hover:bg-white hover:text-black border-white/15"
                size="sm"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
