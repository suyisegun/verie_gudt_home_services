'use client'

import { useState, type FormEvent } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch('/api/portal/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}) as { error?: string })
        setError(data.error || 'Could not sign in.')
        return
      }
      const from = searchParams.get('from')
      router.push(from && from.startsWith('/portal') ? from : '/portal/leads')
      router.refresh()
    } catch {
      setError('Could not reach the server. Try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-8">
      <h1 className="font-heading text-xl font-semibold">Verie Gudt Leads Portal</h1>
      <p className="mt-1 text-sm text-muted-foreground">Sign in to view and manage leads.</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            autoComplete="username"
            className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/30"
          />
        </div>
        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm font-medium">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            autoComplete="current-password"
            className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/30"
          />
        </div>
        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}
        <Button type="submit" size="lg" className="w-full text-base" disabled={submitting}>
          {submitting ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>
    </div>
  )
}
