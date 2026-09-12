import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

// Deliberately more lenient than the public website form's schema (app/api/leads/route.ts) —
// this is for quickly logging an offline lead (a phone call, a doorstep conversation) where you
// might not have every field on hand yet. Only a name is required.
const manualLeadSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(200),
  phone: z.string().trim().max(50).optional().default(''),
  email: z.string().trim().max(200).optional().default(''),
  address: z.string().trim().max(300).optional().default(''),
  budget: z.string().trim().max(100).optional().default(''),
  timeline: z.string().trim().max(100).optional().default(''),
  installation: z.string().trim().max(100).optional().default(''),
  notes: z.string().trim().max(5000).optional().default(''),
  status: z.enum(['NEW', 'CONTACTED', 'QUOTED', 'WON', 'LOST']).optional().default('NEW'),
})

/** Protected by proxy.ts (this path isn't the public /api/leads POST exemption) — lets a signed-in
 * admin add a lead manually for an offline source (phone call, in-person, referral, etc). */
export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const parsed = manualLeadSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid lead data', issues: parsed.error.flatten() }, { status: 400 })
  }

  const { name, phone, email, address, budget, timeline, installation, notes, status } = parsed.data

  if (!phone && !email && !address) {
    return NextResponse.json({ error: 'Add at least one way to reach this lead: phone, email, or address.' }, { status: 400 })
  }

  const lead = await prisma.lead.create({
    data: {
      source: 'MANUAL',
      status,
      name,
      phone: phone || null,
      email: email || null,
      address: address || null,
      budget: budget || null,
      timeline: timeline || null,
      installation: installation || null,
      notes: notes || null,
      raw: parsed.data,
    },
  })

  return NextResponse.json({ id: lead.id }, { status: 201 })
}
