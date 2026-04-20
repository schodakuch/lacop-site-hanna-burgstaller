"use client";

import Image from "next/image";
import {
  motion,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";
import { useMemo } from "react";
import type { Category, Media, Profile } from "@/lib/types";
import {
  captionByIndex,
  tempoByIndex,
  translations,
} from "@/data/content";
import { useLang } from "@/context/LanguageContext";
import { useKineticAxes } from "@/lib/kinetic";
import FramePair from "@/components/FramePair";

type Props = { profile: Profile; categories: Category[]; media: Media[] };

// Full library. Each visible category (any count, sort_order ASC) gets
// its own section: eyebrow + kinetic heading + caption + FramePair
// (first 2 frames) + staggered gallery of the remaining frames. The
// sticky scroll-spy used in carina's /photos is deliberately NOT
// present here — hanna's minimap on the right is the navigation
// surface, so a second sticky strip would duplicate it and clutter
// the scene-frame voice.

// The staggered gallery below each FramePair. Renders photos 3..N
// (anything after the FramePair). Alternates offset so the grid
// doesn't read as a uniform 3-column strip.
function RemainingGrid({ shots, alt }: { shots: Media[]; alt: string }) {
  if (shots.length === 0) return null;
  return (
    <div className="mt-12 md:mt-20 grid grid-cols-2 md:grid-cols-3 gap-5 md:gap-8">
      {shots.map((s, i) => {
        const stagger =
          i % 3 === 1 ? "md:mt-10" : i % 3 === 2 ? "md:mt-20" : "";
        return (
          <motion.figure
            key={s.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{
              duration: 0.6,
              delay: (i % 3) * 0.05,
              ease: [0.16, 1, 0.3, 1],
            }}
            className={`relative ${stagger}`}
          >
            <div
              className="relative overflow-hidden bg-shade grain"
              style={{
                aspectRatio: `${s.width ?? 720} / ${s.height ?? 900}`,
              }}
            >
              <Image
                src={s.url}
                alt={s.title ?? `${alt} — frame ${i + 3}`}
                fill
                sizes="(min-width: 768px) 32vw, 50vw"
                className="object-cover"
              />
            </div>
            <figcaption className="mono text-[0.58rem] tracking-[0.2em] text-muted tabular-nums mt-2 uppercase">
              {alt} — {String(i + 3).padStart(2, "0")}
            </figcaption>
          </motion.figure>
        );
      })}
    </div>
  );
}

export default function PhotosClient({ profile, categories, media }: Props) {
  const { t } = useLang();
  const reduced = useReducedMotion();
  const axes = useKineticAxes(reduced);

  const mediaByCategory = useMemo(() => {
    const map = new Map<string, Media[]>();
    for (const mItem of media) {
      if (!mItem.category_id) continue;
      if (!map.has(mItem.category_id)) map.set(mItem.category_id, []);
      map.get(mItem.category_id)!.push(mItem);
    }
    return map;
  }, [media]);

  const displayName = profile.display_name ?? profile.slug;

  return (
    <article className="relative px-5 md:px-16 lg:px-24 pt-28 md:pt-32 pb-16 max-w-[1400px] mx-auto">
      {/* Page opener — not a scene header, just a quiet kicker + intro */}
      <header className="max-w-[52ch] mb-14 md:mb-20">
        <span className="mono text-[0.66rem] tracking-[0.22em] text-muted uppercase">
          {displayName}
        </span>
        <motion.h1
          className="display mt-4 text-[clamp(3rem,10vw,6.8rem)]"
          style={{ fontVariationSettings: axes as MotionValue<string> }}
        >
          {t(translations.photos.heading)}
        </motion.h1>
        <p className="mt-6 text-[1.02rem] text-ink-soft leading-relaxed">
          {t(translations.photos.intro)}
        </p>
      </header>

      {categories.length === 0 && (
        <p className="mono text-[0.7rem] tracking-[0.2em] text-muted uppercase py-24">
          — {t(translations.photos.empty)}
        </p>
      )}

      {categories.map((cat, i) => {
        const all = (mediaByCategory.get(cat.id) ?? []).slice();
        const hero = all.slice(0, 2);
        const rest = all.slice(2);
        const count = all.length;
        const tempo = tempoByIndex[i % tempoByIndex.length];
        const caption = captionByIndex[i % captionByIndex.length];
        const offset: "left" | "right" = i % 2 === 0 ? "left" : "right";
        const countCopy =
          count === 0
            ? t(translations.photos.empty)
            : count === 1
              ? t(translations.photos.frame_count.one)
              : t(translations.photos.frame_count.other).replace(
                  "{n}",
                  String(count),
                );
        return (
          <section
            key={cat.id}
            id={`cat-${cat.slug}`}
            className="scroll-mt-24 pt-16 md:pt-24 pb-20 md:pb-28 border-t border-rule"
          >
            <div className="flex items-end justify-between gap-6 mb-8 md:mb-12">
              <div>
                <span className="mono text-[0.64rem] tracking-[0.22em] text-muted tabular-nums uppercase">
                  {t(tempo)}
                </span>
                <motion.h2
                  className={`display mt-3 text-[clamp(2.8rem,10vw,6.4rem)] max-w-[18ch] ${
                    offset === "right" ? "md:text-right md:ml-auto" : ""
                  }`}
                  style={{ fontVariationSettings: axes as MotionValue<string> }}
                >
                  {cat.name}
                </motion.h2>
              </div>
              <span className="mono text-[0.6rem] tracking-[0.2em] text-muted tabular-nums uppercase shrink-0 pb-2">
                {countCopy}
              </span>
            </div>
            <p
              className={`max-w-[42ch] text-[1rem] text-ink-soft leading-relaxed ${
                offset === "right" ? "md:ml-auto md:text-right" : ""
              }`}
            >
              {t(caption)}
            </p>
            <FramePair
              shots={hero}
              offset={offset}
              alt={cat.name}
              reduced={reduced}
            />
            {rest.length > 0 && (
              <>
                <span className="mono mt-16 md:mt-24 block text-[0.6rem] tracking-[0.22em] text-muted uppercase">
                  — {t(translations.photos.more)}
                </span>
                <RemainingGrid shots={rest} alt={cat.name} />
              </>
            )}
          </section>
        );
      })}
    </article>
  );
}
