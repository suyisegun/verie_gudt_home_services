'use client'

import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Check, ChevronLeft, ChevronRight, MapPin, Phone } from 'lucide-react'

const perks = [
  'Free, no-obligation on-site estimate',
  'Transparent flat-rate pricing',
  'Financing options available',
  'Fully licensed, insured & warrantied',
]

const budgetOptions = ['Between $1,500 - $2,500', 'Between $2,500 - $5,500', 'Between $5,500 - $7,500']
const timelineOptions = ['ASAP, ready to book', 'Within the next month', 'Within 1 - 3 months', 'Just exploring for now']
const installationOptions = ['Entire home', 'Front only', 'Back only', "Don't know yet"]

type FormValues = {
  budget: string
  timeline: string
  installation: string
  name: string
  phone: string
  email: string
  address: string
}

const initialValues: FormValues = {
  budget: '',
  timeline: '',
  installation: '',
  name: '',
  phone: '',
  email: '',
  address: '',
}

export function QuoteForm() {
  const [step, setStep] = useState(1)
  const [values, setValues] = useState(initialValues)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const addressRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    if (!apiKey || document.querySelector('script[data-google-places]')) return

    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`
    script.async = true
    script.dataset.googlePlaces = 'true'
    script.onload = () => {
      const google = window.google
      if (!google || !addressRef.current) return
      const autocomplete = new google.maps.places.Autocomplete(addressRef.current, {
        types: ['address'],
        fields: ['formatted_address'],
      })
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace()
        if (place.formatted_address) updateValue('address', place.formatted_address)
      })
    }
    document.head.appendChild(script)
  }, [])

  function updateValue(key: keyof FormValues, value: string) {
    setValues((current) => ({ ...current, [key]: value }))
    setError('')
  }

  function nextStep() {
    if (!values.budget || !values.timeline || !values.installation) {
      setError('Please answer all three questions to continue.')
      return
    }
    setError('')
    setStep(2)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!values.name || !values.phone || !values.email || !values.address) {
      setError('Please complete all contact fields to submit your request.')
      return
    }
    setError('')
    setSubmitting(true)
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      if (!response.ok) throw new Error('Request failed')
      setSubmitted(true)
    } catch {
      setError('Something went wrong submitting your request. Please try again or call us.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section id="quote" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="grid items-center gap-10 rounded-3xl border border-border bg-card p-6 sm:p-10 lg:grid-cols-2 lg:gap-16 lg:p-14">
        <div>
          <h2 className="text-balance font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            Get your free roofline lighting quote
          </h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
            Tell us a little about your home and we&apos;ll reach out to schedule your free on-site estimate. Most quotes are booked within a day.
          </p>
          <ul className="mt-8 space-y-3">
            {perks.map((perk) => (
              <li key={perk} className="flex items-center gap-3 text-sm">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/15 text-primary"><Check className="h-3 w-3" /></span>
                {perk}
              </li>
            ))}
          </ul>
          <a href="tel:+16395604255" className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-foreground">
            <Phone className="h-4 w-4 text-primary" /> Prefer to talk? 639-560-4255
          </a>
        </div>

        {submitted ? (
          <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-primary/40 bg-primary/5 p-8 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground"><Check className="h-6 w-6" /></span>
            <h3 className="mt-4 font-heading text-xl font-semibold">Request received!</h3>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">Thanks for reaching out. A Verie Gudt specialist will contact you within one business day to schedule your free estimate.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-background p-6 sm:p-8">
            <div className="mb-7 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Step {step} of 2</p>
                <h3 className="mt-1 font-heading text-xl font-semibold">{step === 1 ? 'Tell us about your project' : 'Where can we reach you?'}</h3>
              </div>
              <div className="flex gap-1.5" aria-label={`Step ${step} of 2`}>
                <span className={`h-1.5 w-10 rounded-full ${step >= 1 ? 'bg-primary' : 'bg-muted'}`} />
                <span className={`h-1.5 w-10 rounded-full ${step >= 2 ? 'bg-primary' : 'bg-muted'}`} />
              </div>
            </div>

            {step === 1 ? (
              <div className="space-y-6">
                <ChoiceGroup label="What is your budget for this project?" value={values.budget} options={budgetOptions} onChange={(value) => updateValue('budget', value)} />
                <ChoiceGroup label="When do you want to get this project done?" value={values.timeline} options={timelineOptions} onChange={(value) => updateValue('timeline', value)} />
                <ChoiceGroup label="Where do you want the LEDs installed on your home?" value={values.installation} options={installationOptions} onChange={(value) => updateValue('installation', value)} />
                {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
                <Button type="button" size="lg" className="w-full text-base" onClick={nextStep}>Continue to contact details <ChevronRight className="ml-2 h-4 w-4" /></Button>
              </div>
            ) : (
              <div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field id="name" label="Full name" value={values.name} onChange={(value) => updateValue('name', value)} type="text" placeholder="Jane Doe" required />
                  <Field id="phone" label="Phone" value={values.phone} onChange={(value) => updateValue('phone', value)} type="tel" placeholder="639-560-4255" required />
                </div>
                <div className="mt-4"><Field id="email" label="Email" value={values.email} onChange={(value) => updateValue('email', value)} type="email" placeholder="jane@email.com" required /></div>
                <div className="mt-4 relative">
                  <label htmlFor="address" className="mb-1.5 block text-sm font-medium">Home address</label>
                  <div className="relative">
                    <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input ref={addressRef} id="address" name="address" type="text" value={values.address} onChange={(event) => updateValue('address', event.target.value)} placeholder="123 Main St, Your City" autoComplete="street-address" required className="w-full rounded-lg border border-input bg-background py-2.5 pl-9 pr-3.5 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/30" />
                  </div>
                  <p className="mt-1.5 text-xs text-muted-foreground">Start typing for address suggestions, or enter it manually.</p>
                </div>
                {error && <p role="alert" className="mt-4 text-sm text-destructive">{error}</p>}
                <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                  <Button type="button" variant="ghost" onClick={() => { setError(''); setStep(1) }}><ChevronLeft className="mr-2 h-4 w-4" /> Back</Button>
                  <Button type="submit" size="lg" className="text-base" disabled={submitting}>{submitting ? 'Submitting…' : 'Request My Free Quote'}</Button>
                </div>
                <p className="mt-3 text-center text-xs text-muted-foreground">No spam. We&apos;ll only use your info to schedule your estimate.</p>
              </div>
            )}
          </form>
        )}
      </div>
    </section>
  )
}

function ChoiceGroup({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (value: string) => void }) {
  return (
    <fieldset>
      <legend className="mb-2.5 text-sm font-medium">{label}</legend>
      <div className="grid gap-2 sm:grid-cols-2">
        {options.map((option) => (
          <label key={option} className={`flex cursor-pointer items-center gap-2.5 rounded-lg border px-3 py-2.5 text-sm transition-colors ${value === option ? 'border-primary bg-primary/10 text-foreground' : 'border-input hover:border-primary/50'}`}>
            <input type="radio" name={label} value={option} checked={value === option} onChange={() => onChange(option)} className="h-4 w-4 accent-primary" />
            <span>{option}</span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}

function Field({ id, label, value, onChange, type, placeholder, required }: { id: string; label: string; value: string; onChange: (value: string) => void; type: string; placeholder: string; required?: boolean }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">{label}</label>
      <input id={id} name={id} type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} required={required} className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/30" />
    </div>
  )
}

declare global {
  interface Window {
    google?: any
  }
}
