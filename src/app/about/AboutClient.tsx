"use client";

import { motion, useReducedMotion, type MotionValue } from "framer-motion";
import type { Profile } from "@/lib/types";
import { translations } from "@/data/content";
import { useLang } from "@/context/LanguageContext";
import { useKineticAxes } from "@/lib/kinetic";
import { usePages } from "@/hooks/usePages";
import Pagination from "@/components/Pagination";

type Props = { profile: Profile };

export default function AboutClient({ profile }: Props) {
  const { t } = useLang();
  const reduced = useReducedMotion();
  const axes = useKineticAxes(reduced);
  const pages = usePages();
  const pageNum = pages.find((p) => p.key === "about")?.n ?? "—";

  return (
    <article className="px-5 md:px-16 lg:px-24 pt-24 md:pt-20 pb-16 md:pb-24 max-w-[1400px] mx-auto">
      {/* Page header strip */}
      <div className="border-t border-rule pt-4 flex items-baseline justify-between gap-3 max-w-[40rem]">
        <span className="mono text-[0.64rem] uppercase tracking-[0.24em] text-muted">
          {t(translations.nav.about)}
        </span>
        <span className="mono text-[0.64rem] tracking-[0.24em] tabular-nums text-muted">
          {pageNum}
        </span>
      </div>

      <header className="mt-14 md:mt-20 mb-12 md:mb-16">
        <span className="mono text-[0.66rem] tracking-[0.22em] text-muted tabular-nums">
          {pageNum} · {t(translations.about.tempo)}
        </span>
        <motion.h1
          className="display mt-3 text-[clamp(3rem,10vw,6.8rem)]"
          style={{ fontVariationSettings: axes as MotionValue<string> }}
        >
          {t(translations.about.heading)}
        </motion.h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
        <p className="md:col-span-7 text-[1.08rem] leading-relaxed max-w-[56ch]">
          {profile.about ?? t(translations.about.body)}
        </p>
        <aside className="md:col-span-4 md:col-start-9 mono text-[0.7rem] tracking-[0.18em] text-muted space-y-2 self-start">
          {Object.keys(profile.stats).length === 0 && (
            <p>— {t(translations.about.stats_empty)}</p>
          )}
          {profile.agencies.length === 0 && (
            <p>— {t(translations.about.agencies_empty)}</p>
          )}
          {profile.about === null && (
            <p className="pt-3 border-t border-rule">
              {t(translations.about.placeholder_note)}
            </p>
          )}
        </aside>
      </div>

      <Pagination pageKey="about" />
    </article>
  );
}
