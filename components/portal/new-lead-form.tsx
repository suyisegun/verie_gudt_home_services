'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { LEAD_STATUSES, LEAD_STATUS_LABELS } from '@/lib/portal/status'
import type { LeadStatus } from '@prisma/client'

type FormValues = {
  name: string
  phone: string
  email: string
  address: string
  budget: string
  timeline: string
  installation: string
  notes: string
  status: LeadStatus
}

const initialValues: FormValues = {
  name: '',
  phone: '',
  email: '',
  address: '',
  budget: '',
  timeline: '',
  installation: '',
  notes: '',
  status: 'NEW',
}

export function NewLeadForm() {
  const router = useRouter()
  const [values, setValues] = useState<FormValues>(initialValues)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  function update<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((current) => ({ ...current, [key]: value }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!values.name.trim()) {
      setError('Name is required.')
      return
    }
    if (!values.phone.trim() && !values.email.trim() && !values.address.trim()) {
      setError('Add at least one way to reach this lead: phone, email, or address.')
      return
    }

    setError('')
    setSubmitting(true)
    try {
      const response = await fetch('/api/leads/manual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      const data = await response.json().catch(() => ({}) as { id?: string; error?: string })
      if (!response.ok) {
        setError(data.error || 'Could not save this lead. Try again.')
        return
      }
      router.push(`/portal/leads/${data.id}`)
      router.refresh()
    } catch {
      setError('Could not reach the server. Try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-card p-6 sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="name" label="Full name" required value={values.name} onChange={(v) => update('name', v)} placeholder="Jane Doe" />
        <Field id="phone" label="Phone" type="tel" value={values.phone} onChange={(v) => update('phone', v)} placeholder="639-560-4255" />
        <Field id="email" label="Email" type="email" value={values.email} onChange={(v) => update('email', v)} placeholder="jane@email.com" />
        <Field id="address" label="Home address" value={values.address} onChange={(v) => update('address', v)} placeholder="123 Main St, Your City" />
        <Field id="budget" label="Budget (optional)" value={values.budget} onChange={(v) => update('budget', v)} placeholder="e.g. $2,500 - $5,500" />
        <Field id="timeline" label="Timeline (optional)" value={values.timeline} onChange={(v) => update('timeline', v)} placeholder="e.g. Within a month" />
        <Field id="installation" label="Installation area (optional)" value={values.installation} onChange={(v) => update('installation', v)} placeholder="e.g. Front only" />
        <div>
          <label htmlFor="status" className="mb-1.5 block text-sm font-medium">
            Status
          </label>
          <select
            id="status"
            value={values.status}
            onChange={(event) => update('status', event.target.value as LeadStatus)}
            className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/30"
          >
            {LEAD_STATUSES.map((value) => (
              <option key={value} value={value}>
                {LEAD_STATUS_LABELS[value]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4">
        <label htmlFor="notes" className="mb-1.5 block text-sm font-medium">
          Notes (optional)
        </label>
        <textarea
          id="notes"
          value={values.notes}
          onChange={(event) => update('notes', event.target.value)}
          rows={4}
          placeholder="How this lead came in, what was discussed, next steps..."
          className="w-full rounded-lg border border-input bg-background p-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/30"
        />
      </div>

      {error && (
        <p role="alert" className="mt-4 text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="mt-6 flex justify-end">
        <Button type="submit" size="lg" disabled={submitting}>
          {submitting ? 'Saving…' : 'Save lead'}
        </Button>
      </div>
    </form>
  )
}

function Field({
  id,
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  required,
}: {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  type?: string
  required?: boolean
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/30"
      />
    </div>
  )
}
