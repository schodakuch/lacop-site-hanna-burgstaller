# Changelog — sites/hanna-burgstaller

Demo site for Hanna Burgstaller (hanna-burgstaller.lacop.site).

## 2026-04-20 — Variable category count (tenants can add / rename / remove)

- Removed `categories.slice(0, 3)` in both HomeClient and Navigation.
  The onepager now renders one rhythm scene per visible category, in
  `sort_order`, however many the tenant has. Scene numbering for
  Process and Contact trails the rhythm count
  (`rhythmCategories.length + 2` / `+ 3`) so the decoration stays in
  sync when customers rename or reorder categories in the LACOP app.
- `tempoByIndex` / `captionByIndex` wrap via modulo — site-level voice
  carries through for any N. The bottom-of-cover hint strip now echoes
  the tenant's actual category names rather than a hard-coded
  "still · stride · turn".
- 0-category fallback: the cover CTA jumps straight to Process if no
  rhythm scenes exist (e.g. a brand-new account with no uploads yet).
- Desktop minimap wraps with `max-h-[72vh] overflow-y-auto` so a tenant
  with many categories stays usable on short viewports.

## 2026-04-20 — Back to single-page longscroll (diverge from carina)

Reason: the previous 4-page booklet (cover / photos / about / contact with
a numbered page ledger) overlapped Carina-Rebecca's "Lookbook" paradigm —
same IA, same `01/02/03/04` decoration, same side-rail-ish nav idea, just
inverted palette. The scroll-velocity kinetic type promised in CONCEPT.md
only activated on isolated H1s, so the site's actual divergent interaction
was buried.

What changed:
- Collapsed `/photos`, `/about`, `/contact` into six scenes on `/`
  (cover → three rhythm scenes from `categories.slice(0, 3)` → process →
  contact). The URLs, the `Pagination` component, the `usePages` hook,
  and `src/lib/pages.ts` are gone. `sitemap.ts` now has one URL.
- Replaced the "01 · Cover · 02 · Photos …" page-ledger nav with a
  right-edge scene-dot minimap (labels on hover, active scene in flare)
  wired to IntersectionObserver. No top bar on desktop; mobile keeps a
  minimal "Jump to ▾" drawer.
- Every scene heading reads `fontVariationSettings` from
  `useKineticAxes()` — the scroll-velocity → Fraunces `opsz/wght/SOFT/WONK`
  morph now drives the entire page instead of four isolated H1s.
- Scenes 02/03/04 iterate `categories.slice(0, 3)` positionally (no
  hard-coded slug lookups, per PITFALLS § 4). Labels come from
  `category.name`; eyebrow + caption from `tempoByIndex[i]` /
  `captionByIndex[i]`. LACOP shape flows untouched — `getProfile` /
  `getCategories` / `getAllMedia` still resolve via `src/lib/lacop.ts`,
  media still filtered by `category_id`, social links sanitised with
  `safeUrl()`.
- New `src/lib/scenes.ts` centralises the six scene IDs so HomeClient
  and Navigation can't drift out of sync.

Signature interaction (unchanged, now prominent): scroll velocity → spring
→ clamped → mapped onto four Fraunces axes → applied via
`useMotionTemplate` to every scene heading. Respects
`useReducedMotion` (locks to still-state settings).

## 2026-04-19 — Multi-page refactor (cover / photos / about / contact)
- Single-page scroll-through (scenes 01–06 stacked on `/`) replaced by
  a four-page site: `/` cover, `/photos` (stacked category sections +
  sticky scroll-spy strip), `/about` (formerly scene 05 Process),
  `/contact` (formerly scene 06 Reach with copy-email). Categories
  remain taxonomy inside /photos — they don't become separate routes.
- Mobile nav rebuilt for touch: fixed top bar (brand + current page
  number + DE toggle + Menu), drop-down drawer with 56px-tall rows,
  numbered labels, and an active-page highlight in flare. Replaces the
  old bottom dot strip, which only showed numbers without labels —
  visitors had no way to tell which dot meant what.
- Desktop nav keeps the signature right-edge minimap, now linking
  between real pages rather than scroll anchors. Active page rail
  thickens to 2px in flare; inactive entries fade in on hover as
  before.
- Cover page restructured so the brand corner label no longer overlaps
  the "A scrolling sequence" eyebrow on short mobile viewports —
  content now starts below a reserved 96px top clearance.
