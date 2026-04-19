"use client";

import { motion, useReducedMotion, type MotionValue } from "framer-motion";
import { useState } from "react";
import type { Profile } from "@/lib/types";
import { translations } from "@/data/content";
import { useLang } from "@/context/LanguageContext";
import { useKineticAxes } from "@/lib/kinetic";
import { usePages } from "@/hooks/usePages";
import Pagination from "@/components/Pagination";

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
  const pages = usePages();
  const pageNum = pages.find((p) => p.key === "contact")?.n ?? "—";
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
    <article className="px-5 md:px-16 lg:px-24 pt-24 md:pt-20 pb-16 md:pb-32 max-w-[1400px] mx-auto">
      {/* Page header strip */}
      <div className="border-t border-rule pt-4 flex items-baseline justify-between gap-3 max-w-[40rem]">
        <span className="mono text-[0.64rem] uppercase tracking-[0.24em] text-muted">
          {t(translations.nav.contact)}
        </span>
        <span className="mono text-[0.64rem] tracking-[0.24em] tabular-nums text-muted">
          {pageNum}
        </span>
      </div>

      <header className="mt-14 md:mt-20 mb-10 md:mb-14">
        <span className="mono text-[0.66rem] tracking-[0.22em] text-muted tabular-nums">
          {pageNum} · {t(translations.contact.tempo)}
        </span>
        <motion.h1
          className="display mt-3 text-[clamp(3rem,10vw,6.8rem)]"
          style={{ fontVariationSettings: axes as MotionValue<string> }}
        >
          {t(translations.contact.heading)}
        </motion.h1>
      </header>

      <p className="text-[1.08rem] text-ink-soft max-w-[44ch] leading-relaxed">
        {t(translations.contact.lede)}
      </p>

      <div className="mt-10 md:mt-14">
        <button
          type="button"
          onClick={copyEmail}
          className="display block text-left text-[clamp(1.6rem,5vw,3rem)] tracking-[-0.02em] hover:text-flare transition-colors"
          aria-label={t(translations.contact.copy_hint)}
        >
          {bookingEmail}
        </button>
        <span className="mono mt-3 block text-[0.68rem] tracking-[0.22em] text-muted uppercase">
          {copied ? t(translations.contact.copied) : t(translations.contact.copy_hint)}
        </span>
        <p className="mono mt-10 text-[0.64rem] tracking-[0.2em] text-muted max-w-[48ch]">
          {t(translations.contact.placeholder_note)}
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

      <Pagination pageKey="contact" />
    </article>
  );
}
