"use client";

import Image from "next/image";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  type MotionValue,
} from "framer-motion";
import { useEffect, useState } from "react";
import type { Profile, Category, Media } from "@/lib/types";
import { captionByIndex, tempoByIndex, translations } from "@/data/content";
import { useLang } from "@/context/LanguageContext";

type Props = { profile: Profile; categories: Category[]; media: Media[] };

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

// Scroll-velocity-driven font-variation-settings for the display face.
// Fraunces exposes opsz, SOFT, and WONK — we feed a clamped absolute
// velocity into all three so the type swells, softens, and goes slightly
// wonky when the visitor scrolls fast, then settles back when still.
// This is the site's signature interaction.
function useKineticAxes(reduced: boolean | null) {
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { damping: 60, stiffness: 200, mass: 0.4 });
  const absVel = useTransform(smooth, (v) => Math.min(Math.abs(v), 3000));

  // 0 when still, 1 at max clamped velocity.
  const t: MotionValue<number> = useTransform(absVel, [0, 1600, 3000], [0, 0.6, 1]);

  const wght = useTransform(t, [0, 1], [340, 820]);
  const soft = useTransform(t, [0, 1], [0, 100]);
  const wonk = useTransform(t, [0, 1], [0, 1]);
  const opsz = useTransform(t, [0, 1], [120, 144]);

  const still = useMotionValue("\"opsz\" 144, \"wght\" 340, \"SOFT\" 0, \"WONK\" 0");
  const live = useMotionTemplate`"opsz" ${opsz}, "wght" ${wght}, "SOFT" ${soft}, "WONK" ${wonk}`;
  return reduced ? still : live;
}

function TypewriterName({ name, reduced }: { name: string; reduced: boolean | null }) {
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
        <span className="inline-block w-[0.08em] -mb-[0.05em] align-baseline bg-flare animate-pulse" style={{ height: "0.82em" }} />
      )}
    </>
  );
}

