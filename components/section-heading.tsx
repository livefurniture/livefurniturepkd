import { Reveal } from '@/components/reveal'
import { cn } from '@/lib/utils'

export function SectionHeading({
  kicker,
  title,
  description,
  align = 'left',
  invert = false,
  className,
}: {
  kicker?: string
  title: string
  description?: string
  align?: 'left' | 'center'
  invert?: boolean
  className?: string
}) {
  return (
    <div className={cn('max-w-2xl', align === 'center' && 'mx-auto text-center', className)}>
      {kicker ? (
        <Reveal>
          <span
            className={cn(
              'inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-primary',
              align === 'center' && 'justify-center',
            )}
          >
            {align === 'left' && <span className="h-px w-8 bg-primary" />}
            {kicker}
          </span>
        </Reveal>
      ) : null}
      <Reveal delay={1}>
        <h2
          className={cn(
            'mt-4 text-balance font-serif text-3xl leading-[1.1] sm:text-4xl md:text-[2.75rem]',
            invert ? 'text-white' : 'text-foreground',
          )}
        >
          {title}
        </h2>
      </Reveal>
      {description ? (
        <Reveal delay={2}>
          <p
            className={cn(
              'mt-5 text-pretty leading-relaxed',
              invert ? 'text-white/70' : 'text-muted-foreground',
            )}
          >
            {description}
          </p>
        </Reveal>
      ) : null}
    </div>
  )
}
