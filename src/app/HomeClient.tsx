"use client";

import Image from "next/image";
import {
  motion,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import type { Category, Media, Profile } from "@/lib/types";
import { captionByIndex, tempoByIndex, translations } from "@/data/content";
import { useLang } from "@/context/LanguageContext";
import { useKineticAxes } from "@/lib/kinetic";
import { SCENE_IDS, rhythmSceneId } from "@/lib/scenes";
import { safeUrl } from "@/lib/utils";

type Props = { profile: Profile; categories: Category[]; media: Media[] };

// Single-page longscroll — six scenes, one URL, anchored jumps. Each
// scene heading reads `font-variation-settings` from `useKineticAxes()`,
// which responds to scroll velocity via a spring on `useVelocity(scrollY)`.
// That kinetic response is the site's whole UI surface; there is no grid,
// no rail, no pagination. The minimap dots on the right edge (see
// Navigation.tsx) track which scene is on screen via IntersectionObserver.
//
// Scenes 02/03/04 are built positionally from `categories.slice(0, 3)`
// — no hard-coded slug lookups, so the tenant swap (LACOP_USER_SLUG)
// renders any customer's first three categories as rhythm scenes
// labelled by `category.name` with positional tempo/caption from
// `tempoByIndex[i]` / `captionByIndex[i]`.

function TypewriterName({
  name,
  reduced,
}: {
  name: string;
  reduced: boolean | null;
}) {
  const [shown, setShown] = useState(reduced ? name.length : 0);
  useEffect(() => {
    if (reduced) return;
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setShown(i);
      if (i >= name.length) clearInterval(id);
    }, 55);
    return () => clearInterval(id);
  }, [name, reduced]);
  return (
    <>
      {name.slice(0, shown)}
      {shown < name.length && (
        <span
          className="inline-block w-[0.08em] -mb-[0.05em] align-baseline bg-flare animate-pulse"
          style={{ height: "0.82em" }}
        />
      )}
    </>
  );
}

function bookingEmailFor(profile: Profile): string {
  if (profile.website_domain) {
    return `hello@${profile.website_domain.replace(/^https?:\/\//, "")}`;
  }
  return `hello@${profile.slug}.lacop.site`;
}

