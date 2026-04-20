# hanna-burgstaller.lacop.site

Standalone Next.js site for Hanna Burgstaller (LACOP demo portfolio).

Split from `schodakuch/lacop-site-demos` monorepo on 2026-04-20 to bypass the
Vercel hobby-tier rate limit that fans out one push into one deploy per site.

## Stack

- Next.js 16 (App Router) · React 19 · TypeScript strict
- Tailwind v4 · Framer Motion · Fraunces variable font (SOFT/WONK/opsz kinetic axes)
- Data shape follows LACOP `public_profiles` / `categories` / `media` (see `src/lib/types.ts`, `src/data/mock.ts`)

## Scripts

```bash
npm install
npm run dev       # localhost:3000
npm run build     # production build
npx tsc --noEmit  # type check
```
