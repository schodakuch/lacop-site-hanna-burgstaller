# Changelog — sites/hanna-burgstaller

Demo site for Hanna Burgstaller (hanna-burgstaller.lacop.site).

## 2026-04-18 — Initial scaffold (Kinetic Typography / Runway / single-page scrolljack)
- Cloned `sites/carina-rebecca` as scaffolding base for the env-driven multi-customer shell + LACOP data shape; then rebuilt the entire visual + structural layer against `SITE-SYSTEM.md § 2-11` catalogues so every axis diverges from existing sites.
- **Lane**: Kinetic Typography (unused in repo).
- **Metaphor**: Runway (unused).
- **Page model**: single-page longscroll — six scenes on one URL.
- **Navigation**: right-edge minimap (unused paradigm) tracking IntersectionObserver entries; mobile falls back to a bottom dot-strip and top-right scene counter.
- **IA axis**: by rhythm (`Still / Stride / Turn`), not by genre.
- **Fonts**: Fraunces (variable, `opsz` / `SOFT` / `WONK` axes) + Bricolage Grotesque (variable body) + Geist Mono (meta). None of these appear elsewhere in the repo.
- **Palette**: ecru `#EEEAE0` paper + bronze `#6B4A1E` accent — distinct from every other site's palette.
- **Signature interaction**: `useKineticAxes` smooths `useVelocity(scrollY)` and maps it onto the four Fraunces variation axes live via `useMotionTemplate`; scene headings and the hero name thicken + soften + go wonky with scroll speed, then settle back. `useReducedMotion` locks to still-state.
- Typewriter reveal of the display name on first paint (55ms/char), reduced-motion-aware.
- Scenes:
  - `01 Hello` — kinetic hero, name + subtitle.
  - `02 Still` / `03 Stride` / `04 Turn` — staggered 2-frame series, reversed alternation for rhythm.
  - `05 Process` — diary-style about placeholder, no bio+stats grid.
  - `06 Reach` — one-line copy-on-click email, no form.
- `/about` and `/contact` routes removed (single-page concept); sitemap trimmed to `/`.
- Placeholder policy: bio/stats/agencies/email are clearly-labelled placeholders; media are six abstract gradient SVGs in the palette. Nothing fabricated about Hanna.
- Pre-commit grep for banned tropes (`Vol(ume|\.) ?0?1|MMX|plate|Plates|Masthead|Colophon`) returns zero matches.

## 2026-04-18 — Deploy-ready
- Site-scoped follow-up so HEAD is inside `sites/hanna-burgstaller/` when the Vercel project first pulls — the `ignoreCommand` returns non-zero and the first build runs (per the bootstrap gotcha documented in root `CLAUDE.md`).
