"use client";

import Link from "next/link";
import { motion, useReducedMotion, type MotionValue } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import type { Category, Profile } from "@/lib/types";
import { translations } from "@/data/content";
import { useLang } from "@/context/LanguageContext";
import { useKineticAxes } from "@/lib/kinetic";

type Props = { profile: Profile; categories: Category[] };

// Cover page — kinetic type wall, typewriter name reveal, single CTA
// into /photos. The scroll-velocity → Fraunces axes morph still drives
// the display heading here; it rides through every page via
// useKineticAxes() so the signature carries across routes (not just on
// the cover). Navigation chrome (right-edge minimap on desktop, top
// bar + drawer on mobile) lives in src/components/Navigation.tsx.
//
// Scenes 02+ from the previous longscroll are now their own pages:
// /photos, /process, /contact. That reinstates the customer's full
// library — the runway onepager only showed 2 frames per category,
// which didn't work for LACOP tenants with larger galleries.

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

export default function HomeClient({ profile, categories }: Props) {
  const { t } = useLang();
  const reduced = useReducedMotion();
  const axes = useKineticAxes(reduced);

  const displayName = profile.display_name ?? profile.slug;
  const firstName = displayName.split(" ")[0];
  const lastName = displayName.split(" ").slice(1).join(" ");

  // Little rhythm strip at the bottom of the cover — echoes the
  // tenant's own category names (not hard-coded still/stride/turn).
  // If the account is empty, a short manifesto stands in.
  const hintRotator = useMemo(
    () =>
      categories.length > 0
        ? [
            ...categories.map((c) => c.name.toLowerCase()),
            t(translations.nav.process).toLowerCase(),
            t(translations.nav.contact).toLowerCase(),
          ]
        : [t(translations.cover.hint).split(".")[0].toLowerCase()],
    [categories, t],
  );

  return (
    <article className="relative min-h-[92svh] md:min-h-screen px-5 md:px-16 lg:px-24 pt-28 md:pt-32 pb-20 md:pb-28 max-w-[1400px] mx-auto flex flex-col justify-center">
      <span className="mono text-[0.66rem] tracking-[0.22em] text-muted tabular-nums uppercase">
        {t(translations.cover.eyebrow)}
      </span>
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
      <Link
        href="/photos"
        className="mono inline-block mt-10 md:mt-12 text-[0.78rem] tracking-[0.22em] uppercase hover-mark w-fit"
      >
        {t(translations.cover.invitation)} →
      </Link>
      <p className="mono mt-14 md:mt-20 text-[0.62rem] tracking-[0.22em] text-muted uppercase max-w-[36ch]">
        {t(translations.cover.hint)}
      </p>
      <span
        aria-hidden
        className="mono mt-auto pt-16 text-[0.56rem] tracking-[0.28em] text-muted uppercase"
      >
        {hintRotator.join("  ·  ")}
      </span>
    </article>
  );
}
