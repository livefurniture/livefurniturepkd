'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { subscribeToAuthState, isAdmin, signOut } from '@/services/auth'
import { Loader2 } from 'lucide-react'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    let isMounted = true

    const unsubscribe = subscribeToAuthState(async (user) => {
      if (!isMounted) return

      if (!user) {
        setAuthenticated(false)
        setLoading(false)
        router.replace('/admin/login')
        return
      }

      try {
        // Authoritatively check admin custom claims
        const hasAdminClaim = await isAdmin(user)

        if (!isMounted) return

        if (hasAdminClaim) {
          setAuthenticated(true)
        } else {
          // User is authenticated in Firebase but lacks admin privileges
          console.warn('Unprivileged user attempted admin access. Signing out.')
          await signOut()
          setAuthenticated(false)
          router.replace('/admin/login')
        }
      } catch (err) {
        console.error('Admin authorization verification error:', err)
        if (isMounted) {
          setAuthenticated(false)
          router.replace('/admin/login')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    })

    return () => {
      isMounted = false
      unsubscribe()
    }
  }, [router])

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
        <p className="text-sm font-medium text-muted-foreground">Verifying admin authentication...</p>
      </div>
    )
  }

  if (!authenticated) {
    return null
  }

  return <>{children}</>
}
