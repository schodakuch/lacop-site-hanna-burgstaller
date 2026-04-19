"use client";

import Link from "next/link";
import { motion, useReducedMotion, type MotionValue } from "framer-motion";
import { useEffect, useState } from "react";
import type { Profile } from "@/lib/types";
import { translations } from "@/data/content";
import { useLang } from "@/context/LanguageContext";
import { useKineticAxes } from "@/lib/kinetic";
import Pagination from "@/components/Pagination";
import { usePages } from "@/hooks/usePages";

type Props = { profile: Profile };

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
        <span
          className="inline-block w-[0.08em] -mb-[0.05em] align-baseline bg-flare animate-pulse"
          style={{ height: "0.82em" }}
        />
      )}
    </>
  );
}

export default function HomeClient({ profile }: Props) {
  const { t } = useLang();
  const reduced = useReducedMotion();
  const axes = useKineticAxes(reduced);
  const pages = usePages();
  const pageNum = pages.find((p) => p.key === "cover")?.n ?? "01";

  const displayName = profile.display_name ?? profile.slug;
  const firstName = displayName.split(" ")[0];
  const lastName = displayName.split(" ").slice(1).join(" ");

  return (
    <article className="relative overflow-hidden px-5 md:px-16 lg:px-24 pt-24 md:pt-24 pb-16 md:pb-24 max-w-[1400px] mx-auto">
      {/* Page header strip — page number + section label */}
      <div className="border-t border-rule pt-4 flex items-baseline justify-between gap-3 max-w-[40rem]">
        <span className="mono text-[0.64rem] uppercase tracking-[0.24em] text-muted">
          {t(translations.nav.cover)}
        </span>
        <span className="mono text-[0.64rem] tracking-[0.24em] tabular-nums text-muted">
          {pageNum}
        </span>
      </div>

      <div className="min-h-[70svh] md:min-h-[78svh] flex items-center">
        <div className="relative z-10 max-w-[16ch] py-12">
          <span className="mono text-[0.7rem] tracking-[0.24em] text-muted uppercase">
            {t(translations.cover.eyebrow)}
          </span>
          <motion.h1
            className="display mt-6 text-[clamp(3.2rem,13vw,9.4rem)]"
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
          <p className="mt-8 max-w-[30ch] text-[1.05rem] leading-relaxed text-ink-soft">
            {profile.bio ?? t(translations.cover.subtitle)}
          </p>
          <Link
            href="/photos"
            className="mono inline-block mt-10 text-[0.8rem] tracking-[0.2em] uppercase hover-mark"
          >
            {t(translations.cover.invitation)} →
          </Link>
          <p className="mono mt-8 text-[0.62rem] tracking-[0.22em] text-muted uppercase max-w-[36ch]">
            {t(translations.cover.hint)}
          </p>
        </div>
      </div>

      <Pagination pageKey="cover" />
    </article>
  );
}
