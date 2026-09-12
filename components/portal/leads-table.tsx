'use client'

import { Fragment, useState } from 'react'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import type { Lead } from '@prisma/client'
import { StatusSelect } from '@/components/portal/status-select'
import { LEAD_SOURCE_LABELS, LEAD_SOURCE_BADGE_STYLES } from '@/lib/portal/source'

export function LeadsTable({ leads }: { leads: Lead[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  return (
    <div className="mt-6 overflow-x-auto rounded-2xl border border-border bg-card">
      <table className="w-full min-w-[900px] text-left text-sm">
        <thead className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
          <tr>
            <th className="w-10 px-4 py-3" />
            <th className="px-4 py-3 font-medium">Name</th>
            <th className="px-4 py-3 font-medium">Contact</th>
            <th className="px-4 py-3 font-medium">Source</th>
            <th className="px-4 py-3 font-medium">Received</th>
            <th className="px-4 py-3 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => {
            const isExpanded = expandedId === lead.id
            return (
              <Fragment key={lead.id}>
                <tr
                  className="cursor-pointer border-b border-border/60 last:border-0 hover:bg-secondary/40"
                  onClick={() => setExpandedId(isExpanded ? null : lead.id)}
                >
                  <td className="px-4 py-3 text-muted-foreground">
                    <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/portal/leads/${lead.id}`}
                      onClick={(event) => event.stopPropagation()}
                      className="font-medium hover:text-primary"
                    >
                      {lead.name || 'Unnamed lead'}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    <div>{lead.email || '—'}</div>
                    <div>{lead.phone || '—'}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full border px-2 py-0.5 text-xs ${LEAD_SOURCE_BADGE_STYLES[lead.source]}`}>
                      {LEAD_SOURCE_LABELS[lead.source]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{new Date(lead.createdAt).toLocaleString()}</td>
                  <td className="px-4 py-3" onClick={(event) => event.stopPropagation()}>
                    <StatusSelect leadId={lead.id} status={lead.status} />
                  </td>
                </tr>
                {isExpanded && (
                  <tr className="border-b border-border/60 bg-secondary/20 last:border-0">
                    <td colSpan={6} className="px-4 py-4">
                      <QuestionResponses lead={lead} />
                    </td>
                  </tr>
                )}
              </Fragment>
            )
          })}
          {leads.length === 0 && (
            <tr>
              <td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">
                No leads yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

function QuestionResponses({ lead }: { lead: Lead }) {
  if (lead.source === 'FACEBOOK') {
    return (
      <div className="grid gap-x-8 gap-y-1 text-sm sm:grid-cols-3">
        <ResponseField label="Facebook form" value={lead.fbFormName || lead.fbFormId} />
        <ResponseField label="Address" value={lead.address} />
        <div className="text-xs text-muted-foreground sm:col-span-3">
          Facebook doesn't send project-specific questions — see the lead's raw payload for every field it submitted.
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-x-8 gap-y-1 text-sm sm:grid-cols-3">
      <ResponseField label="Budget" value={lead.budget} />
      <ResponseField label="Timeline" value={lead.timeline} />
      <ResponseField label="Installation" value={lead.installation} />
      <ResponseField label="Address" value={lead.address} />
      {lead.notes && <ResponseField label="Notes" value={lead.notes} className="sm:col-span-3" />}
    </div>
  )
}

function ResponseField({ label, value, className }: { label: string; value: string | null; className?: string }) {
  return (
    <div className={className}>
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-foreground">{value || '—'}</p>
    </div>
  )
}
