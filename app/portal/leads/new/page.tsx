import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { PortalHeader } from '@/components/portal/portal-header'
import { NewLeadForm } from '@/components/portal/new-lead-form'

export default function NewLeadPage() {
  return (
    <>
      <PortalHeader />
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <Link href="/portal/leads" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to leads
        </Link>

        <h1 className="mt-4 font-heading text-2xl font-bold tracking-tight">Add a lead manually</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          For offline leads — a phone call, a doorstep conversation, a referral — that didn't come through the website or Facebook.
        </p>

        <div className="mt-6">
          <NewLeadForm />
        </div>
      </main>
    </>
  )
}