- New shared infrastructure:
  - `src/lib/pages.ts` — flat 4-page `buildPages({cover, photos, about, contact})`.
  - `src/hooks/usePages.ts` — client hook returning the ledger with
    active tenant's language labels.
  - `src/lib/kinetic.ts` — extracted `useKineticAxes()` so every page's
    H1 gets the same scroll-velocity font-variation interaction. The
    kinetic typography is now a cross-page signature, not scene-only.
  - `src/components/Pagination.tsx` — prev/next between pages.
- Sitemap emits four URLs; dual-build verified: primary and
  `LACOP_USER_SLUG=sample-alt` both produce identical 4-route trees.

## 2026-04-19 — Dark-first palette with acid chartreuse signal
- Old palette (warm ecru `#EEEAE0` paper + bronze `#6B4A1E` accent) sat
  squarely inside the repo's gold/champagne/tan bucket — five other
  sites already use variations on that (jitka champagne, josefine gold,
  lenandjakobookings tan, carina-rebecca clay, lea-emrich is the only
  cool outlier). Swapped to a dark-first palette: near-black cool ground
  `#131319`, warm bone type `#F2EEE3`, acid chartreuse flare `#C8FF4A`.
  Nothing else in the repo looks like this — it's the only dark-mode
  site in the lineup and the only chartreuse accent.
- Renamed CSS vars + tailwind token classes accordingly:
  `--ecru → --shade`, `--bronze → --flare`, `--bronze-soft → --flare-soft`.
  Components swept: `bg-ecru → bg-shade`, `text-bronze → text-flare`,
  `bg-bronze → bg-flare`, `hover:text-bronze → hover:text-flare`.
- Grain overlay switched from `mix-blend-mode: multiply` at 0.06 opacity
  (invisible on dark — black × near-black ≈ black) to `overlay` at 0.14.
  Overlay lifts highlights and deepens shadows both ways, keeping the
  photographic texture legible against the black ground.
- Focus ring + selection now render in chartreuse — acts as a cue-light
  signal against the dark, WCAG AAA against the ground.

## 2026-04-19 — Meta description: stop leaking hanna's taxonomy into other tenants
- `generateMetadata()` fallback used a hard-coded tagline
  `"a scrolling sequence. Stills, strides, turns."` — for any tenant
  without a bio, their SEO meta would falsely advertise hanna's category
  names. Now fetches `getCategories()` alongside the profile and weaves
  the active customer's first three category names into the tagline:
  `"<displayName> — a scrolling sequence: <cat1>, <cat2> and <cat3>."`.
  Verified: primary emits "still, stride and turn"; sample-alt
  (if bio-less) would emit "studio, street and editorial".

## 2026-04-19 — True multi-tenant shell
- Shell was multi-tenant-*shaped* (LACOP_USER_SLUG env + resolvers) but
  HomeClient + Navigation were hard-coded to the category slugs
  `still / stride / turn`, so flipping the env var would have broken the
  page. Refactored: scenes 02/03/04 now derive positionally from the
  active customer's first three categories, with `category.name` as the
  big display label. Tempo words and generic captions are positional
  (`tempoByIndex[0..2]`, `captionByIndex[0..2]`) — the hanna shell's
  voice is preserved regardless of which customer is rendered.
- `ProfileContext` extended to carry `{ profile, categories }`; layout
  fetches both and passes them through. Navigation reads categories via
  `useCategories()` and builds its minimap scene list dynamically.
- `src/data/content.ts` dropped slug-specific keys
  (`translations.nav.still/stride/turn`, `translations.still/stride/turn.caption`,
  `translations.scene.held/in_motion/pivot`) in favour of positional
  `tempoByIndex` and `captionByIndex` arrays plus fixed-scene bookends
  (01 Hello / 05 Process / 06 Reach).
- Seeded a second demo profile in `src/data/mock.ts` (`sample-alt`,
  categories: Studio / Street / Editorial) so the multi-tenancy is
  testable end-to-end. `LACOP_USER_SLUG=sample-alt npm run build` now
  generates a completely different customer through the same visual
  shell — proving the env-var swap works.

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

## 2026-04-18 — Mobile fix: touch targets + iOS safe area on scene minimap
- Mobile bottom dot strip buttons were `w-2 h-2` (8px) — well below the 44px
  touch-target minimum. Each button is now a `w-9 h-9` (36px) tappable
  square with the coloured dot as a purely decorative child; effective
  hit area covers the 44px guideline once combined with the pill's gap.
- Bottom position now uses `max(0.75rem, env(safe-area-inset-bottom))` so
  the pill clears the iOS home indicator on notched devices.
