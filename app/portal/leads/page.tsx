import Link from 'next/link'
import type { LeadSource, LeadStatus, Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { PortalHeader } from '@/components/portal/portal-header'
import { LeadFilters } from '@/components/portal/lead-filters'
import { StatusSelect } from '@/components/portal/status-select'
import { LEAD_SOURCE_LABELS, LEAD_SOURCE_BADGE_STYLES } from '@/lib/portal/source'

export const dynamic = 'force-dynamic'

type SearchParams = { source?: string; status?: string; q?: string }

export default async function LeadsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const { source, status, q } = await searchParams

  const where: Prisma.LeadWhereInput = {
    ...(isLeadSource(source) ? { source } : {}),
    ...(isLeadStatus(status) ? { status } : {}),
    ...(q
      ? {
          OR: [
            { name: { contains: q, mode: 'insensitive' } },
            { email: { contains: q, mode: 'insensitive' } },
            { phone: { contains: q, mode: 'insensitive' } },
            { address: { contains: q, mode: 'insensitive' } },
          ],
        }
      : {}),
  }

  const leads = await prisma.lead.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: 200,
  })

  return (
    <>
      <PortalHeader />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight">Leads</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {leads.length} lead{leads.length === 1 ? '' : 's'} matching your filters
          </p>
        </div>

        <div className="mt-6 rounded-2xl border border-border bg-card p-4">
          <LeadFilters source={source} status={status} q={q} />
        </div>

        <div className="mt-6 overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Contact</th>
                <th className="px-4 py-3 font-medium">Source</th>
                <th className="px-4 py-3 font-medium">Received</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id} className="border-b border-border/60 last:border-0 hover:bg-secondary/40">
                  <td className="px-4 py-3">
                    <Link href={`/portal/leads/${lead.id}`} className="font-medium hover:text-primary">
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
                  <td className="px-4 py-3">
                    <StatusSelect leadId={lead.id} status={lead.status} />
                  </td>
                </tr>
              ))}
              {leads.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">
                    No leads yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </>
  )
}

function isLeadSource(value: string | undefined): value is LeadSource {
  return value === 'WEBSITE' || value === 'FACEBOOK'
}

function isLeadStatus(value: string | undefined): value is LeadStatus {
  return value === 'NEW' || value === 'CONTACTED' || value === 'QUOTED' || value === 'WON' || value === 'LOST'
}
