import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

const updateSchema = z
  .object({
    status: z.enum(['NEW', 'CONTACTED', 'QUOTED', 'WON', 'LOST']).optional(),
    notes: z.string().max(5000).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, { message: 'No fields to update' })

/** Protected by middleware.ts — used by the portal to change a lead's status or notes. */
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const parsed = updateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid update', issues: parsed.error.flatten() }, { status: 400 })
  }

  try {
    const lead = await prisma.lead.update({ where: { id }, data: parsed.data })
    return NextResponse.json(lead)
  } catch {
    return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
  }
}
