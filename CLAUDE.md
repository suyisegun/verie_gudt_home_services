# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project overview

A Next.js App Router site for Verie Gudt Home Services (permanent roofline LED lighting installer). It has two halves:

1. A single-page marketing site (scaffolded/exported from v0.app) whose quote-request form posts real leads to the database.
2. A password-protected lead-management portal at `/portal` that also receives leads pushed from Facebook Lead Ads via webhook.

This is not a git repository.

## Commands

```bash
pnpm dev      # start dev server (also: npm run dev)
pnpm build    # production build
pnpm start    # serve production build

npx pnpm exec prisma generate      # regenerate the Prisma client after editing prisma/schema.prisma
npx pnpm exec prisma migrate dev   # create/apply a migration against DATABASE_URL
node scripts/hash-password.mjs "some-password"   # generate PORTAL_ADMIN_PASSWORD_HASH for .env.local
```

Package manager: both `pnpm-lock.yaml` and `package-lock.json` are present, but the pnpm lockfile is the more recently updated one — prefer `pnpm`. There is no lint/test/typecheck script defined in `package.json`, and no test framework is configured. `next.config.mjs` sets `typescript.ignoreBuildErrors: true`, so `pnpm build` will succeed even with type errors — run `npx tsc --noEmit` to actually catch them.

Copy `.env.example` to `.env.local` and fill in real values before running anything that touches the database, portal login, or the Facebook webhook — see that file for what each variable does.

## Architecture

- **Single route**: everything lives on `app/page.tsx`, which composes one section component per landing-page block, in order: `SiteHeader`, `Hero`, `TrustBar`, `Scenes`, `DayNightCompare`, `Features`, `HowItWorks`, `QuoteForm`, `Testimonials`, `FAQs`, `SiteFooter`. `app/privacy-policy` and `app/terms-and-conditions` are separate static routes. To change page structure/ordering, edit `app/page.tsx`; to change one section's content, edit the corresponding file in `components/`.
- **Server vs client components**: components are server components by default; only ones needing interactivity/browser APIs are marked `'use client'` (`site-header.tsx` for the mobile nav, `day-night-compare.tsx` for the interactive slider, `quote-form.tsx` for the multi-step form). Keep new interactive components client-only rather than converting the whole tree.
- **`components/quote-form.tsx`**: a two-step form (project questions → contact info) with local React state; `handleSubmit` POSTs to `POST /api/leads` (public, unauthenticated) and shows the "Request received!" state only on a successful response. It also lazy-loads the Google Maps Places script client-side using `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` for address autocomplete, which silently no-ops if that env var is unset.
- **UI primitives**: `components/ui/` currently holds only `button.tsx`, built on `@base-ui/react` (not Radix) with `class-variance-authority` for variants. Follow this same `cva` + `data-slot` + `cn()` pattern when adding more primitives via `shadcn` (config in `components.json`, style `base-nova`, no `tailwind.config` file — styling is CSS-first).
- **Styling**: Tailwind CSS v4, CSS-first config (no `tailwind.config.js`). Theme tokens (colors, radius) are defined as CSS variables in `app/globals.css` under `:root` and mapped via `@theme inline`; the site is dark-mode-only (`color-scheme: dark` is hardcoded, no light theme toggle). Two font variables are set in `app/layout.tsx` (`--font-inter` for body via `--font-sans`, `--font-sora` for headings via `--font-heading`, used as the `font-heading` utility class).
- **Assets**: hero/scene images live in `public/images/`; the site logo and OG image are hotlinked from a Vercel Blob URL in `app/layout.tsx` and `components/site-header.tsx` rather than stored locally — keep these in sync if the logo changes.
- **`AGENTS.md`** is auto-generated/rewritten by `next dev` (Next.js 16.3.3, a version with breaking changes vs. older Next.js knowledge) and is imported into this file via `@AGENTS.md`. It instructs reading `node_modules/next/dist/docs/` before writing code that touches Next.js APIs/conventions, since they may differ from training data. Don't hand-edit `AGENTS.md`; if it changes, commit the change.

## Lead portal (`/portal`)

- **Data model**: one `Lead` table (`prisma/schema.prisma`) holds leads from both sources, distinguished by a `source` enum (`WEBSITE` / `FACEBOOK`) and a `status` workflow enum (`NEW → CONTACTED → QUOTED → WON/LOST`). Website-specific fields (`budget`, `timeline`, `installation`) and Facebook-specific fields (`fbLeadId`, `fbFormId`, `fbPageId`) sit side by side as optional columns; a `raw` JSON column keeps the full original payload from whichever source created the lead.
- **Prisma 7 driver adapters**: this version of Prisma removed `datasource.url` from `schema.prisma` — the connection string lives in `prisma.config.ts` (for the CLI/migrations) and is passed explicitly to `PrismaClient` via a `@prisma/adapter-pg` adapter in `lib/prisma.ts` (for the app at runtime). Don't add `url = env("DATABASE_URL")` back into the datasource block; it will fail schema validation on this Prisma version.
- **Auth**: single-admin login only (no user table). `lib/portal/auth.ts` signs a JWT session cookie with `jose` and checks credentials with `bcryptjs` against `PORTAL_ADMIN_EMAIL` / `PORTAL_ADMIN_PASSWORD_HASH`. `proxy.ts` (Next's renamed `middleware.ts` convention as of 16.x) gates `/portal/*` and the management half of `/api/leads/*`, but explicitly carves out `POST /api/leads` (the public quote-form submission) and `/api/webhooks/facebook-leads` (verified separately, see below) as unauthenticated.
  - **Gotcha**: bcrypt hashes are full of literal `$` characters, and Next.js's env loader (`@next/env`, via `dotenv-expand`) treats unescaped `$name` in `.env*` files as variable interpolation, silently truncating a raw hash pasted into `PORTAL_ADMIN_PASSWORD_HASH`. `scripts/hash-password.mjs` already escapes every `$` as `\$` in its output — always regenerate through that script rather than hand-editing the hash, and paste its output verbatim.
- **Facebook Lead Ads**: `app/api/webhooks/facebook-leads/route.ts` handles both the one-time verification handshake (`GET`, checked against `FB_WEBHOOK_VERIFY_TOKEN`) and real-time lead notifications (`POST`, HMAC-verified against `FB_APP_SECRET` via `lib/portal/facebook.ts`). Each `leadgen` change event only carries a `leadgen_id`; the route then calls the Graph API (`FB_PAGE_ACCESS_TOKEN`) to fetch the actual field data and best-effort maps Facebook's free-form field names (`full_name`/`first_name`+`last_name`, `email`, `phone_number`, address parts) onto the normalized `Lead` columns. Per-lead failures are caught and logged individually so one bad lead can't fail the whole webhook batch or make Facebook retry-storm it — always return `200` from this route's `POST` handler even when processing fails internally.
- **Portal UI**: server components fetch directly via `lib/prisma.ts` (`app/portal/leads/page.tsx`, `app/portal/leads/[id]/page.tsx`, both `export const dynamic = 'force-dynamic'` so they aren't prerendered at build time without a live DB). Filtering is a plain `GET` form with no JS (`components/portal/lead-filters.tsx`); status changes and notes are the only client-interactive pieces (`components/portal/status-select.tsx`, `notes-editor.tsx`), each calling `PATCH /api/leads/[id]` directly and then `router.refresh()`.
