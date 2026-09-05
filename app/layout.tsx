import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { WhatsappFloat } from '@/components/whatsapp-float'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Live Furniture — Furnishing Your Lives | Premium B2B Furniture Manufacturing',
  description:
    'Live Furniture is a premier B2B furniture manufacturer in Kanjikode, Palakkad, Kerala — crafting high-end solid wood and precision-engineered panel furniture with CNC machining and traditional joinery excellence.',
  generator: 'v0.app',
  keywords: [
    'furniture manufacturer',
    'solid wood furniture',
    'B2B furniture',
    'Kerala furniture',
    'CNC furniture',
    'Live Furniture',
  ],
}

export const viewport: Viewport = {
  themeColor: '#E89025',
  colorScheme: 'light',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} bg-background`}>
      <body className="antialiased font-sans">
        <Header />
        <main>{children}</main>
        <Footer />
        <WhatsappFloat />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