function FramePair({
  shots,
  offset,
  alt,
  reduced,
}: {
  shots: Media[];
  offset: "left" | "right";
  alt: string;
  reduced: boolean | null;
}) {
  if (shots.length === 0) {
    return (
      <div className="mt-10 md:mt-14 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10">
        <div
          className={`md:col-span-7 ${offset === "left" ? "md:col-start-1" : "md:col-start-6"} bg-shade rounded-sm`}
          style={{ aspectRatio: "720 / 900" }}
        />
      </div>
    );
  }
  const [first, second] = shots;
  const primarySpan =
    offset === "left"
      ? "md:col-span-7 md:col-start-1"
      : "md:col-span-7 md:col-start-6";
  const secondarySpan =
    offset === "left"
      ? "md:col-span-4 md:col-start-9 md:mt-24"
      : "md:col-span-4 md:col-start-1 md:mt-24";

  return (
    <div className="mt-10 md:mt-14 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10">
      <motion.figure
        initial={reduced ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className={`relative ${primarySpan}`}
      >
        <div
          className="relative overflow-hidden bg-shade grain"
          style={{
            aspectRatio: `${first.width ?? 720} / ${first.height ?? 900}`,
          }}
        >
          <Image
            src={first.url}
            alt={first.title ?? `${alt} — frame 01`}
            fill
            sizes="(min-width: 768px) 55vw, 100vw"
            className="object-cover"
          />
        </div>
        <figcaption className="mono text-[0.62rem] tracking-[0.2em] text-muted tabular-nums mt-2">
          {alt} — 01 / {String(shots.length).padStart(2, "0")}
        </figcaption>
      </motion.figure>
      {second && (
        <motion.figure
          initial={reduced ? false : { opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{
            duration: 0.7,
            delay: 0.12,
            ease: [0.16, 1, 0.3, 1],
          }}
          className={`relative ${secondarySpan}`}
        >
          <div
            className="relative overflow-hidden bg-shade grain"
            style={{
              aspectRatio: `${second.width ?? 720} / ${second.height ?? 900}`,
            }}
          >
            <Image
              src={second.url}
              alt={second.title ?? `${alt} — frame 02`}
              fill
              sizes="(min-width: 768px) 32vw, 100vw"
              className="object-cover"
            />
          </div>
          <figcaption className="mono text-[0.62rem] tracking-[0.2em] text-muted tabular-nums mt-2">
            {alt} — 02 / {String(shots.length).padStart(2, "0")}
          </figcaption>
        </motion.figure>
      )}
    </div>
  );
}

function SceneMeta({
  index,
  tempo,
}: {
  index: string;
  tempo: string;
}) {
  return (
    <span className="mono text-[0.66rem] tracking-[0.22em] text-muted tabular-nums">
      {index} · {tempo}
    </span>
  );
}

export default function HomeClient({ profile, categories, media }: Props) {
  const { t } = useLang();
  const reduced = useReducedMotion();
  const axes = useKineticAxes(reduced);
  const [copied, setCopied] = useState(false);

  const displayName = profile.display_name ?? profile.slug;
  const firstName = displayName.split(" ")[0];
  const lastName = displayName.split(" ").slice(1).join(" ");

  // Rhythm scenes = every visible category, in `sort_order`. The tenant
  // can rename / add / remove / reorder categories in the LACOP app and
  // this page reflows automatically. tempoByIndex + captionByIndex wrap
  // via modulo, so site-level voice carries through for any count — 1
  // category or 12.
  const rhythmCategories = categories;

  const mediaByCategory = useMemo(() => {
    const map = new Map<string, Media[]>();
    for (const mItem of media) {
      if (!mItem.category_id) continue;
      if (!map.has(mItem.category_id)) map.set(mItem.category_id, []);
      map.get(mItem.category_id)!.push(mItem);
    }
    return map;
  }, [media]);

  const bookingEmail = bookingEmailFor(profile);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(bookingEmail);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  // The little rhythm strip at the bottom of the cover — echoes the
  // scene labels in order. Derived from the active tenant so a customer
  // with { Studio, Street, Editorial } sees their own taxonomy, not
  // hanna's. Falls back to a short manifesto if there are zero
  // categories (e.g. brand-new account).
  const hintRotator = useMemo(
    () =>
      rhythmCategories.length > 0
        ? [
            ...rhythmCategories.map((c) => c.name.toLowerCase()),
            t(translations.process.heading).toLowerCase(),
            t(translations.contact.heading).toLowerCase(),
          ]
        : [t(translations.cover.hint).split(".")[0].toLowerCase()],
    [rhythmCategories, t],
  );

  return (
    <article className="relative">
      {/* ───── Scene 01 — Cover ───── */}
      <section
        id={SCENE_IDS.cover}
        className="relative min-h-[92svh] md:min-h-screen px-5 md:px-16 lg:px-24 pt-28 md:pt-32 pb-20 md:pb-28 max-w-[1400px] mx-auto flex flex-col justify-center"
      >
        <SceneMeta index="01" tempo={t(translations.cover.eyebrow)} />
        <motion.h1
          className="display mt-6 md:mt-8 text-[clamp(3.2rem,14vw,10.5rem)] max-w-[16ch]"
          style={{ fontVariationSettings: axes as MotionValue<string> }}
        >
          <TypewriterName name={firstName} reduced={reduced} />
          {lastName && (
            <>
              <br />
              <span className="text-ink-soft">
                <TypewriterName name={lastName} reduced={reduced} />
              </span>
            </>
          )}
        </motion.h1>
        <p className="mt-10 md:mt-12 max-w-[38ch] text-[1.05rem] leading-relaxed text-ink-soft">
          {profile.bio ?? t(translations.cover.subtitle)}
        </p>
        <a
          href={`#${
            rhythmCategories.length > 0 ? rhythmSceneId(0) : SCENE_IDS.process
          }`}
          className="mono inline-block mt-10 md:mt-12 text-[0.78rem] tracking-[0.22em] uppercase hover-mark w-fit"
        >
          {t(translations.cover.invitation)} ↓
        </a>
        <p className="mono mt-14 md:mt-20 text-[0.62rem] tracking-[0.22em] text-muted uppercase max-w-[36ch]">
          {t(translations.cover.hint)}
        </p>
        <span
          aria-hidden
          className="mono mt-auto pt-16 text-[0.56rem] tracking-[0.28em] text-muted uppercase"
        >
          {hintRotator.join("  ·  ")}
        </span>
      </section>

      {/* ───── Rhythm scenes (one per visible category, in sort order) ───── */}
      {rhythmCategories.map((cat, i) => {
        const shots = (mediaByCategory.get(cat.id) ?? []).slice(0, 2);
        // Positional eyebrow + caption — wrap with modulo so any count
        // works (1 category or 12). Tempo/caption repeat for i ≥ 3;
        // that's site-level voice, not tenant-specific.
        const tempo = tempoByIndex[i % tempoByIndex.length];
        const caption = captionByIndex[i % captionByIndex.length];
        const n = String(i + 2).padStart(2, "0");
        const offset: "left" | "right" = i % 2 === 0 ? "left" : "right";
        return (
          <section
            key={cat.id}
            id={rhythmSceneId(i)}
            className="relative scroll-mt-24 px-5 md:px-16 lg:px-24 py-24 md:py-36 max-w-[1400px] mx-auto border-t border-rule"
          >
            <SceneMeta index={n} tempo={t(tempo)} />
            <motion.h2
              className={`display mt-5 text-[clamp(3rem,12vw,8.4rem)] ${
                offset === "right" ? "md:text-right md:ml-auto md:max-w-[18ch]" : "max-w-[18ch]"
              }`}
              style={{ fontVariationSettings: axes as MotionValue<string> }}
            >
              {cat.name}
            </motion.h2>
            <p
              className={`mt-6 text-[1.02rem] text-ink-soft leading-relaxed max-w-[42ch] ${
                offset === "right" ? "md:ml-auto md:text-right" : ""
              }`}
            >
              {t(caption)}
            </p>
            <FramePair
              shots={shots}
              offset={offset}
              alt={cat.name}
              reduced={reduced}
            />
          </section>
        );
      })}

      {/* ───── Process (was /about) — scene number trails the rhythm count ───── */}
      <section
        id={SCENE_IDS.process}
        className="relative scroll-mt-24 px-5 md:px-16 lg:px-24 py-24 md:py-36 max-w-[1400px] mx-auto border-t border-rule"
      >
        <SceneMeta
          index={String(rhythmCategories.length + 2).padStart(2, "0")}
          tempo={t(translations.process.tempo)}
        />
        <motion.h2
          className="display mt-5 text-[clamp(2.8rem,10vw,6.8rem)] max-w-[16ch]"
          style={{ fontVariationSettings: axes as MotionValue<string> }}
        >
          {t(translations.process.heading)}
        </motion.h2>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-12 gap-10">
          <p className="md:col-span-7 text-[1.08rem] leading-relaxed max-w-[56ch]">
            {profile.about ?? t(translations.process.body)}
          </p>
          <aside className="md:col-span-4 md:col-start-9 mono text-[0.7rem] tracking-[0.18em] text-muted space-y-2 self-start">
            {Object.keys(profile.stats).length === 0 && (
              <p>— {t(translations.process.stats_empty)}</p>
            )}
            {profile.agencies.length === 0 && (
              <p>— {t(translations.process.agencies_empty)}</p>
            )}
            {profile.about === null && (
              <p className="pt-3 border-t border-rule">
                {t(translations.process.placeholder_note)}
              </p>
            )}
          </aside>
        </div>
      </section>

      {/* ───── Contact (final scene) ───── */}
      <section
        id={SCENE_IDS.contact}
        className="relative scroll-mt-24 px-5 md:px-16 lg:px-24 py-24 md:py-40 max-w-[1400px] mx-auto border-t border-rule"
      >
        <SceneMeta
          index={String(rhythmCategories.length + 3).padStart(2, "0")}
          tempo={t(translations.contact.tempo)}
        />
        <motion.h2
          className="display mt-5 text-[clamp(2.6rem,9vw,5.8rem)] max-w-[18ch]"
          style={{ fontVariationSettings: axes as MotionValue<string> }}
        >
          {t(translations.contact.heading)}
        </motion.h2>
        <p className="mt-6 text-[1.05rem] text-ink-soft max-w-[44ch] leading-relaxed">
          {t(translations.contact.lede)}
        </p>
        <div className="mt-10 md:mt-14">
          <button
            type="button"
            onClick={copyEmail}
            className="display block text-left text-[clamp(1.6rem,5.2vw,3.2rem)] tracking-[-0.02em] hover:text-flare transition-colors break-all"
            aria-label={t(translations.contact.copy_hint)}
          >
            {bookingEmail}
          </button>
          <span
            aria-live="polite"
            className="mono mt-3 block text-[0.68rem] tracking-[0.22em] text-muted uppercase"
          >
            {copied ? t(translations.contact.copied) : t(translations.contact.copy_hint)}
          </span>
          <p className="mono mt-10 text-[0.64rem] tracking-[0.2em] text-muted max-w-[48ch]">
            {t(translations.contact.placeholder_note)}
          </p>
          {Object.keys(profile.social_links).length > 0 && (
            <ul className="mt-10 flex flex-wrap gap-6 mono text-[0.72rem] tracking-[0.2em] uppercase">
              {Object.entries(profile.social_links).map(([k, v]) => {
                const href = safeUrl(v);
                if (!href) return null;
                return (
                  <li key={k}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      className="hover-mark"
                    >
                      {k}
                    </a>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>
    </article>
  );
}
