import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Mail, MapPin, Phone } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { PortalHeader } from '@/components/portal/portal-header'
import { StatusSelect } from '@/components/portal/status-select'
import { NotesEditor } from '@/components/portal/notes-editor'
import { LEAD_SOURCE_LABELS } from '@/lib/portal/source'

export const dynamic = 'force-dynamic'

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const lead = await prisma.lead.findUnique({ where: { id } })
  if (!lead) notFound()

  return (
    <>
      <PortalHeader />
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <Link href="/portal/leads" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to leads
        </Link>

        <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl font-bold tracking-tight">{lead.name || 'Unnamed lead'}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {LEAD_SOURCE_LABELS[lead.source]} · Received {new Date(lead.createdAt).toLocaleString()}
            </p>
          </div>
          <StatusSelect leadId={lead.id} status={lead.status} />
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-5">
            <h2 className="text-sm font-semibold">Contact</h2>
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4 shrink-0" /> {lead.email || '—'}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4 shrink-0" /> {lead.phone || '—'}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4 shrink-0" /> {lead.address || '—'}
              </div>
            </dl>
          </div>

          {lead.source === 'WEBSITE' ? (
            <div className="rounded-2xl border border-border bg-card p-5">
              <h2 className="text-sm font-semibold">Project details</h2>
              <dl className="mt-3 space-y-2 text-sm text-muted-foreground">
                <div>
                  <span className="text-foreground">Budget:</span> {lead.budget || '—'}
                </div>
                <div>
                  <span className="text-foreground">Timeline:</span> {lead.timeline || '—'}
                </div>
                <div>
                  <span className="text-foreground">Installation:</span> {lead.installation || '—'}
                </div>
              </dl>
            </div>
          ) : (
            <div className="rounded-2xl border border-border bg-card p-5">
              <h2 className="text-sm font-semibold">Facebook lead details</h2>
              <dl className="mt-3 space-y-2 text-sm text-muted-foreground">
                <div>
                  <span className="text-foreground">Form:</span> {lead.fbFormName || lead.fbFormId || '—'}
                </div>
                <div>
                  <span className="text-foreground">Lead ID:</span> {lead.fbLeadId || '—'}
                </div>
              </dl>
            </div>
          )}
        </div>

        <div className="mt-4 rounded-2xl border border-border bg-card p-5">
          <h2 className="text-sm font-semibold">Notes</h2>
          <div className="mt-3">
            <NotesEditor leadId={lead.id} initialNotes={lead.notes ?? ''} />
          </div>
        </div>

        {lead.raw != null && (
          <details className="mt-4 rounded-2xl border border-border bg-card p-5">
            <summary className="cursor-pointer text-sm font-semibold">Raw payload</summary>
            <pre className="mt-3 overflow-x-auto rounded-lg bg-background p-3 text-xs text-muted-foreground">
              {JSON.stringify(lead.raw, null, 2)}
            </pre>
          </details>
        )}
      </main>
    </>
  )
}
