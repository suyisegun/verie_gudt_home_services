import { SignJWT, jwtVerify } from 'jose'
import bcrypt from 'bcryptjs'

export const SESSION_COOKIE_NAME = 'vg_portal_session'
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7 // 7 days

function getSessionSecretKey() {
  const secret = process.env.SESSION_SECRET
  if (!secret || secret.length < 16) {
    throw new Error(
      'SESSION_SECRET is missing or too short. Set a random string of at least 16 characters in your environment (see .env.example).',
    )
  }
  return new TextEncoder().encode(secret)
}

export type SessionPayload = {
  email: string
}

/** Signs a session JWT for the given admin email. Used after a successful login. */
export async function createSessionToken(email: string): Promise<string> {
  return new SignJWT({ email } satisfies SessionPayload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(getSessionSecretKey())
}

/** Verifies a session JWT. Returns the payload if valid, or null otherwise. Safe to call from middleware (edge runtime). */
export async function verifySessionToken(token: string | undefined): Promise<SessionPayload | null> {
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, getSessionSecretKey())
    if (typeof payload.email !== 'string') return null
    return { email: payload.email }
  } catch {
    return null
  }
}

export const sessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: SESSION_DURATION_SECONDS,
}

/**
 * Checks a login attempt against the single-admin credentials configured via env vars.
 * PORTAL_ADMIN_PASSWORD_HASH must be a bcrypt hash — generate one with `node scripts/hash-password.mjs <password>`.
 */
export async function checkAdminCredentials(email: string, password: string): Promise<boolean> {
  const expectedEmail = process.env.PORTAL_ADMIN_EMAIL
  const expectedHash = process.env.PORTAL_ADMIN_PASSWORD_HASH
  if (!expectedEmail || !expectedHash) {
    throw new Error('PORTAL_ADMIN_EMAIL / PORTAL_ADMIN_PASSWORD_HASH are not configured.')
  }
  if (email.trim().toLowerCase() !== expectedEmail.trim().toLowerCase()) return false
  return bcrypt.compare(password, expectedHash)
}
