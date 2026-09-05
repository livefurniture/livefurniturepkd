'use client'

import { usePathname } from 'next/navigation'
import { MessageCircle } from 'lucide-react'
import { whatsappUrl } from '@/lib/site-data'

export function WhatsappFloat() {
  const pathname = usePathname()
  if (pathname?.startsWith('/admin')) {
    return null
  }
  return (
    <a
      href={whatsappUrl('Hello Live Furniture, I would like to enquire about your furniture.')}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-6 right-6 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 transition-transform hover:scale-110"
    >
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-30" />
      <MessageCircle className="relative h-7 w-7" />
    </a>
  )
}
