'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Menu, X, MessageCircle, ArrowRight } from 'lucide-react'
import { NAV_LINKS, COMPANY, SOCIAL_LINKS, whatsappUrl } from '@/lib/site-data'
import { SocialLinksRow } from '@/components/social-links'
import { cn } from '@/lib/utils'

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  if (pathname?.startsWith('/admin')) {
    return null
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-[60] transition-all duration-500',
          scrolled || open
            ? 'bg-background/95 backdrop-blur-md border-b border-border shadow-[0_1px_20px_rgba(0,0,0,0.04)]'
            : 'bg-gradient-to-b from-black/55 via-black/25 to-transparent',
        )}
      >
        <div className="container-px mx-auto flex h-20 max-w-7xl items-center justify-between">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="relative z-[70] flex items-center transition-transform hover:scale-[1.02]"
            aria-label={COMPANY.name}
          >
            <div className="relative h-10 w-[124px] sm:h-11 sm:w-[136px] md:h-12 md:w-[148px]">
              {/* White-text logo for transparent header over dark hero */}
              <Image
                src="/logo-white.png"
                alt={`${COMPANY.name} logo`}
                fill
                sizes="(max-width: 768px) 136px, 148px"
                className={cn(
                  'object-contain transition-opacity duration-300',
                  scrolled || open ? 'opacity-0 pointer-events-none' : 'opacity-100',
                )}
                priority
              />
              {/* Dark-text logo for scrolled light background */}
              <Image
                src="/logo.png"
                alt={`${COMPANY.name} logo`}
                fill
                sizes="(max-width: 768px) 136px, 148px"
                className={cn(
                  'object-contain transition-opacity duration-300',
                  scrolled || open ? 'opacity-100' : 'opacity-0 pointer-events-none',
                )}
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-9 lg:flex" aria-label="Primary">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'group relative text-sm font-medium tracking-wide transition-colors duration-200',
                    active
                      ? 'text-primary font-semibold'
                      : scrolled
                        ? 'text-foreground/80 hover:text-foreground'
                        : 'text-white/95 hover:text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]',
                  )}
                >
                  {link.label}
                  <span
                    className={cn(
                      'absolute -bottom-1.5 left-0 h-0.5 bg-primary rounded-full transition-all duration-300',
                      active ? 'w-full' : 'w-0 group-hover:w-full',
                    )}
                  />
                </Link>
              )
            })}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={whatsappUrl('Hello Live Furniture, I would like to know more about your products.')}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-transform hover:scale-[1.03] sm:inline-flex"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </a>

            {/* Hamburger toggle button */}
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className={cn(
                'relative z-[70] inline-flex h-11 w-11 items-center justify-center rounded-full border shadow-md transition-all active:scale-95 lg:hidden',
                open
                  ? 'bg-card text-foreground border-border'
                  : scrolled
                    ? 'bg-card text-foreground border-border'
                    : 'bg-black/40 text-white border-white/20 backdrop-blur-md hover:bg-black/60',
              )}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
            >
              {open ? (
                <X className="h-6 w-6 text-primary" />
              ) : (
                <Menu className={cn('h-6 w-6', scrolled ? 'text-foreground' : 'text-white')} />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Full-screen Mobile Navigation Drawer */}
      {open ? (
        <div className="fixed inset-0 z-[55] flex flex-col justify-between bg-background text-foreground px-6 pb-8 pt-24 overflow-y-auto lg:hidden">
          <nav className="flex flex-col gap-1" aria-label="Mobile">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'flex items-center justify-between border-b border-border/80 py-3.5 font-serif text-2xl transition-colors',
                    active ? 'text-primary font-medium' : 'text-foreground hover:text-primary',
                  )}
                >
                  <span>{link.label}</span>
                  <ArrowRight
                    className={cn(
                      'h-5 w-5 transition-transform',
                      active ? 'text-primary translate-x-0' : 'text-muted-foreground/50 -translate-x-2',
                    )}
                  />
                </Link>
              )
            })}
          </nav>

          <div className="mt-6 flex flex-col gap-4">
            <a
              href={whatsappUrl('Hello Live Furniture, I would like to know more about your products.')}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-base font-medium text-primary-foreground shadow-md transition-transform active:scale-98"
            >
              <MessageCircle className="h-5 w-5" />
              Chat on WhatsApp
            </a>

            {/* Social Media Links in Mobile Drawer */}
            <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-border/80 bg-card p-3 text-center">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Follow Us On Social Media
              </span>
              <SocialLinksRow variant="colored" size="md" className="justify-center" />
            </div>

            <div className="rounded-2xl border border-border bg-card/60 p-3 text-center text-xs text-muted-foreground">
              <p className="font-semibold text-foreground">{COMPANY.name}</p>
              <p className="mt-0.5">{COMPANY.address}</p>
              <div className="mt-2 flex flex-col items-center gap-1 font-medium text-primary">
                {COMPANY.phones.map((p) => (
                  <a key={p.number} href={p.href} className="hover:underline">
                    {p.label}: {p.number}
                  </a>
                ))}
              </div>
              <p className="mt-1 text-foreground/80">{COMPANY.email}</p>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
