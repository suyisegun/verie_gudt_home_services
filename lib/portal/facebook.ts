import crypto from 'node:crypto'

const GRAPH_API_VERSION = process.env.FB_GRAPH_API_VERSION || 'v21.0'

/**
 * Verifies the `x-hub-signature-256` header Facebook sends on every webhook POST, using the
 * app secret. Must be computed over the exact raw request body — do this before JSON.parse'ing it.
 */
export function verifyFacebookSignature(rawBody: string, signatureHeader: string | null): boolean {
  const appSecret = process.env.FB_APP_SECRET
  if (!appSecret) {
    throw new Error('FB_APP_SECRET is not configured.')
  }
  if (!signatureHeader || !signatureHeader.startsWith('sha256=')) return false

  const expectedSignature = crypto.createHmac('sha256', appSecret).update(rawBody, 'utf8').digest('hex')
  const providedSignature = signatureHeader.slice('sha256='.length)

  const expectedBuffer = Buffer.from(expectedSignature, 'hex')
  const providedBuffer = Buffer.from(providedSignature, 'hex')
  if (expectedBuffer.length !== providedBuffer.length) return false

  return crypto.timingSafeEqual(expectedBuffer, providedBuffer)
}

export type FacebookLeadFieldData = { name: string; values: string[] }

export type FacebookLeadResponse = {
  id: string
  created_time?: string
  form_id?: string
  field_data?: FacebookLeadFieldData[]
}

/** Fetches full lead details from the Graph API using the leadgen_id received in the webhook. */
export async function fetchFacebookLead(leadgenId: string): Promise<FacebookLeadResponse> {
  const accessToken = process.env.FB_PAGE_ACCESS_TOKEN
  if (!accessToken) {
    throw new Error('FB_PAGE_ACCESS_TOKEN is not configured.')
  }

  const url = new URL(`https://graph.facebook.com/${GRAPH_API_VERSION}/${leadgenId}`)
  url.searchParams.set('access_token', accessToken)

  const res = await fetch(url, { method: 'GET' })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Facebook Graph API error (${res.status}): ${text}`)
  }
  return res.json()
}

const NAME_FIELDS = ['full_name', 'name']
const FIRST_NAME_FIELDS = ['first_name']
const LAST_NAME_FIELDS = ['last_name']
const EMAIL_FIELDS = ['email']
const PHONE_FIELDS = ['phone_number', 'phone']
const ADDRESS_PART_FIELDS = ['street_address', 'city', 'state', 'zip_code', 'post_code', 'country']

/** Best-effort mapping of Facebook's free-form field_data onto our normalized contact fields. */
export function mapFacebookFieldsToContact(fieldData: FacebookLeadFieldData[] | undefined) {
  const byName = new Map<string, string>()
  for (const field of fieldData ?? []) {
    byName.set(field.name.toLowerCase(), field.values?.[0] ?? '')
  }

  const firstMatch = (candidates: string[]) => {
    for (const key of candidates) {
      const value = byName.get(key)
      if (value) return value
    }
    return undefined
  }

  let name = firstMatch(NAME_FIELDS)
  if (!name) {
    const first = firstMatch(FIRST_NAME_FIELDS)
    const last = firstMatch(LAST_NAME_FIELDS)
    name = [first, last].filter(Boolean).join(' ') || undefined
  }

  const addressParts = ADDRESS_PART_FIELDS.map((key) => byName.get(key)).filter(Boolean)

  return {
    name,
    email: firstMatch(EMAIL_FIELDS),
    phone: firstMatch(PHONE_FIELDS),
    address: addressParts.length > 0 ? addressParts.join(', ') : undefined,
  }
}
