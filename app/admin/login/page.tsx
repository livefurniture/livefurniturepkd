'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signIn } from '@/services/auth'
import { ShieldCheck, Lock, Mail, Loader2, ArrowLeft, AlertCircle } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      setError('Please enter both email and password.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      await signIn({ email, password })
      router.push('/admin/dashboard')
    } catch (err: any) {
      console.error('Login error:', err)
      setError(err?.message || 'Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-6 relative overflow-hidden">
      {/* Background Subtle Accent */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Back Link */}
      <div className="absolute top-6 left-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Live Furniture
        </Link>
      </div>

      <div className="w-full max-w-md bg-card border border-border rounded-3xl shadow-xl p-8 relative z-10">
        {/* Header */}
        <div className="text-center space-y-2 mb-8">
          <div className="h-12 w-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mx-auto mb-4">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-foreground">Admin Portal</h1>
          <p className="text-sm text-muted-foreground">
            Sign in with your admin credentials to manage products & content.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-start gap-3">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@livefurniture.in"
                className="w-full rounded-xl border border-border bg-background py-3 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full rounded-xl border border-border bg-background py-3 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-primary py-3.5 px-4 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 disabled:pointer-events-none"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign In to Dashboard'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
