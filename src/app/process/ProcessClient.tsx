"use client";

import { motion, useReducedMotion, type MotionValue } from "framer-motion";
import type { Profile } from "@/lib/types";
import { translations } from "@/data/content";
import { useLang } from "@/context/LanguageContext";
import { useKineticAxes } from "@/lib/kinetic";

type Props = { profile: Profile };

// Working-diary voice — a process page, not a CV. Bio/stats/agencies
// stay empty-state when the LACOP profile doesn't carry them (stats is
// currently not user-editable per LACOP-DATA-SHAPE.md § 2.3, so this
// page should always render cleanly on sparse profiles).

export default function ProcessClient({ profile }: Props) {
  const { t } = useLang();
  const reduced = useReducedMotion();
  const axes = useKineticAxes(reduced);

  return (
    <article className="relative px-5 md:px-16 lg:px-24 pt-28 md:pt-32 pb-20 md:pb-28 max-w-[1400px] mx-auto">
      <span className="mono text-[0.66rem] tracking-[0.22em] text-muted tabular-nums uppercase">
        {t(translations.process.tempo)}
      </span>
      <motion.h1
        className="display mt-5 text-[clamp(3rem,10vw,7rem)] max-w-[16ch]"
        style={{ fontVariationSettings: axes as MotionValue<string> }}
      >
        {t(translations.process.heading)}
      </motion.h1>
      <div className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-12 gap-10">
        <p className="md:col-span-7 text-[1.08rem] leading-relaxed max-w-[56ch]">
          {profile.about ?? t(translations.process.body)}
        </p>
        <aside className="md:col-span-4 md:col-start-9 mono text-[0.7rem] tracking-[0.18em] text-muted space-y-2 self-start">
          {Object.keys(profile.stats).length === 0 && (
            <p>— {t(translations.process.stats_empty)}</p>
          )}
          {Object.keys(profile.stats).length > 0 && (
            <ul className="space-y-1">
              {Object.entries(profile.stats).map(([k, v]) => (
                <li key={k} className="flex items-baseline gap-3">
                  <span className="shrink-0 text-muted uppercase">{k}</span>
                  <span className="text-ink-soft">{String(v)}</span>
                </li>
              ))}
            </ul>
          )}
          {profile.agencies.length === 0 && (
            <p>— {t(translations.process.agencies_empty)}</p>
          )}
          {profile.agencies.length > 0 && (
            <ul className="space-y-1 pt-3 border-t border-rule">
              {profile.agencies.map((a) => (
                <li key={`${a.name}-${a.city ?? ""}`} className="text-ink-soft">
                  {a.name}
                  {a.city && <span className="text-muted"> · {a.city}</span>}
                </li>
              ))}
            </ul>
          )}
          {profile.about === null && (
            <p className="pt-3 border-t border-rule">
              {t(translations.process.placeholder_note)}
            </p>
          )}
        </aside>
      </div>
    </article>
  );
}
