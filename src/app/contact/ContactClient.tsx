"use client";

import { motion, useReducedMotion, type MotionValue } from "framer-motion";
import { useState } from "react";
import type { Profile } from "@/lib/types";
import { translations } from "@/data/content";
import { useLang } from "@/context/LanguageContext";
import { useKineticAxes } from "@/lib/kinetic";
import { safeUrl } from "@/lib/utils";

type Props = { profile: Profile };

function bookingEmailFor(profile: Profile): string {
  if (profile.website_domain) {
    return `hello@${profile.website_domain.replace(/^https?:\/\//, "")}`;
  }
  return `hello@${profile.slug}.lacop.site`;
}

export default function ContactClient({ profile }: Props) {
  const { t } = useLang();
  const reduced = useReducedMotion();
  const axes = useKineticAxes(reduced);
  const [copied, setCopied] = useState(false);

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

  return (
    <article className="relative px-5 md:px-16 lg:px-24 pt-28 md:pt-32 pb-24 md:pb-40 max-w-[1400px] mx-auto">
      <span className="mono text-[0.66rem] tracking-[0.22em] text-muted tabular-nums uppercase">
        {t(translations.contact.tempo)}
      </span>
      <motion.h1
        className="display mt-5 text-[clamp(2.8rem,9vw,6.2rem)] max-w-[18ch]"
        style={{ fontVariationSettings: axes as MotionValue<string> }}
      >
        {t(translations.contact.heading)}
      </motion.h1>
      <p className="mt-6 text-[1.05rem] text-ink-soft max-w-[44ch] leading-relaxed">
        {t(translations.contact.lede)}
      </p>

      <div className="mt-12 md:mt-16">
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
    </article>
  );
}
