import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowRight,
  Award,
  Building2,
  CheckCircle2,
  Compass,
  Factory,
  Gauge,
  Globe2,
  GraduationCap,
  Layers,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Target,
  Trees,
  Wrench,
} from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { Reveal } from '@/components/reveal'
import { ContactCta } from '@/components/contact-cta'
import { whatsappUrl } from '@/lib/site-data'

export const metadata: Metadata = {
  title: 'Our Story & Founder Leadership — Live Furniture',
  description:
    '30 Years of Global Industrial Leadership. Founded by Rajarajan Krishnamoorthy, Live Furniture bridges corporate finance, precision CNC woodworking, and mega-plant manufacturing across South and Central India.',
}

export default function AboutPage() {
  return (
    <>
      {/* 1. Cinematic Hero */}
      <PageHero
        kicker="Industrial Heritage & Leadership"
        title="Engineering Precision. Scaling Boundaries. Crafting Trust."
        description="Live Furniture was forged on a single mandate: bridging 30 years of global financial and project-execution discipline with uncompromising heavy-duty furniture manufacturing."
        image="/live/hero_solid_wood.png"
      />

      {/* 2. FOUNDER & LEADERSHIP DOSSIER (AT THE TOP) */}
      <section className="relative overflow-hidden bg-background py-20 lg:py-32 border-b border-border/80">
        <div className="container-px mx-auto max-w-7xl">
          {/* Section Kicker */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-8">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
                Executive Leadership
              </span>
              <h2 className="mt-3 font-serif text-3xl text-foreground sm:text-4xl lg:text-5xl text-balance">
                The Founder&apos;s Profile &amp; Vision
              </h2>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
              Directing large-scale B2B manufacturing, heavy-industry operations, and multi-state mega-plant execution.
            </p>
          </div>

          {/* Main Editorial Spread */}
          <div className="mt-14 grid gap-12 lg:grid-cols-12 lg:gap-16 items-start">
            {/* Left: Founder Stately Portrait & Quick Credentials */}
            <div className="lg:col-span-5 lg:sticky lg:top-24">
              <Reveal>
                <div className="relative group overflow-hidden rounded-3xl border border-border bg-card shadow-xl transition-all">
                  {/* Portrait Image */}
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-muted">
                    <Image
                      src="/owner.jpeg"
                      alt="Rajarajan Krishnamoorthy - Founder & Managing Director of Live Furniture"
                      fill
                      priority
                      className="object-cover object-top filter saturate-[1.03] transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 1024px) 100vw, 42vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                    
                    {/* Floating Info on Image Base */}
                    <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                      <span className="inline-block rounded-full bg-primary/95 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary-foreground backdrop-blur-xs">
                        Founder &amp; Managing Director
                      </span>
                      <h3 className="font-serif text-2xl font-bold tracking-tight text-white sm:text-3xl">
                        Rajarajan Krishnamoorthy
                      </h3>
                      <p className="text-xs font-medium text-white/80">
                        Industrial Entrepreneur &amp; Financial Strategist
                      </p>
                    </div>
                  </div>

                  {/* Founder Metadata Strip */}
                  <div className="p-6 space-y-4 bg-card">
                    <div className="grid grid-cols-2 gap-3 text-left">
                      <div className="rounded-2xl border border-border/80 bg-secondary/50 p-3.5">
                        <span className="block text-[10px] font-semibold uppercase tracking-wider text-primary">
                          Experience
                        </span>
                        <span className="font-serif text-lg font-bold text-foreground">
                          30+ Years
                        </span>
                        <span className="block text-[11px] text-muted-foreground">Global Track Record</span>
                      </div>
                      <div className="rounded-2xl border border-border/80 bg-secondary/50 p-3.5">
                        <span className="block text-[10px] font-semibold uppercase tracking-wider text-primary">
                          Geographies
                        </span>
                        <span className="font-serif text-lg font-bold text-foreground">
                          India &amp; Gulf
                        </span>
                        <span className="block text-[11px] text-muted-foreground">UAE · KSA · Pan-India</span>
                      </div>
                    </div>

                    <a
                      href="https://www.linkedin.com/in/rajarajan-krishnamoorthy-live-furniture-142376269/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-full items-center justify-center gap-2.5 rounded-xl bg-[#0A66C2] px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#084d93] hover:scale-[1.01] active:scale-[0.99]"
                    >
                      <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                      <span>Connect on LinkedIn</span>
                    </a>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Right: Detailed Dossier, Credentials & Career Milestones */}
            <div className="lg:col-span-7 space-y-10">
              {/* Primary Narrative */}
              <Reveal>
                <div className="space-y-5 text-base leading-relaxed text-foreground/85">
                  <p className="font-serif text-xl sm:text-2xl text-foreground font-normal leading-snug">
                    &ldquo;I am an industrial entrepreneur and financial strategist with 30 years of global experience bridging corporate finance, large-scale manufacturing, and mega-project execution.&rdquo;
                  </p>
                  <p>
                    Currently, I am the <strong>Founder of Live Furniture</strong>, where I have scaled a regional woodworking venture into a multi-state, ZED-certified B2B manufacturing enterprise. We are currently expanding our industrial footprint with a high-volume automated mega-plant across Plots 73 &amp; 74 in the <strong>Siddipet MSME Park, Telangana</strong>.
                  </p>
                  <p>
                    Prior to founding Live Furniture, I spent over two decades directing financial operations, consortium funding, and supply chains for high-profile ventures across India and the Middle East.
                  </p>
                </div>
              </Reveal>

              {/* Academic & Professional Credentials Strip */}
              <Reveal delay={1}>
                <div className="rounded-3xl border border-primary/25 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-7 sm:p-9">
                  <div className="flex items-center gap-2.5">
                    <GraduationCap className="h-5 w-5 text-primary shrink-0" />
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                      Academic &amp; Professional Credentials
                    </span>
                  </div>

                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-border bg-card/90 p-4 shadow-xs">
                      <div className="flex items-center gap-2">
                        <span className="inline-block h-2 w-2 rounded-full bg-primary" />
                        <h4 className="font-semibold text-foreground text-sm">
                          Executive MBA (IIT Jodhpur)
                        </h4>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground pl-4">
                        Indian Institute of Technology, Jodhpur · Currently Pursuing
                      </p>
                    </div>

                    <div className="rounded-2xl border border-border bg-card/90 p-4 shadow-xs">
                      <div className="flex items-center gap-2">
                        <span className="inline-block h-2 w-2 rounded-full bg-primary" />
                        <h4 className="font-semibold text-foreground text-sm">
                          Dual CMA (USA &amp; India)
                        </h4>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground pl-4">
                        IMA USA &amp; ICWAI (Cost &amp; Management Accountants)
                      </p>
                    </div>

                    <div className="rounded-2xl border border-border bg-card/90 p-4 shadow-xs">
                      <div className="flex items-center gap-2">
                        <span className="inline-block h-2 w-2 rounded-full bg-amber-500" />
                        <h4 className="font-semibold text-foreground text-sm">
                          B.Com · Department Topper
                        </h4>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground pl-4">
                        Bachelor of Commerce · University / Department Rank 1
                      </p>
                    </div>

                    <div className="rounded-2xl border border-border bg-card/90 p-4 shadow-xs">
                      <div className="flex items-center gap-2">
                        <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
                        <h4 className="font-semibold text-foreground text-sm">
                          M.Com &amp; CA (Inter)
                        </h4>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground pl-4">
                        Master of Commerce &amp; Chartered Accountancy Intermediate
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>

              {/* Key Milestones & Industrial Track Record */}
              <Reveal delay={2}>
                <div className="space-y-4">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    Executive Career Milestones
                  </span>

                  <div className="space-y-3.5">
                    {/* Track 1 */}
                    <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 transition-all hover:border-primary/40 hover:shadow-sm">
                      <div className="flex items-start gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                          <Globe2 className="h-5 w-5" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-serif text-lg font-bold text-foreground">
                            Global Project Finance &amp; Strategy
                          </h4>
                          <p className="text-sm leading-relaxed text-muted-foreground">
                            Executed <strong>50+ Detailed Project Reports (DPRs)</strong> and credit risk analyses for <strong>Bank of Baroda (Middle East)</strong> and the <strong>SBI State Head Office CGM committee</strong> across diverse global industries.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Track 2 */}
                    <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 transition-all hover:border-primary/40 hover:shadow-sm">
                      <div className="flex items-start gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                          <Building2 className="h-5 w-5" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-serif text-lg font-bold text-foreground">
                            Middle East Leadership (2009–2018)
                          </h4>
                          <p className="text-sm leading-relaxed text-muted-foreground">
                            Served as <strong>Finance Director for Catalyst Vivadas</strong> (UAE Military MEP contracting), managed Nokia&apos;s VRP global supply chain with <strong>Techmart Telecom FZCO</strong>, and spearheaded consortium finance for <strong>Oscar Cinemas&apos;</strong> multiplex expansion.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Track 3 */}
                    <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 transition-all hover:border-primary/40 hover:shadow-sm">
                      <div className="flex items-start gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                          <Factory className="h-5 w-5" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-serif text-lg font-bold text-foreground">
                            Heavy Industry &amp; Woodworking Scale
                          </h4>
                          <p className="text-sm leading-relaxed text-muted-foreground">
                            Directed <strong>₹100cr+ financial operations</strong> for Gasha Steels, and led large-scale factory mechanization and international exports for <strong>TipTop Furniture Group</strong> (executing turnkey projects for Indian airports and Rado showrooms in KSA).
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>

              {/* Founder Driving Philosophy Banner */}
              <Reveal delay={3}>
                <div className="relative overflow-hidden rounded-3xl bg-foreground text-background p-7 sm:p-9 shadow-xl">
                  <div className="space-y-2">
                    <span className="text-[11px] font-semibold uppercase tracking-widest text-primary">
                      Core Commitment
                    </span>
                    <blockquote className="font-serif text-xl sm:text-2xl italic leading-relaxed text-white">
                      &ldquo;I am passionate about zero-defect manufacturing, continuous operational improvement, and building sustainable, long-term B2B partnerships.&rdquo;
                    </blockquote>
                    <p className="text-xs text-white/60 pt-2 font-medium">
                      — Rajarajan Krishnamoorthy · Founder, Live Furniture
                    </p>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* 3. A DECADE OF INDUSTRIAL EVOLUTION (TIMELINE ARCHITECTURE) */}
      <section className="bg-secondary/40 py-20 lg:py-32">
        <div className="container-px mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border/80 pb-8">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
                Corporate Evolution
              </span>
              <h2 className="mt-3 font-serif text-3xl text-foreground sm:text-4xl lg:text-5xl">
                A Decade of Manufacturing Growth
              </h2>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
              From foundational roots in Malappuram to state-of-the-art automated production in Kanjikode and the upcoming Siddipet Megaproject.
            </p>
          </div>

          <div className="mt-16 space-y-12">
            {/* Era 1: 2014 – 2020 */}
            <Reveal>
              <div className="relative grid gap-8 rounded-3xl border border-border bg-card p-8 md:p-12 shadow-xs lg:grid-cols-12 lg:items-center">
                <div className="lg:col-span-4 space-y-2 border-b border-border/80 pb-4 lg:border-b-0 lg:border-r lg:pr-8">
                  <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
                    2014 – 2020
                  </span>
                  <h3 className="font-serif text-2xl md:text-3xl text-foreground font-bold">
                    The Foundation in Malappuram
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-1">
                    <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span>Chappanangadi, Malappuram, Kerala</span>
                  </div>
                </div>
                <div className="lg:col-span-8 text-muted-foreground space-y-3 leading-relaxed text-sm sm:text-base">
                  <p>
                    Our journey commenced in 2014 operating from a leased manufacturing premise. We established early market authority by engineering solid and modular wooden furniture for Kerala and adjacent Tamil Nadu border districts.
                  </p>
                  <p className="text-xs text-muted-foreground/90">
                    Six years of rigorous process optimization, tight raw material control, and product-line diversification cemented our reputation for unwavering structural durability.
                  </p>
                </div>
              </div>
            </Reveal>

            {/* Era 2: 2020 Expansion */}
            <Reveal delay={1}>
              <div className="relative grid gap-8 rounded-3xl border border-border bg-card p-8 md:p-12 shadow-xs lg:grid-cols-12 lg:items-start">
                <div className="lg:col-span-4 space-y-2 border-b border-border/80 pb-4 lg:border-b-0 lg:border-r lg:pr-8">
                  <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
                    2020 – Present
                  </span>
                  <h3 className="font-serif text-2xl md:text-3xl text-foreground font-bold">
                    Industrial Facility at Kanjikode
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-1">
                    <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span>New Industrial Area, Kanjikode, Palakkad</span>
                  </div>
                </div>
                <div className="lg:col-span-8 space-y-5">
                  <p className="text-sm sm:text-base leading-relaxed text-muted-foreground">
                    March 2020 marked our transition to a fully owned, customized manufacturing plant in Palakkad&apos;s industrial corridor, integrating industrial automation with master joinery.
                  </p>
                  
                  {/* Three Technical Benchmarks */}
                  <div className="grid gap-3.5 sm:grid-cols-3 pt-2">
                    <div className="rounded-2xl border border-border/80 bg-background/90 p-4">
                      <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                        <Trees className="h-4 w-4 text-primary shrink-0" />
                        <span>Wood Seasoning</span>
                      </div>
                      <p className="mt-1.5 text-xs text-muted-foreground">
                        In-house kiln seasoning strictly keeping moisture to 8%–10%.
                      </p>
                    </div>

                    <div className="rounded-2xl border border-border/80 bg-background/90 p-4">
                      <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                        <Sparkles className="h-4 w-4 text-primary shrink-0" />
                        <span>Clean-Air Bays</span>
                      </div>
                      <p className="mt-1.5 text-xs text-muted-foreground">
                        Positive-pressure micro-filtered paint bays for mirror-smooth PU coats.
                      </p>
                    </div>

                    <div className="rounded-2xl border border-border/80 bg-background/90 p-4">
                      <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                        <Gauge className="h-4 w-4 text-primary shrink-0" />
                        <span>CNC Joinery</span>
                      </div>
                      <p className="mt-1.5 text-xs text-muted-foreground">
                        Multi-axis CNC routing maintaining &plusmn;0.2 mm component tolerances.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Era 3: 2025 Recognition */}
            <Reveal delay={2}>
              <div className="relative grid gap-8 rounded-3xl border border-border bg-card p-8 md:p-12 shadow-xs lg:grid-cols-12 lg:items-center">
                <div className="lg:col-span-4 space-y-2 border-b border-border/80 pb-4 lg:border-b-0 lg:border-r lg:pr-8">
                  <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
                    2025 Milestones
                  </span>
                  <h3 className="font-serif text-2xl md:text-3xl text-foreground font-bold">
                    Government &amp; Quality Recognition
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-1">
                    <ShieldCheck className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span>State &amp; National Accreditations</span>
                  </div>
                </div>
                <div className="lg:col-span-8 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
                    <h4 className="font-serif text-base font-bold text-foreground">
                      Kerala &ldquo;Missing 1000&rdquo; Selection
                    </h4>
                    <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                      Selected under the Government of Kerala&apos;s prestigious Missing 1000 initiative recognizing high-growth industrial manufacturing units.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
                    <h4 className="font-serif text-base font-bold text-foreground">
                      MSME ZED Certification
                    </h4>
                    <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                      Achieved <strong>ZED Bronze Certification</strong> with all core milestones completed awaiting official <strong>ZED Silver</strong> for zero-defect production.
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Era 4: 2026 & Beyond (Siddipet Megaproject) */}
            <Reveal delay={3}>
              <div className="relative overflow-hidden rounded-3xl bg-foreground text-background p-8 md:p-12 shadow-2xl">
                <div className="relative z-10 grid gap-8 lg:grid-cols-12 lg:items-center">
                  <div className="lg:col-span-5 space-y-2">
                    <span className="inline-block rounded-full bg-primary/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
                      Next Horizon · 2026 &amp; Beyond
                    </span>
                    <h3 className="font-serif text-2xl md:text-4xl font-bold text-white leading-tight">
                      The Siddipet Megaproject
                    </h3>
                    <p className="text-xs text-white/70 flex items-center gap-1.5 pt-1">
                      <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span>Plots 73 &amp; 74, Siddipet MSME Park, Telangana</span>
                    </p>
                  </div>

                  <div className="lg:col-span-7 space-y-4">
                    <p className="text-sm sm:text-base leading-relaxed text-white/80">
                      To provide rapid supply to multi-brand dealer networks across Telangana, Karnataka, Andhra Pradesh, and Maharashtra, construction is underway for our second automated mega-plant.
                    </p>
                    <div className="rounded-2xl border border-white/15 bg-white/5 p-5 backdrop-blur-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-white/70">Commercial Dispatches</span>
                        <span className="rounded-full bg-primary px-3 py-0.5 text-xs font-bold text-primary-foreground">
                          Target: March 2027
                        </span>
                      </div>
                      <p className="mt-2 text-xs text-white/70">
                        Spread across Plots 73 &amp; 74, engineered for high-throughput automated panel processing and institutional solid wood lines.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 4. WHO WE ARE & MANUFACTURING ECOSYSTEM */}
      <section className="bg-background py-20 lg:py-32">
        <div className="container-px mx-auto max-w-7xl">
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-16 items-center">
            <div className="lg:col-span-5 space-y-6">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
                Who We Are
              </span>
              <h2 className="font-serif text-3xl text-foreground sm:text-4xl lg:text-5xl leading-tight">
                Where automation meets Master Joinery
              </h2>
              <p className="leading-relaxed text-muted-foreground text-sm sm:text-base">
                Live Furniture is a specialized B2B enterprise supplying load-bearing solid wood and precision-engineered panel furniture. We partner directly with premium multi-brand retail showrooms, architects, and corporate infrastructure projects.
              </p>
              
              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-xs font-semibold text-primary-foreground shadow-sm transition-transform hover:scale-105"
                >
                  Explore Collections
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <a
                  href={whatsappUrl('Hello Live Furniture, I would like to enquire about dealership partnerships.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-xs font-semibold text-foreground transition-colors hover:border-primary/50"
                >
                  <MessageCircle className="h-3.5 w-3.5 text-primary" />
                  Dealership Enquiry
                </a>
              </div>
            </div>

            <div className="lg:col-span-7 grid gap-4 sm:grid-cols-2">
              <Reveal className="overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-xs space-y-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Factory className="h-5 w-5" />
                </span>
                <h4 className="font-serif text-lg font-bold text-foreground">
                  Automated CNC Lines
                </h4>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  Multi-axis computerized layout modeling ensuring repeatable accuracy and zero structural deviations across bulk consignments.
                </p>
              </Reveal>

              <Reveal delay={1} className="overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-xs space-y-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Wrench className="h-5 w-5" />
                </span>
                <h4 className="font-serif text-lg font-bold text-foreground">
                  Heavy Structural Joinery
                </h4>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  Precision mortise-and-tenon and mechanical dovetail joints engineered to withstand institutional wear and generation-spanning load.
                </p>
              </Reveal>

              <Reveal delay={2} className="overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-xs space-y-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Sparkles className="h-5 w-5" />
                </span>
                <h4 className="font-serif text-lg font-bold text-foreground">
                  Clean-Air Finishing
                </h4>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  Positive-pressure, clean-air finishing bays delivering dust-free, high-durability NC sealer and polyurethane coats.
                </p>
              </Reveal>

              <Reveal delay={3} className="overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-xs space-y-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <ShieldCheck className="h-5 w-5" />
                </span>
                <h4 className="font-serif text-lg font-bold text-foreground">
                  BIS Standard Protocols
                </h4>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  Rigid compliance with Bureau of Indian Standards specifications governing wood moisture, adhesive bonding, and load safety.
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* 5. STRATEGIC PILLARS (VISION & MISSION) */}
      <section className="bg-secondary/40 py-20 lg:py-32 border-t border-border">
        <div className="container-px mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-stretch">
            {/* Vision Slab */}
            <div className="lg:col-span-5 flex flex-col justify-between rounded-3xl bg-foreground text-background p-8 md:p-12 shadow-xl">
              <div>
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/20 text-primary">
                  <Compass className="h-6 w-6" />
                </span>
                <span className="block mt-4 text-[11px] font-semibold uppercase tracking-widest text-primary">
                  Our Corporate Vision
                </span>
                <h3 className="mt-2 font-serif text-2xl md:text-3xl font-bold text-white">
                  The Preferred Industrial Partner
                </h3>
                <p className="mt-5 text-sm sm:text-base leading-relaxed text-white/75">
                  &ldquo;To be the most trusted and preferred B2B industrial partner in the furniture manufacturing sector, recognized for setting benchmarks in structural integrity, advanced machinery integration, and sustainable engineering.&rdquo;
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-white/60">
                <span>BIS Standard Compliant</span>
                <span>ZED Benchmark</span>
              </div>
            </div>

            {/* Mission 4 Core Pillars */}
            <div className="lg:col-span-7 flex flex-col justify-between gap-6">
              <div className="flex items-center gap-3">
                <Target className="h-5 w-5 text-primary" />
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground">
                  Our Mission &amp; Four Operational Pillars
                </span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-border bg-card p-6 shadow-xs">
                  <span className="text-xs font-mono font-bold text-primary">01</span>
                  <h4 className="mt-2 font-serif text-base font-bold text-foreground">Precision Engineering</h4>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                    Seamlessly combining high-capacity CNC automation with generational woodworking expertise.
                  </p>
                </div>

                <div className="rounded-2xl border border-border bg-card p-6 shadow-xs">
                  <span className="text-xs font-mono font-bold text-primary">02</span>
                  <h4 className="mt-2 font-serif text-base font-bold text-foreground">B2B Empowerment</h4>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                    Empowering showroom dealers and institutional buyers with unmatched supply consistency and cost optimization.
                  </p>
                </div>

                <div className="rounded-2xl border border-border bg-card p-6 shadow-xs">
                  <span className="text-xs font-mono font-bold text-primary">03</span>
                  <h4 className="mt-2 font-serif text-base font-bold text-foreground">Asset Longevity</h4>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                    Building heavy-duty pieces that excel in real-world load-bearing capacity and environmental stability.
                  </p>
                </div>

                <div className="rounded-2xl border border-border bg-card p-6 shadow-xs">
                  <span className="text-xs font-mono font-bold text-primary">04</span>
                  <h4 className="mt-2 font-serif text-base font-bold text-foreground">Zero-Defect Quality</h4>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                    Cultivating a safety-first, zero-defect ecosystem across every stage of processing and dispatch.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Closing Call to Action */}
      <ContactCta />
    </>
  )
}
