import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { checkAdminCredentials, createSessionToken, sessionCookieOptions, SESSION_COOKIE_NAME } from '@/lib/portal/auth'

const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
})

export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const parsed = loginSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Enter a valid email and password.' }, { status: 400 })
  }

  let valid: boolean
  try {
    valid = await checkAdminCredentials(parsed.data.email, parsed.data.password)
  } catch (err) {
    console.error('Portal login misconfigured:', err)
    return NextResponse.json({ error: 'Portal login is not configured yet.' }, { status: 500 })
  }

  if (!valid) {
    return NextResponse.json({ error: 'Incorrect email or password.' }, { status: 401 })
  }

  const token = await createSessionToken(parsed.data.email)
  const response = NextResponse.json({ ok: true })
  response.cookies.set(SESSION_COOKIE_NAME, token, sessionCookieOptions)
  return response
}
