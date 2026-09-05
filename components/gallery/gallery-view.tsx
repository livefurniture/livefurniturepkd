'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion } from 'motion/react'
import { X, ChevronLeft, ChevronRight, Layers, Ruler, MessageCircle } from 'lucide-react'
import { GALLERY_CATEGORIES, GALLERY_ITEMS, whatsappUrl, type GalleryItem } from '@/lib/site-data'
import { cn } from '@/lib/utils'

export function GalleryView() {
  const [active, setActive] = useState('All')
  const [lightbox, setLightbox] = useState<number | null>(null)

  const filtered = useMemo(
    () => (active === 'All' ? GALLERY_ITEMS : GALLERY_ITEMS.filter((g) => g.category === active)),
    [active],
  )

  const current = lightbox !== null ? filtered[lightbox] : null

  const step = (dir: number) => {
    setLightbox((i) => {
      if (i === null) return i
      return (i + dir + filtered.length) % filtered.length
    })
  }

  return (
    <section className="container-px mx-auto max-w-7xl py-16 md:py-24">
      {/* Category filter tabs */}
      <div className="flex flex-wrap gap-2.5">
        {GALLERY_CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActive(cat)}
            className={cn(
              'rounded-full border px-4 py-2 text-xs font-medium transition-all duration-300 sm:px-5 sm:py-2.5 sm:text-sm',
              active === cat
                ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                : 'border-border bg-card text-foreground/80 hover:border-primary/50 hover:text-foreground',
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between border-b border-border/60 pb-4 text-xs text-muted-foreground sm:text-sm">
        <p>
          Showing <span className="font-semibold text-foreground">{filtered.length}</span> gallery showcases
          {active !== 'All' ? ` in ${active}` : ''}
        </p>
        <span className="hidden sm:inline-block">Click any photo for full inspection & technical specs</span>
      </div>

      {/* Gallery Masonry Grid */}
      <motion.div layout className="mt-8 columns-1 gap-5 sm:columns-2 lg:columns-3 [&>*]:mb-5">
        <AnimatePresence mode="popLayout">
          {filtered.map((item, i) => (
            <motion.button
              key={item.name}
              layout
              type="button"
              onClick={() => setLightbox(i)}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="group relative block w-full overflow-hidden rounded-2xl bg-card border border-border/70 text-left shadow-sm transition-all duration-300 hover:border-primary/50 hover:shadow-md"
            >
              <div className="relative w-full bg-muted">
                <Image
                  src={item.image || '/live/LIVE (1).png'}
                  alt={item.name}
                  width={600}
                  height={i % 3 === 0 ? 700 : i % 2 === 0 ? 520 : 600}
                  className="h-auto w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>

              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <div className="absolute inset-x-0 bottom-0 translate-y-3 p-5 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-primary">
                  {item.category}
                </span>
                <h3 className="mt-1 font-serif text-lg text-white">{item.name}</h3>
                <p className="mt-1 text-xs text-white/80 line-clamp-2">{item.description}</p>

                <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-white/15 pt-2.5 text-[11px] text-white/70">
                  <span className="flex items-center gap-1">
                    <Layers className="h-3 w-3 text-primary" />
                    {item.material}
                  </span>
                  <span className="flex items-center gap-1">
                    <Ruler className="h-3 w-3 text-primary" />
                    {item.dimensions}
                  </span>
                </div>
              </div>

              <div className="p-4 sm:hidden">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">
                  {item.category}
                </span>
                <h3 className="font-serif text-base text-foreground">{item.name}</h3>
              </div>
            </motion.button>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {current ? (
          <motion.div
            className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
              onClick={() => setLightbox(null)}
              aria-hidden
            />
            
            <button
              type="button"
              onClick={() => setLightbox(null)}
              aria-label="Close"
              className="absolute right-4 top-4 z-30 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={() => step(-1)}
              aria-label="Previous"
              className="absolute left-3 z-30 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:left-6"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            <button
              type="button"
              onClick={() => step(1)}
              aria-label="Next"
              className="absolute right-3 z-30 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:right-6"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            <motion.figure
              key={current.name}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="relative z-10 flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-white/15 bg-black/80 shadow-2xl backdrop-blur-lg"
            >
              <div className="relative aspect-[4/3] min-h-[300px] w-full flex-1 overflow-hidden bg-black/50 sm:min-h-[420px]">
                <Image
                  src={current.image || '/live/LIVE (1).png'}
                  alt={current.name}
                  fill
                  className="object-contain"
                  sizes="100vw"
                />
              </div>

              <figcaption className="flex flex-col gap-4 border-t border-white/15 bg-black/85 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
                <div className="space-y-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                    {current.category}
                  </span>
                  <h3 className="font-serif text-2xl text-white sm:text-3xl">{current.name}</h3>
                  <p className="max-w-xl text-sm leading-relaxed text-white/80">{current.description}</p>
                  
                  <div className="flex flex-wrap gap-4 pt-2 text-xs text-white/70">
                    <span className="flex items-center gap-1.5">
                      <Layers className="h-3.5 w-3.5 text-primary" />
                      <strong className="text-white">Material:</strong> {current.material}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Ruler className="h-3.5 w-3.5 text-primary" />
                      <strong className="text-white">Dimensions:</strong> {current.dimensions}
                    </span>
                  </div>
                </div>

                <div className="shrink-0 pt-2 sm:pt-0">
                  <a
                    href={whatsappUrl(`Hello Live Furniture, I am inquiring about the gallery showcase "${current.name}" (${current.category}). Please share details.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-xs font-medium text-primary-foreground transition-transform hover:scale-[1.03]"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Enquire on WhatsApp
                  </a>
                </div>
              </figcaption>
            </motion.figure>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  )
}
