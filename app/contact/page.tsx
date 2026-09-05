import type { Metadata } from 'next'
import { Phone, Mail, MapPin, MessageCircle, Clock, Share2, ArrowUpRight } from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { ContactForm } from '@/components/contact/contact-form'
import { Testimonials } from '@/components/home/testimonials'
import { Reveal } from '@/components/reveal'
import { SectionHeading } from '@/components/section-heading'
import { SocialCardsGrid, SocialLinksRow } from '@/components/social-links'
import { COMPANY, whatsappUrl } from '@/lib/site-data'

export const metadata: Metadata = {
  title: 'Contact Us — Live Furniture',
  description:
    'Get in touch with Live Furniture in Kanjikode, Palakkad for bulk orders, dealership enquiries and custom furniture manufacturing.',
}

export default function ContactPage() {
  return (
    <>
      <PageHero
        kicker="Get In Touch"
        title="Let's build something lasting"
        description="Reach out for bulk manufacturing, dealership partnerships or custom furniture requirements. Our team responds within one business day."
        image="/live/hero_dining_room.png"
      />

      <section className="bg-background py-20 sm:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="flex flex-col gap-8">
            <Reveal>
              <div className="flex flex-col gap-4">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  Direct Factory Contact
                </span>
                <h2 className="font-serif text-3xl text-foreground text-balance">
                  Speak with our manufacturing leadership
                </h2>
                <p className="max-w-md leading-relaxed text-muted-foreground">
                  Whether you are a showroom dealer, interior architect or corporate buyer, we are ready to
                  support your project with reliable bulk supply and uncompromised quality.
                </p>
              </div>
            </Reveal>

            <div className="grid gap-4 sm:grid-cols-2">
              {/* Phone & Direct Lines Card */}
              <Reveal delay={0.08} className="sm:col-span-2">
                <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:border-primary/40">
                  <div className="flex items-center gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Phone className="size-5" aria-hidden="true" />
                    </span>
                    <div>
                      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Phone & Direct Lines
                      </span>
                      <p className="text-xs text-muted-foreground">Direct lines for orders, inquiries & support</p>
                    </div>
                  </div>
                  <div className="grid gap-2.5 pt-2 sm:grid-cols-3">
                    {COMPANY.phones.map((p) => (
                      <a
                        key={p.number}
                        href={p.href}
                        className="group flex flex-col rounded-lg border border-border/70 bg-background/60 p-3 transition-colors hover:border-primary/50 hover:bg-primary/5"
                      >
                        <span className="text-[11px] font-semibold text-muted-foreground group-hover:text-primary">
                          {p.label}
                        </span>
                        <span className="mt-1 font-medium text-foreground transition-colors group-hover:text-primary">
                          {p.number}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              </Reveal>

              {/* Email Card */}
              <Reveal delay={0.16}>
                <div className="flex h-full items-start gap-4 rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:border-primary/40">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Mail className="size-5" aria-hidden="true" />
                  </span>
                  <div className="flex flex-col gap-1 min-w-0">
                    <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Email (Gmail)
                    </span>
                    <a
                      href={`mailto:${COMPANY.email}`}
                      className="text-sm font-medium text-foreground transition-colors hover:text-primary break-all"
                    >
                      {COMPANY.email}
                    </a>
                  </div>
                </div>
              </Reveal>

              {/* Working Hours Card */}
              <Reveal delay={0.24}>
                <div className="flex h-full items-start gap-4 rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:border-primary/40">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Clock className="size-5" aria-hidden="true" />
                  </span>
                  <div className="flex flex-col gap-1 min-w-0">
                    <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Working Hours
                    </span>
                    <span className="text-sm leading-relaxed text-foreground">{COMPANY.workingHours}</span>
                  </div>
                </div>
              </Reveal>

              {/* Address Card */}
              <Reveal delay={0.32} className="sm:col-span-2">
                <a
                  href={COMPANY.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-full items-start justify-between gap-4 rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:border-primary/40 hover:bg-primary/[0.02]"
                >
                  <div className="flex items-start gap-4">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <MapPin className="size-5" aria-hidden="true" />
                    </span>
                    <div className="flex flex-col gap-1 min-w-0">
                      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Plant & Corporate Address
                      </span>
                      <span className="text-sm leading-relaxed text-foreground transition-colors group-hover:text-primary">
                        {COMPANY.address}
                      </span>
                    </div>
                  </div>
                  <span className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-primary group-hover:underline pt-1">
                    Get Directions
                    <ArrowUpRight className="size-3.5" />
                  </span>
                </a>
              </Reveal>
            </div>

            <Reveal delay={0.2}>
              <div className="flex flex-wrap items-center gap-4">
                <a
                  href={whatsappUrl('Hello Live Furniture, I would like to enquire about your products and manufacturing.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-primary bg-primary/10 px-6 py-3.5 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                  <MessageCircle className="size-4" aria-hidden="true" />
                  Chat with us on WhatsApp
                </a>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-muted-foreground">Quick socials:</span>
                  <SocialLinksRow variant="outline" size="sm" />
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.25}>
              <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
                <div className="flex items-center justify-between border-b border-border/80 px-4 py-3 text-xs bg-muted/30">
                  <span className="flex items-center gap-1.5 font-medium text-foreground">
                    <MapPin className="size-3.5 text-primary" />
                    LIVE Furniture — Kanjikode, Palakkad
                  </span>
                  <a
                    href={COMPANY.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-semibold text-primary transition-colors hover:underline"
                  >
                    Open in Google Maps
                    <ArrowUpRight className="size-3.5" />
                  </a>
                </div>
                <iframe
                  title="Live Furniture location map"
                  src={`https://www.google.com/maps?q=${encodeURIComponent(COMPANY.mapQuery)}&output=embed`}
                  className="h-64 w-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </Reveal>
          </div>

          <ContactForm />
        </div>
      </section>

      {/* Social Media Channels Section */}
      <section className="border-t border-border/80 bg-secondary/30 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            kicker="Connect With Us"
            title="Follow our digital channels"
            description="Stay updated with our newest furniture collections, state-of-the-art CNC production runs, and corporate milestones across all platforms."
            align="center"
          />

          <div className="mt-12">
            <SocialCardsGrid />
          </div>
        </div>
      </section>

      <Testimonials />
    </>
  )
}
