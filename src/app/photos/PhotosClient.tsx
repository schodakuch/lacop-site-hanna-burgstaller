"use client";

import Image from "next/image";
import {
  motion,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import type { Category, Media } from "@/lib/types";
import { captionByIndex, tempoByIndex, translations } from "@/data/content";
import { useLang } from "@/context/LanguageContext";
import { useKineticAxes } from "@/lib/kinetic";
import { usePages } from "@/hooks/usePages";
import Pagination from "@/components/Pagination";

type Props = { categories: Category[]; media: Media[] };

// Single photos page. All categories stack as anchored sections; a
// sticky scroll-spy strip at the top highlights the active series as
// the visitor scrolls. Categories are NOT separate pages — they live
// here. Kinetic display axes carry over from the cover page as the
// consistent signature across the site.

function FramePair({
  shots,
  reversed,
  alt,
}: {
  shots: Media[];
  reversed?: boolean;
  alt: string;
}) {
  if (shots.length === 0) {
    return (
      <div className="mt-8 md:mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            key={i}
            className="bg-shade rounded-sm"
            style={{ aspectRatio: "720 / 900" }}
          />
        ))}
      </div>
    );
  }
  return (
    <div
      className={`mt-8 md:mt-12 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 ${
        reversed ? "md:[&>figure:first-child]:col-start-7" : ""
      }`}
    >
      {shots.slice(0, 2).map((s, i) => (
        <figure
          key={s.id}
          className={`relative md:col-span-6 ${
            i === 0 ? (reversed ? "md:mt-16" : "") : reversed ? "" : "md:mt-20"
          }`}
        >
          <div
            className="relative overflow-hidden bg-shade grain"
            style={{ aspectRatio: `${s.width ?? 720} / ${s.height ?? 900}` }}
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

export default function PhotosClient({ categories, media }: Props) {
  const { t } = useLang();
  const reduced = useReducedMotion();
  const axes = useKineticAxes(reduced);
  const pages = usePages();
  const pageNum = pages.find((p) => p.key === "photos")?.n ?? "—";
  const [activeSlug, setActiveSlug] = useState<string>(
    categories[0]?.slug ?? "",
  );

  useEffect(() => {
    if (typeof window === "undefined" || categories.length === 0) return;
    const els = categories
      .map((c) => document.getElementById(`cat-${c.slug}`))
      .filter((el): el is HTMLElement => el instanceof HTMLElement);
    if (els.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        setActiveSlug(visible.target.id.replace(/^cat-/, ""));
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [categories]);

  const mediaByCategory = useMemo(() => {
    const map = new Map<string, Media[]>();
    for (const m of media) {
      if (!m.category_id) continue;
      if (!map.has(m.category_id)) map.set(m.category_id, []);
      map.get(m.category_id)!.push(m);
    }
    return map;
  }, [media]);

  const jumpTo = (slug: string) => {
    const el = document.getElementById(`cat-${slug}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <article className="relative px-5 md:px-16 lg:px-24 pt-24 md:pt-20 pb-16 max-w-[1400px] mx-auto">
      {/* Page header strip */}
      <div className="border-t border-rule pt-4 flex items-baseline justify-between gap-3 max-w-[40rem]">
        <span className="mono text-[0.64rem] uppercase tracking-[0.24em] text-muted">
          {t(translations.nav.photos)}
        </span>
        <span className="mono text-[0.64rem] tracking-[0.24em] tabular-nums text-muted">
          {pageNum}
        </span>
      </div>

      <header className="mt-14 md:mt-20 mb-10 md:mb-14 max-w-[52ch]">
        <motion.h1
          className="display text-[clamp(3rem,10vw,6.8rem)]"
          style={{ fontVariationSettings: axes as MotionValue<string> }}
        >
          {t(translations.photos.heading)}
        </motion.h1>
        <p className="mt-5 text-[1rem] text-ink-soft">
          {t(translations.photos.intro)}
        </p>
      </header>

      {/* Sticky category strip — secondary nav inside /photos, with
          scroll-spy on each category section. Falls below the main
          mobile top bar so the fixed headers stack cleanly. */}
      {categories.length > 0 && (
        <nav
          aria-label={t(translations.photos.categories_label)}
          className="sticky top-14 md:top-4 z-20 -mx-5 md:mx-0 px-5 md:px-0 py-3 mb-10 md:mb-14 bg-paper/92 backdrop-blur-md flex items-center gap-5 md:gap-7 overflow-x-auto border-b border-rule"
        >
          {categories.map((c, i) => {
            const active = activeSlug === c.slug;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => jumpTo(c.slug)}
                aria-current={active ? "true" : undefined}
                className={`shrink-0 inline-flex items-baseline gap-2 mono text-[0.68rem] uppercase tracking-[0.22em] min-h-11 transition-colors ${
                  active ? "text-flare" : "text-muted hover:text-ink"
                }`}
              >
                <span className="tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>{c.name}</span>
              </button>
            );
          })}
        </nav>
      )}

      {categories.map((cat, i) => {
        const catMedia = mediaByCategory.get(cat.id) ?? [];
        const count = catMedia.length;
        const reversed = i % 2 === 1;
        const tempo = tempoByIndex[i % tempoByIndex.length];
        const caption = captionByIndex[i % captionByIndex.length];
        return (
          <section
            key={cat.id}
            id={`cat-${cat.slug}`}
            className="scroll-mt-32 md:scroll-mt-28 pb-20 md:pb-28"
          >
            <div className="flex items-end justify-between gap-6 border-t border-rule pt-5 mb-8 md:mb-12">
              <div>
                <span className="mono text-[0.66rem] tracking-[0.22em] text-muted tabular-nums">
                  {String(i + 1).padStart(2, "0")} · {t(tempo)}
                </span>
                <motion.h2
                  className="display mt-3 text-[clamp(2.6rem,8vw,5.2rem)]"
                  style={{ fontVariationSettings: axes as MotionValue<string> }}
                >
                  {cat.name}
                </motion.h2>
              </div>
              <span className="mono text-[0.62rem] uppercase tracking-[0.2em] text-muted tabular-nums shrink-0">
                {count === 0
                  ? t(translations.photos.empty)
                  : count === 1
                    ? t(translations.photos.frame_count.one)
                    : t(translations.photos.frame_count.other).replace("{n}", String(count))}
              </span>
            </div>
            <p className="max-w-[44ch] text-[1rem] text-ink-soft leading-relaxed">
              {t(caption)}
            </p>
            <FramePair shots={catMedia} reversed={reversed} alt={cat.name} />
          </section>
        );
      })}

      <Pagination pageKey="photos" />
    </article>
  );
}
