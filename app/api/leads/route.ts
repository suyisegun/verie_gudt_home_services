import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

// Matches the fields collected by components/quote-form.tsx.
const websiteLeadSchema = z.object({
  name: z.string().trim().min(1).max(200),
  phone: z.string().trim().min(1).max(50),
  email: z.string().trim().email().max(200),
  address: z.string().trim().min(1).max(300),
  budget: z.string().trim().max(100).optional().default(''),
  timeline: z.string().trim().max(100).optional().default(''),
  installation: z.string().trim().max(100).optional().default(''),
})

/**
 * Public endpoint — the website quote form (components/quote-form.tsx) posts here directly,
 * with no auth. Kept unauthenticated in middleware.ts on purpose.
 */
export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const parsed = websiteLeadSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid lead data', issues: parsed.error.flatten() }, { status: 400 })
  }

  const { name, phone, email, address, budget, timeline, installation } = parsed.data

  const lead = await prisma.lead.create({
    data: {
      source: 'WEBSITE',
      name,
      phone,
      email,
      address,
      budget: budget || null,
      timeline: timeline || null,
      installation: installation || null,
      raw: parsed.data,
    },
  })

  return NextResponse.json({ id: lead.id }, { status: 201 })
}

const listQuerySchema = z.object({
  source: z.enum(['WEBSITE', 'FACEBOOK']).optional(),
  status: z.enum(['NEW', 'CONTACTED', 'QUOTED', 'WON', 'LOST']).optional(),
  q: z.string().trim().max(200).optional(),
  cursor: z.string().optional(),
  take: z.coerce.number().int().min(1).max(100).optional().default(25),
})

/** Protected by middleware.ts — lists leads for the portal dashboard. */
export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const parsed = listQuerySchema.safeParse(Object.fromEntries(url.searchParams))
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid query', issues: parsed.error.flatten() }, { status: 400 })
  }
  const { source, status, q, cursor, take } = parsed.data

  const where = {
    ...(source ? { source } : {}),
    ...(status ? { status } : {}),
    ...(q
      ? {
          OR: [
            { name: { contains: q, mode: 'insensitive' as const } },
            { email: { contains: q, mode: 'insensitive' as const } },
            { phone: { contains: q, mode: 'insensitive' as const } },
            { address: { contains: q, mode: 'insensitive' as const } },
          ],
        }
      : {}),
  }

  const leads = await prisma.lead.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: take + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
  })

  const hasMore = leads.length > take
  const items = hasMore ? leads.slice(0, take) : leads

  return NextResponse.json({
    items,
    nextCursor: hasMore ? items[items.length - 1]!.id : null,
  })
}
