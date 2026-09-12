'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function PortalHeader() {
  const router = useRouter()
  const [loggingOut, setLoggingOut] = useState(false)

  async function handleLogout() {
    setLoggingOut(true)
    try {
      await fetch('/api/portal/logout', { method: 'POST' })
    } finally {
      router.push('/portal/login')
      router.refresh()
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/portal/leads" className="flex items-center gap-2.5">
          <span className="font-heading text-base font-semibold leading-tight">
            Verie Gudt
            <span className="block text-xs font-normal text-muted-foreground">Leads Portal</span>
          </span>
        </Link>
        <Button type="button" variant="ghost" size="sm" onClick={handleLogout} disabled={loggingOut}>
          <LogOut className="mr-1.5 h-4 w-4" /> {loggingOut ? 'Signing out…' : 'Sign out'}
        </Button>
      </div>
    </header>
  )
}
