import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { fetchFormLeads, fetchLeadgenForms, mapFacebookFieldsToContact } from '@/lib/portal/facebook'

export const dynamic = 'force-dynamic'

/**
 * Fallback for real-time Facebook webhook delivery, which Meta gates behind Advanced Access
 * (App Review) for leads_retrieval. Polls each form's recent leads directly and inserts any not
 * already stored — same dedup-by-fbLeadId approach as the webhook handler, so it's safe to run
 * on overlapping schedules or alongside a working webhook once App Review is approved.
 */
export async function GET(request: NextRequest) {
  const expectedSecret = process.env.CRON_SECRET
  if (!expectedSecret) {
    console.error('Facebook lead polling misconfigured: CRON_SECRET is not set.')
    return NextResponse.json({ error: 'Polling not configured' }, { status: 500 })
  }
  if (request.headers.get('authorization') !== `Bearer ${expectedSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const pageId = process.env.FB_PAGE_ID
  if (!pageId) {
    console.error('Facebook lead polling misconfigured: FB_PAGE_ID is not set.')
    return NextResponse.json({ error: 'Polling not configured' }, { status: 500 })
  }

  let created = 0
  let checked = 0
  const errors: string[] = []

  try {
    const forms = await fetchLeadgenForms(pageId)

    for (const form of forms) {
      try {
        const leads = await fetchFormLeads(form.id)
        checked += leads.length

        for (const lead of leads) {
          const existing = await prisma.lead.findUnique({ where: { fbLeadId: lead.id } })
          if (existing) continue

          const contact = mapFacebookFieldsToContact(lead.field_data)
          await prisma.lead.create({
            data: {
              source: 'FACEBOOK',
              name: contact.name,
              email: contact.email,
              phone: contact.phone,
              address: contact.address,
              fbLeadId: lead.id,
              fbFormId: form.id,
              fbFormName: form.name,
              fbPageId: pageId,
              raw: lead as unknown as object,
            },
          })
          created++
        }
      } catch (err) {
        // One bad form shouldn't stop the rest from being polled.
        const message = err instanceof Error ? err.message : String(err)
        console.error(`Failed to poll leads for form ${form.id}:`, err)
        errors.push(`${form.id}: ${message}`)
      }
    }
  } catch (err) {
    console.error('Failed to poll Facebook leads:', err)
    return NextResponse.json({ error: 'Failed to list forms' }, { status: 502 })
  }

  return NextResponse.json({ ok: true, checked, created, errors })
}
