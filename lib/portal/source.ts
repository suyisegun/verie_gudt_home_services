import type { LeadSource } from '@prisma/client'

export const LEAD_SOURCE_LABELS: Record<LeadSource, string> = {
  WEBSITE: 'Website',
  FACEBOOK: 'Facebook',
  MANUAL: 'Manual',
}

export const LEAD_SOURCE_BADGE_STYLES: Record<LeadSource, string> = {
  WEBSITE: 'bg-primary/10 text-primary border-primary/30',
  FACEBOOK: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
  MANUAL: 'bg-violet-500/15 text-violet-300 border-violet-500/30',
}
