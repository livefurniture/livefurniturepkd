'use client'

import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { HERO_SLIDES } from '@/lib/site-data'

export function HeroSlider() {
  const [index, setIndex] = useState(0)
  const count = HERO_SLIDES.length

  const next = useCallback(() => setIndex((i) => (i + 1) % count), [count])
  const prev = useCallback(() => setIndex((i) => (i - 1 + count) % count), [count])

  useEffect(() => {
    const t = setInterval(next, 6000)
    return () => clearInterval(t)
  }, [next])

  const slide = HERO_SLIDES[index]

  return (
    <section className="relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-foreground">
      <AnimatePresence mode="sync">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ opacity: { duration: 1 }, scale: { duration: 7, ease: 'linear' } }}
          className="absolute inset-0"
        >
          <Image
            src={slide.image || '/placeholder.svg'}
            alt={slide.title}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30" />
        </motion.div>
      </AnimatePresence>

      <div className="container-px relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end pb-24 md:justify-center md:pb-0">
        <div className="max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                <span className="h-px w-8 bg-primary" />
                {slide.kicker}
              </span>
              <h1 className="mt-5 text-balance font-serif text-4xl leading-[1.05] text-white sm:text-5xl md:text-6xl lg:text-7xl">
                {slide.title}
              </h1>
              <p className="mt-6 max-w-lg text-pretty text-base leading-relaxed text-white/75 md:text-lg">
                {slide.description}
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              href="/products"
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.03]"
            >
              View Products
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 px-7 py-3.5 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/10"
            >
              Our Story
            </Link>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="container-px absolute bottom-8 left-0 right-0 z-10 mx-auto flex max-w-7xl items-center justify-between">
        <div className="flex items-center gap-3">
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              className="group py-2"
            >
              <span
                className={`block h-[3px] rounded-full transition-all duration-300 ${
                  i === index ? 'w-10 bg-primary' : 'w-5 bg-white/40 group-hover:bg-white/70'
                }`}
              />
            </button>
          ))}
        </div>
        <div className="hidden items-center gap-2 sm:flex">
          <button
            type="button"
            onClick={prev}
            aria-label="Previous slide"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/30 text-white transition-colors hover:bg-white/10"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next slide"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/30 text-white transition-colors hover:bg-white/10"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  )
}
