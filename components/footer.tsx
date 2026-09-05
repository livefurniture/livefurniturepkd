'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { MapPin, Phone, Mail } from 'lucide-react'
import { COMPANY, NAV_LINKS } from '@/lib/site-data'
import { getEnabledCategories, type Category } from '@/services/categories'
import { SocialLinksRow } from '@/components/social-links'

export function Footer() {
  const pathname = usePathname()
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    if (pathname?.startsWith('/admin')) return
    let isMounted = true
    getEnabledCategories()
      .then((cats) => {
        if (isMounted) setCategories(cats)
      })
      .catch((err) => {
        console.error('Failed to load footer categories:', err)
      })
    return () => {
      isMounted = false
    }
  }, [pathname])

  if (pathname?.startsWith('/admin')) {
    return null
  }

  return (
    <footer className="border-t border-border bg-card">
      <div className="container-px mx-auto max-w-7xl py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:pr-6">
            <Image
              src="/logo.png"
              alt={`${COMPANY.name} logo`}
              width={160}
              height={58}
              className="h-10 w-auto md:h-11"
            />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted-foreground">
              A premier B2B furniture manufacturing enterprise crafting high-end solid wood and
              precision-engineered furniture built to last a lifetime.
            </p>

            <div className="mt-6">
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Follow & Connect
              </span>
              <div className="mt-3">
                <SocialLinksRow variant="colored" size="md" />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Explore
            </h3>
            <ul className="mt-5 space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-foreground/80 transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Collections
            </h3>
            <ul className="mt-5 space-y-3">
              {categories.length > 0 ? (
                categories.map((cat) => (
                  <li key={cat.id}>
                    <Link
                      href={`/products?category=${encodeURIComponent(cat.name)}`}
                      className="text-sm text-foreground/80 transition-colors hover:text-primary"
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))
              ) : (
                <li className="text-xs text-muted-foreground">Loading collections...</li>
              )}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Get in touch
            </h3>
            <ul className="mt-5 space-y-4 text-sm text-foreground/80">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <a
                  href={COMPANY.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-primary"
                >
                  {COMPANY.address}
                </a>
              </li>
              <li className="flex gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <div className="flex flex-col gap-1.5">
                  {COMPANY.phones.map((p) => (
                    <a
                      key={p.number}
                      href={p.href}
                      className="transition-colors hover:text-primary"
                    >
                      <span className="text-xs text-muted-foreground mr-1.5">{p.label}:</span>
                      <span>{p.number}</span>
                    </a>
                  ))}
                </div>
              </li>
              <li className="flex gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <a href={`mailto:${COMPANY.email}`} className="hover:text-primary break-all">
                  {COMPANY.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-center sm:flex-row sm:text-left">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} {COMPANY.name}. {COMPANY.tagline}.
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>Crafted in Kanjikode, Palakkad, Kerala</span>
            <span>·</span>
            <span>BIS Compliant</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
