'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { LeadStatus } from '@prisma/client'
import { LEAD_STATUSES, LEAD_STATUS_LABELS } from '@/lib/portal/status'

export function StatusSelect({ leadId, status }: { leadId: string; status: LeadStatus }) {
  const router = useRouter()
  const [current, setCurrent] = useState(status)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')

  async function handleChange(next: LeadStatus) {
    const previous = current
    setCurrent(next)
    setPending(true)
    setError('')
    try {
      const res = await fetch(`/api/leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: next }),
      })
      if (!res.ok) throw new Error('Update failed')
      router.refresh()
    } catch {
      setCurrent(previous)
      setError('Could not update status.')
    } finally {
      setPending(false)
    }
  }

  return (
    <div onClick={(event) => event.stopPropagation()}>
      <select
        value={current}
        onChange={(event) => handleChange(event.target.value as LeadStatus)}
        disabled={pending}
        aria-label="Lead status"
        className="rounded-md border border-input bg-background px-2 py-1 text-xs font-medium outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/30 disabled:opacity-60"
      >
        {LEAD_STATUSES.map((value) => (
          <option key={value} value={value}>
            {LEAD_STATUS_LABELS[value]}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  )
}
