// Vercel sets VERCEL_ENV automatically on every deployment ('production' | 'preview' | 'development')
// — no manual configuration needed on Vercel's side. Plain local `next dev`/`next start` (outside
// Vercel's own tooling) never sets it at all, so an unset value means "running locally."
function getEnvironmentTag(): { label: string; className: string } | null {
  const vercelEnv = process.env.VERCEL_ENV

  if (vercelEnv === 'production') return null
  if (vercelEnv === 'preview') {
    return { label: 'Preview', className: 'border-amber-500/40 bg-amber-500/15 text-amber-300' }
  }
  // vercelEnv is 'development' (vercel dev) or undefined (plain local dev/start, or a non-Vercel host).
  return { label: 'Local', className: 'border-sky-500/40 bg-sky-500/15 text-sky-300' }
}

/** Small fixed badge marking any non-production environment, so it's never mistaken for the live site. */
export function EnvironmentBadge() {
  const tag = getEnvironmentTag()
  if (!tag) return null

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed bottom-3 left-3 z-[100] rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-widest shadow-lg backdrop-blur ${tag.className}`}
    >
      {tag.label}
    </div>
  )
}
