import type { LeadStatus } from '@prisma/client'

export const LEAD_STATUSES: LeadStatus[] = ['NEW', 'CONTACTED', 'QUOTED', 'WON', 'LOST']

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  NEW: 'New',
  CONTACTED: 'Contacted',
  QUOTED: 'Quoted',
  WON: 'Won',
  LOST: 'Lost',
}

export const LEAD_STATUS_BADGE_STYLES: Record<LeadStatus, string> = {
  NEW: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
  CONTACTED: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  QUOTED: 'bg-violet-500/15 text-violet-300 border-violet-500/30',
  WON: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  LOST: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
}
