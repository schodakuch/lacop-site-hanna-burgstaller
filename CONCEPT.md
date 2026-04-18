# Concept Sheet — sites/hanna-burgstaller

## 1. Visual lane (§ 2)
Primary: Kinetic Typography
Secondary signature: scroll-velocity-driven variable-font axis morph (Fraunces `opsz` / `SOFT` / `WONK` / `wght` respond to scroll speed)

## 2. Site metaphor (§ 3)
This site IS a **Runway** — a sequence you watch, scene by scene. Copy is pacing words (still, stride, turn, pivot), not genre names.

## 3. Page model (§ 4)
Single-page longscroll. One URL, six scenes separated by anchor links.

## 4. Navigation paradigm (§ 5)
Minimap — right-edge scene dots, scroll-linked via IntersectionObserver. No top bar, no left rail.

## 5. Information architecture (§ 6)
By **rhythm** — not by category. Series are labelled `Still / Stride / Turn` (tempo words), not `Editorial / Portraiture / Lifestyle`.

## 6. Entry point (§ 7)
Typewriter reveal of the name on load (60ms/char), then the hint line fades in. No splash, no gate, no video.

## 7. Hero archetype (§ 8)
Kinetic type wall — name and subtitle only. No hero photograph. Image only appears at scene 02.

## 8. Primary content presentation (§ 9)
Scroll-snap stories — each rhythm is a full-width scene with an oversized kinetic heading, a one-sentence caption, and a staggered **frame pair** (two photos with offset vertical rhythm). No grid.

## 9. About / story paradigm (§ 10)
Process diary — headed "Process", the copy frames itself as a working journal ("call sheets, test frames, the ten minutes before a slate"), not a bio+stats page.

## 10. Contact / conversion archetype (§ 11)
One-line email — the address is the only CTA, displayed as a clickable display-face line; click copies to clipboard. No form fields.

## 11. Reading rhythm
Pacing: **episodic** (six discrete scenes with anchor jumps)
Density: **minimal** (one heading + one sentence + frames per scene)
Voice: **deadpan / poetic** (pacing words, no marketing copy)

## 12. The One Sentence
**"It's the runway one where the type thickens and softens as you scroll through six scenes."**

## 13. Divergence check
- Lane: Kinetic Typography — UNUSED in assignment ledger
- Metaphor: Runway — UNUSED
- Page model: Single-page longscroll — UNUSED (lea-emrich used single-page but scene-less)
- Nav: Minimap — UNUSED (carina: side rail, others: top bar)
- IA axis: By rhythm — UNUSED (all others: by category or mood)
- Entry: Typewriter reveal (loading manifesto variant) — UNUSED
- Hero: Kinetic type wall — UNUSED
- Content: Scroll-snap stories — UNUSED
- About: Process diary — UNUSED
- Contact: One-line email — UNUSED

Every column diverges from every existing site. No clashes.

## Signature interaction

`src/app/HomeClient.tsx::useKineticAxes` reads `useVelocity(scrollY)`, smooths it with a spring, clamps the absolute value, and maps it onto four Fraunces axes (`opsz`, `wght`, `SOFT`, `WONK`). The resulting `font-variation-settings` string is applied live to every scene heading and the hero name via `useMotionTemplate`. Respects `useReducedMotion` (locked to the still-state settings).

## Fonts
- **Fraunces** (display, variable — opsz / SOFT / WONK axes requested)
- **Bricolage Grotesque** (body, variable)
- **Geist Mono** (meta / minimap / eyebrows)

None of these fonts appear in any other site in the repo.

## Palette
- Paper: `#EEEAE0` (ecru)
- Ink: `#141210`
- Accent: `#6B4A1E` (bronze) — distinct from carina's clay `#B68D6A`, lea's periwinkle, martina's terracotta.

## Placeholder policy
Bio, stats, agencies, bookings email, and photography are all clearly-labelled placeholders. The six media items are abstract gradient SVGs in the site palette. Nothing is fabricated about Hanna herself.