function FramePair({
  shots,
  reversed,
  alt,
}: {
  shots: Media[];
  reversed?: boolean;
  alt: string;
}) {
  if (shots.length === 0) return null;
  return (
    <div
      className={`mt-10 md:mt-16 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 ${reversed ? "md:[&>figure:first-child]:col-start-7" : ""}`}
    >
      {shots.slice(0, 2).map((s, i) => (
        <figure
          key={s.id}
          className={`relative md:col-span-6 ${i === 0 ? (reversed ? "md:mt-16" : "") : reversed ? "" : "md:mt-20"}`}
        >
          <div
            className="relative overflow-hidden bg-shade grain"
            style={{
              aspectRatio: `${s.width ?? 720} / ${s.height ?? 900}`,
            }}
          >
            <Image
              src={s.url}
              alt={s.title ?? `${alt} — frame ${i + 1}`}
              fill
              sizes="(min-width: 768px) 45vw, 100vw"
              className="object-cover"
            />
          </div>
          <figcaption className="mono text-[0.62rem] tracking-[0.2em] text-muted tabular-nums mt-2">
            {alt.toUpperCase()} · {String(i + 1).padStart(2, "0")} / {String(shots.length).padStart(2, "0")}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

function SceneHeading({
  n,
  label,
  tempoWord,
  axes,
}: {
  n: string;
  label: string;
  tempoWord: string;
  axes: MotionValue<string> | string;
}) {
  return (
    <div className="flex items-end justify-between gap-6 rule-t pt-5 mb-10 md:mb-14">
      <div>
        <span className="mono text-[0.66rem] tracking-[0.22em] text-muted tabular-nums">
          {n} · {tempoWord}
        </span>
        <motion.h2
          className="display mt-3 text-[clamp(3.2rem,10vw,7.4rem)]"
          style={{ fontVariationSettings: axes as MotionValue<string> }}
        >
          {label}
        </motion.h2>
      </div>
    </div>
  );
}

export default function HomeClient({ profile, categories, media }: Props) {
  const { t, lang } = useLang();
  const reduced = useReducedMotion();
  const axes = useKineticAxes(reduced);

  const displayName = profile.display_name ?? profile.slug;
  const placeholderEmail = `hello@${profile.slug}.example`;

  // Scenes 02/03/04 are the customer's first three categories, positional —
  // any customer's taxonomy flows through the shell without code change.
  const contentCategories = categories.slice(0, 3);
  const byCategory = (catId: string) =>
    media.filter((m) => m.category_id === catId);

  // One-line email copy interaction
  const [copied, setCopied] = useState(false);
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(placeholderEmail);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="relative overflow-hidden">
      {/* Scene 01 — Hello */}
      <section
        id="scene-01"
        className="relative min-h-[100svh] flex items-center px-5 md:px-16 lg:px-24 pt-16 md:pt-10 pb-24"
      >
        <div className="relative z-10 max-w-[16ch]">
          <span className="mono text-[0.7rem] tracking-[0.24em] text-muted uppercase">
            {t(translations.hello.eyebrow)}
          </span>
          <motion.h1
            className="display mt-6 text-[clamp(3.4rem,14vw,10rem)]"
            style={{ fontVariationSettings: axes as MotionValue<string> }}
          >
            <TypewriterName name={displayName.split(" ")[0]} reduced={reduced} />
            <br />
            <span className="text-ink-soft">
              <TypewriterName
                name={displayName.split(" ").slice(1).join(" ")}
                reduced={reduced}
              />
            </span>
          </motion.h1>
          <p className="mt-8 max-w-[30ch] text-[1.05rem] leading-relaxed text-ink-soft">
            {profile.bio ?? t(translations.hello.subtitle)}
          </p>
          <a
            href="#scene-02"
            className="mono inline-block mt-10 text-[0.8rem] tracking-[0.2em] uppercase hover-mark"
          >
            {t(translations.hello.invitation)} →
          </a>
          <p className="mono mt-8 text-[0.62rem] tracking-[0.22em] text-muted uppercase max-w-[36ch]">
            {t(translations.hello.hint)}
          </p>
        </div>
      </section>

      {/* Scenes 02/03/04 — positional from customer's first three categories */}
      {contentCategories.map((cat, i) => {
        const n = String(i + 2).padStart(2, "0");
        const reversed = i === 1;
        const tempo = tempoByIndex[i] ?? tempoByIndex[0];
        const caption = captionByIndex[i] ?? captionByIndex[0];
        return (
          <section
            key={cat.id}
            id={`scene-${n}`}
            className="px-5 md:px-16 lg:px-24 py-24 md:py-32"
          >
            <SceneHeading
              n={n}
              label={cat.name}
              tempoWord={t(tempo)}
              axes={axes}
            />
            <p className="max-w-[44ch] text-[1.02rem] text-ink-soft leading-relaxed">
              {t(caption)}
            </p>
            <FramePair shots={byCategory(cat.id)} reversed={reversed} alt={cat.name} />
          </section>
        );
      })}

      {/* Scene 05 — Process */}
      <section
        id="scene-05"
        className="px-5 md:px-16 lg:px-24 py-24 md:py-32"
      >
        <SceneHeading
          n="05"
          label={t(translations.process.heading)}
          tempoWord={lang === "de" ? "in Arbeit" : "in progress"}
          axes={axes}
        />
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
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
              <p className="pt-3 rule-t">
                {t(translations.process.placeholder_note)}
              </p>
            )}
          </aside>
        </div>
      </section>

      {/* Scene 06 — Reach */}
      <section id="scene-06" className="px-5 md:px-16 lg:px-24 py-24 md:py-40">
        <SceneHeading
          n="06"
          label={t(translations.reach.heading)}
          tempoWord={lang === "de" ? "direkt" : "direct"}
          axes={axes}
        />
        <p className="text-[1.08rem] text-ink-soft max-w-[44ch] leading-relaxed">
          {t(translations.reach.lede)}
        </p>
        <div className="mt-10 md:mt-14">
          <button
            type="button"
            onClick={copyEmail}
            className="display block text-left text-[clamp(1.6rem,5vw,3rem)] tracking-[-0.02em] hover:text-flare transition-colors"
            aria-label={t(translations.reach.copy_hint)}
          >
            {placeholderEmail}
          </button>
          <span className="mono mt-3 block text-[0.68rem] tracking-[0.22em] text-muted uppercase">
            {copied ? t(translations.reach.copied) : t(translations.reach.copy_hint)}
          </span>
          <p className="mono mt-10 text-[0.64rem] tracking-[0.2em] text-muted max-w-[48ch]">
            {t(translations.reach.placeholder_note)}
          </p>
          {Object.keys(profile.social_links).length > 0 && (
            <ul className="mt-10 flex flex-wrap gap-6 mono text-[0.72rem] tracking-[0.2em] uppercase">
              {Object.entries(profile.social_links).map(([k, v]) => (
                <li key={k}>
                  <a
                    href={v}
                    target="_blank"
                    rel="noreferrer"
                    className="hover-mark"
                  >
                    {k}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* Sentinel for minimap end-of-scroll */}
      <div aria-hidden className="h-px" />
    </div>
  );
}
