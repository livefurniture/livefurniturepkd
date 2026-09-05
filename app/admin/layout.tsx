'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, Package, FolderTree, MessageSquareQuote, LogOut, Globe, Menu, X, ShieldCheck } from 'lucide-react'
import { AuthGuard } from '@/components/admin/auth-guard'
import { signOut } from '@/services/auth'
import { cn } from '@/lib/utils'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)

  const isLoginPage = pathname === '/admin/login'

  const handleLogout = async () => {
    try {
      await signOut()
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      router.push('/admin/login')
    }
  }

  if (isLoginPage) {
    return <main className="min-h-screen bg-background">{children}</main>
  }

  const navItems = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Products', href: '/admin/products', icon: Package },
    { label: 'Categories', href: '/admin/categories', icon: FolderTree },
    { label: 'Testimonials', href: '/admin/testimonials', icon: MessageSquareQuote },
  ]

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between px-6 py-4 border-b border-border bg-card">
          <div className="flex items-center gap-2.5 font-serif font-bold text-lg text-foreground">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <span>Admin Console</span>
          </div>
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
            aria-label="Toggle Navigation"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </header>

        {/* Sidebar */}
        <aside
          className={cn(
            'w-full md:w-64 border-r border-border bg-card flex flex-col justify-between p-6 shrink-0 transition-all duration-300',
            mobileOpen ? 'block' : 'hidden md:flex',
          )}
        >
          <div className="space-y-8">
            {/* Header / Brand */}
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-serif font-bold text-base leading-none">Live Furniture</h2>
                <span className="text-[11px] font-medium text-muted-foreground tracking-wider uppercase">
                  CMS Portal
                </span>
              </div>
            </div>

            {/* Navigation */}
            <nav className="space-y-1.5">
              <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70 mb-2">
                Navigation
              </p>
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                      isActive
                        ? 'bg-primary text-primary-foreground font-semibold shadow-sm'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </nav>
          </div>

          {/* Bottom Actions */}
          <div className="pt-6 mt-6 border-t border-border space-y-1.5">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <Globe className="h-4 w-4" />
              <span>View Public Website</span>
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors text-left"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6 md:p-10">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </AuthGuard>
  )
}
