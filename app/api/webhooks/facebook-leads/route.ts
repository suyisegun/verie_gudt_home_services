import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { fetchFacebookLead, mapFacebookFieldsToContact, verifyFacebookSignature } from '@/lib/portal/facebook'

/**
 * Webhook verification handshake — Meta calls this once when you subscribe the webhook in the
 * Meta for Developers dashboard, with ?hub.mode=subscribe&hub.verify_token=...&hub.challenge=...
 */
export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const mode = url.searchParams.get('hub.mode')
  const token = url.searchParams.get('hub.verify_token')
  const challenge = url.searchParams.get('hub.challenge')

  const expectedToken = process.env.FB_WEBHOOK_VERIFY_TOKEN
  if (mode === 'subscribe' && expectedToken && token === expectedToken && challenge) {
    return new NextResponse(challenge, { status: 200 })
  }
  return NextResponse.json({ error: 'Verification failed' }, { status: 403 })
}

type FacebookLeadgenChangeValue = {
  leadgen_id: string
  form_id?: string
  page_id?: string
  form_name?: string
}

type FacebookWebhookEntry = {
  id: string
  changes?: { field: string; value: FacebookLeadgenChangeValue }[]
}

type FacebookWebhookPayload = {
  object: string
  entry?: FacebookWebhookEntry[]
}

/** Receives real-time leadgen notifications from Meta and stores the full lead from the Graph API. */
export async function POST(request: NextRequest) {
  const rawBody = await request.text()

  let signatureValid: boolean
  try {
    signatureValid = verifyFacebookSignature(rawBody, request.headers.get('x-hub-signature-256'))
  } catch (err) {
    console.error('Facebook webhook misconfigured:', err)
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 })
  }
  if (!signatureValid) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  let payload: FacebookWebhookPayload
  try {
    payload = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  if (payload.object !== 'page') {
    // Not a Page-scoped leadgen event; nothing for us to do.
    return NextResponse.json({ ok: true })
  }

  const leadgenChanges = (payload.entry ?? []).flatMap((entry) =>
    (entry.changes ?? [])
      .filter((change) => change.field === 'leadgen')
      .map((change) => ({ pageId: entry.id, value: change.value })),
  )

  for (const { pageId, value } of leadgenChanges) {
    try {
      await processLeadgenEvent(pageId, value)
    } catch (err) {
      // Log and continue — a single bad lead shouldn't fail the whole batch or make Facebook retry forever.
      console.error(`Failed to process Facebook lead ${value.leadgen_id}:`, err)
    }
  }

  // Facebook expects a fast 200 response regardless of downstream processing outcome.
  return NextResponse.json({ ok: true })
}

async function processLeadgenEvent(pageId: string, value: FacebookLeadgenChangeValue) {
  const existing = await prisma.lead.findUnique({ where: { fbLeadId: value.leadgen_id } })
  if (existing) return // Facebook may deliver the same webhook event more than once.

  const fbLead = await fetchFacebookLead(value.leadgen_id)
  const contact = mapFacebookFieldsToContact(fbLead.field_data)

  await prisma.lead.create({
    data: {
      source: 'FACEBOOK',
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      address: contact.address,
      fbLeadId: value.leadgen_id,
      fbFormId: value.form_id ?? fbLead.form_id,
      fbFormName: value.form_name,
      fbPageId: pageId,
      raw: fbLead as unknown as object,
    },
  })
}
