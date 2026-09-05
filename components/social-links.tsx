'use client'

import React from 'react'
import { SOCIAL_LINKS, SocialLink } from '@/lib/site-data'
import { SocialIcon } from '@/components/social-icons'
import { cn } from '@/lib/utils'
import { ArrowUpRight } from 'lucide-react'

interface SocialLinksRowProps {
  className?: string
  buttonClassName?: string
  iconClassName?: string
  variant?: 'subtle' | 'solid' | 'colored' | 'outline'
  showTooltip?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function SocialLinksRow({
  className,
  buttonClassName,
  iconClassName,
  variant = 'outline',
  size = 'md',
}: SocialLinksRowProps) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-9 w-9',
    lg: 'h-11 w-11',
  }

  const iconSizes = {
    sm: 'h-3.5 w-3.5',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  }

  const variantClasses = {
    subtle:
      'bg-foreground/5 text-foreground/75 hover:text-foreground hover:bg-foreground/10 border border-transparent',
    solid:
      'bg-card text-foreground border border-border/80 shadow-xs hover:border-primary/40 hover:text-primary hover:shadow-sm',
    colored:
      'bg-card text-muted-foreground border border-border shadow-xs hover:text-white',
    outline:
      'border border-border/90 bg-card/60 text-foreground/80 hover:text-primary hover:border-primary/50 hover:bg-card shadow-xs',
  }

  return (
    <div className={cn('flex flex-wrap items-center gap-2.5', className)}>
      {SOCIAL_LINKS.map((item) => (
        <a
          key={item.id}
          href={item.href}
          target={item.href.startsWith('mailto:') ? undefined : '_blank'}
          rel={item.href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
          aria-label={`${item.name} (${item.handle})`}
          title={`${item.name}: ${item.handle}`}
          className={cn(
            'group relative inline-flex shrink-0 items-center justify-center rounded-full transition-all duration-300 hover:scale-110 active:scale-95',
            sizeClasses[size],
            variantClasses[variant],
            variant === 'colored' ? item.hoverBg : '',
            buttonClassName,
          )}
        >
          <SocialIcon
            id={item.id}
            className={cn(
              iconSizes[size],
              'transition-transform duration-300 group-hover:scale-110',
              iconClassName,
            )}
          />
        </a>
      ))}
    </div>
  )
}

interface SocialCardsGridProps {
  className?: string
}

export function SocialCardsGrid({ className }: SocialCardsGridProps) {
  return (
    <div className={cn('grid gap-4 sm:grid-cols-2 lg:grid-cols-3', className)}>
      {SOCIAL_LINKS.map((item) => (
        <a
          key={item.id}
          href={item.href}
          target={item.href.startsWith('mailto:') ? undefined : '_blank'}
          rel={item.href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
          className="group relative flex flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
        >
          <div>
            <div className="flex items-center justify-between">
              <div
                className="flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-xs transition-transform duration-300 group-hover:scale-110"
                style={{ backgroundColor: item.color }}
              >
                <SocialIcon id={item.id} className="h-5 w-5" />
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors group-hover:text-primary">
                <span>{item.id === 'gmail' ? 'Send Mail' : 'Visit'}</span>
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </div>

            <div className="mt-4">
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                {item.name}
              </h3>
              <p className="mt-0.5 text-xs font-mono text-primary/90 break-all">
                {item.handle}
              </p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground line-clamp-2">
                {item.description}
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground">
            <span className="uppercase tracking-wider font-medium">Official Channel</span>
            <span className="font-medium text-foreground group-hover:text-primary transition-colors">
              Connect →
            </span>
          </div>
        </a>
      ))}
    </div>
  )
}
