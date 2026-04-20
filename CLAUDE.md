# Project Rules — lacop-site-hanna-burgstaller

LACOP client portfolio site. Split from the `lacop-site-demos` monorepo on
2026-04-20 (per-site repos bypass Vercel hobby-tier deploy fan-out). These
rules are the LACOP house standard — they apply to every client site and
carry over from the template `schodakuch/lacop-site-template`.

## Tech Stack (locked)

- **Next.js 16** (App Router) · **React 19** · **TypeScript** strict
- **Tailwind v4** (custom properties in `src/app/globals.css`)
- **Framer Motion** for animations
- ESM only — never `require()`

## Hard Blocks — NEVER DO

- **NEVER** use `AnimatePresence mode="wait"` — causes white-screen flashes
- **NEVER** use `<img>` for content images — use `next/image` with explicit
  `sizes`, `alt`, `priority` (hero only)
- **NEVER** ignore `prefers-reduced-motion` — every animation checks
  `useReducedMotion()` and provides a static fallback
- **NEVER** claim work is done without the verification steps below
- **NEVER** fabricate bio, stats, clients, dates, measurements, or agency
  info for a real person. Use clearly-labelled "Text folgt" / `null` / `[]`
  placeholders until the user provides real data.
- **NEVER** use Inter or Inter Tight (banned fonts)

## LACOP Data Shape — the contract

Shape-compliant with `LACOP-DATA-SHAPE.md` at the repo root. On handoff, the
mock (`src/data/mock.ts`) is swapped for a live Supabase call via
`src/lib/lacop.ts`; the shell code above it doesn't change.

- `Profile`, `Category`, `Media` types in `src/lib/types.ts` mirror the
  `public_profiles` / `categories` / `media` DB views. Don't add fields
  that don't exist in the real schema.
- Every component iterates `Object.entries(profile.stats)`,
  `profile.social_links`, `profile.agencies`, `profile.custom_links` —
  never hardcoded keys. Ships empty-state fallbacks for all four.
- `hero_image_url || media[0]?.url || profile_image_url` is the standard
  hero fallback chain.
- IDs are valid UUID v4 in mocks. Slugs are kebab-case.
- `LACOP_USER_SLUG` env var selects the tenant at runtime; the default in
  `lacop.ts` drives the mock during local dev.

## Verification (MANDATORY before every commit)

```bash
npm run build && npx tsc --noEmit
```

Both must pass with zero errors. No exceptions.

## Playwright audit (MANDATORY before declaring the site done)

Headless Chromium, desktop 1440×900 + mobile 390×844, every route (`/`,
`/portfolio`, `/about`, `/contact`, `/impressum`). Screenshot above-fold +
full-page for each. Check: no layout shift, no clipped content, no missing
images, tap targets ≥44×44 on mobile (WCAG 2.5.5). Build-green ≠
feature-correct.

## Accessibility + SEO

- Semantic HTML, keyboard-accessible interactives, WCAG AA contrast (4.5:1),
  skip-to-main link (already wired in `layout.tsx`), visible focus states.
- `generateMetadata` in `layout.tsx` drives `<title>` + OG + Twitter Card +
  Person/WebSite JSON-LD. `sitemap.ts` + `robots.ts` + canonical URLs are
  wired.

## Copy

DE-only per LACOP standard (brief 2026-04-20). `html lang="de"`, OG `de_DE`.
Copy table at `src/data/copy.ts`. No `LanguageContext`, no `t()`, no
`{ en: …, de: … }` objects.

## Banned Decorative Tropes

Stop defaulting to these — user has flagged them as "things you always do".
Each must be earned by a concrete brief-driven reason.

- Roman numerals (`MMXXVI`, `Vol. I`, `II/III/IV`)
- `Volume 01` / `Issue 01` / `Ausgabe 01` masthead lines
- `Plates` as photo-count unit
- Book-metaphor renaming of About/Contact (Colophon, Masthead, Signature,
  Contents) unless the site is genuinely a booklet
- Mono + uppercase + wide-tracking eyebrow as decorative blanket

Pre-commit grep:
```bash
grep -rnE "Vol(ume|\.) ?0?1|MMX|plate|Plates|Masthead|Colophon" src
```

## Vercel Deploy

One repo = one Vercel project. `vercel.json` at repo root has no
`ignoreCommand` (not needed in standalone repo). Vercel builds on every
push to `main`. Domain `hanna-burgstaller.lacop.site` is assigned in Vercel
Project Settings → Domains.

## Protokoll-Pflicht — CHANGELOG.md

Every commit updates `CHANGELOG.md` at the repo root:

```markdown
## YYYY-MM-DD — Short description
- What was changed and why
```

## Code style

- Functional React components with hooks
- Server components by default; `'use client'` only when genuinely needed
- One component per file
- Tailwind classes co-locate styling
- No comments unless the WHY is non-obvious (hidden constraint, subtle
  invariant, workaround). No WHAT comments. No rot-prone references to
  callers/tasks/PRs.
