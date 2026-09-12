import Link from 'next/link'
import type { LeadSource, LeadStatus, Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { PortalHeader } from '@/components/portal/portal-header'
import { LeadFilters } from '@/components/portal/lead-filters'
import { LeadsTable } from '@/components/portal/leads-table'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

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
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl font-bold tracking-tight">Leads</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {leads.length} lead{leads.length === 1 ? '' : 's'} matching your filters
            </p>
          </div>
          <Link href="/portal/leads/new" className={cn(buttonVariants({ size: 'sm' }))}>
            Add lead manually
          </Link>
        </div>

        <div className="mt-6 rounded-2xl border border-border bg-card p-4">
          <LeadFilters source={source} status={status} q={q} />
        </div>

        <p className="mt-3 text-xs text-muted-foreground">Click a row to see its full question responses.</p>

        <LeadsTable leads={leads} />
      </main>
    </>
  )
}

function isLeadSource(value: string | undefined): value is LeadSource {
  return value === 'WEBSITE' || value === 'FACEBOOK' || value === 'MANUAL'
}

function isLeadStatus(value: string | undefined): value is LeadStatus {
  return value === 'NEW' || value === 'CONTACTED' || value === 'QUOTED' || value === 'WON' || value === 'LOST'
}
