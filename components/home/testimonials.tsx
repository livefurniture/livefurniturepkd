'use client'

import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ChevronLeft, ChevronRight, MapPin, Quote, Star } from 'lucide-react'
import { getEnabledTestimonials, type Testimonial } from '@/services/testimonials'
import { SectionHeading } from '@/components/section-heading'

interface DisplayTestimonial {
  name: string
  role?: string
  quote: string
  rating: number
  location?: string
}

function getInitials(name: string) {
  if (!name) return '?'
  return name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
}

function mapFirestoreTestimonial(t: Testimonial): DisplayTestimonial {
  return {
    name: t.customerName,
    role: t.role,
    quote: t.review,
    rating: t.rating,
    location: t.location,
  }
}

export function Testimonials() {
  const [items, setItems] = useState<DisplayTestimonial[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState<1 | -1>(1)
  const [isAutoplay, setIsAutoplay] = useState(true)

  useEffect(() => {
    let isMounted = true
    async function loadTestimonials() {
      try {
        const data = await getEnabledTestimonials()
        if (isMounted && data && data.length > 0) {
          setItems(data.map(mapFirestoreTestimonial))
          setCurrentIndex(0)
        }
      } catch (err) {
        console.error('Failed to load testimonials from Firestore:', err)
      }
    }
    loadTestimonials()
    return () => {
      isMounted = false
    }
  }, [])

  const count = items.length

  const nextSlide = useCallback(() => {
    if (count === 0) return
    setDirection(1)
    setCurrentIndex((prev) => (prev + 1) % count)
  }, [count])

  const prevSlide = useCallback(() => {
    if (count === 0) return
    setDirection(-1)
    setCurrentIndex((prev) => (prev - 1 + count) % count)
  }, [count])

  useEffect(() => {
    if (!isAutoplay || count <= 1) return
    const timer = setInterval(() => {
      nextSlide()
    }, 5000)
    return () => clearInterval(timer)
  }, [isAutoplay, nextSlide, count])

  if (count === 0) {
    return null
  }

  // Get current 3 visible items for responsive multi-card view on large screens, or 1 item active slide
  // To ensure seamless sliding on all screen sizes, we display a grid with 3 cards visible on lg, 2 on md, 1 on sm
  // indexed relative to currentIndex
  const visibleIndices = [
    currentIndex % count,
    (currentIndex + 1) % count,
    (currentIndex + 2) % count,
  ]

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 40 : -40,
      opacity: 0,
      scale: 0.96,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -40 : 40,
      opacity: 0,
      scale: 0.96,
    }),
  }

  return (
    <section 
      className="bg-secondary/60 py-24 md:py-32 relative overflow-hidden"
      onMouseEnter={() => setIsAutoplay(false)}
      onMouseLeave={() => setIsAutoplay(true)}
    >
      <div className="container-px mx-auto max-w-7xl relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <SectionHeading
            kicker="Testimonials & Feedback"
            title="Trusted by premier B2B partners"
            description="Hear from showroom leaders, interior architects, and institutional procurement directors across the region."
            align="left"
            className="mb-0 max-w-2xl"
          />

          {/* Navigation Controls */}
          <div className="flex items-center gap-4 shrink-0">
            {/* Page Counter */}
            <div className="text-sm font-medium text-muted-foreground mr-2 font-mono">
              <span className="text-foreground font-semibold">
                {String(currentIndex + 1).padStart(2, '0')}
              </span>
              <span className="opacity-40 mx-1">/</span>
              <span className="opacity-60">{String(count).padStart(2, '0')}</span>
            </div>

            {/* Left Arrow Button */}
            <button
              type="button"
              onClick={prevSlide}
              aria-label="Previous testimonial"
              className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-sm transition-all duration-200 hover:bg-primary hover:text-primary-foreground hover:border-primary active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            {/* Right Arrow Button */}
            <button
              type="button"
              onClick={nextSlide}
              aria-label="Next testimonial"
              className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-sm transition-all duration-200 hover:bg-primary hover:text-primary-foreground hover:border-primary active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Carousel Content */}
        <div className="relative min-h-[340px]">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              {visibleIndices.map((index, i) => {
                const t = items[index]
                if (!t) return null
                // Hide 3rd card on medium screens, hide 2nd & 3rd on mobile screens
                const responsiveVisibilityClass =
                  i === 0
                    ? 'block'
                    : i === 1
                    ? 'hidden md:flex'
                    : 'hidden lg:flex'

                return (
                  <div
                    key={`${t.name}-${index}-${i}`}
                    className={`flex flex-col justify-between rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow duration-300 ${responsiveVisibilityClass}`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                          <Quote className="h-5 w-5" />
                        </span>
                        <div className="flex text-amber-400 gap-0.5" aria-label="5 stars rating">
                          {[...Array(t.rating || 5)].map((_, idx) => (
                            <Star key={idx} className="h-4 w-4 fill-current" />
                          ))}
                        </div>
                      </div>

                      <p className="mt-6 text-sm sm:text-base leading-relaxed italic text-foreground/90 font-sans">
                        &ldquo;{t.quote}&rdquo;
                      </p>
                    </div>

                    <div className="mt-8 border-t border-border/80 pt-5 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 text-xs font-semibold text-primary-foreground">
                          {getInitials(t.name)}
                        </div>
                        <div>
                          <h3 className="font-serif font-semibold text-foreground text-sm sm:text-base">
                            {t.name}
                          </h3>
                          <p className="text-xs text-muted-foreground line-clamp-1">{t.role}</p>
                        </div>
                      </div>

                      {t.location && (
                        <span className="hidden xl:inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground bg-secondary px-2.5 py-1 rounded-md shrink-0">
                          <MapPin className="h-3 w-3 text-primary" />
                          {t.location}
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom Pagination Dots */}
        <div className="mt-10 flex items-center justify-center gap-2">
          {items.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setDirection(i > currentIndex ? 1 : -1)
                setCurrentIndex(i)
              }}
              aria-label={`Go to testimonial slide ${i + 1}`}
              className="group p-1 focus:outline-none"
            >
              <span
                className={`block h-2 rounded-full transition-all duration-300 ${
                  i === currentIndex
                    ? 'w-8 bg-primary'
                    : 'w-2 bg-foreground/20 group-hover:bg-foreground/40'
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
