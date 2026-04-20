"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { copy } from "@/data/copy";
import { useKineticAxes } from "@/lib/kinetic";
import { safeUrl } from "@/lib/utils";
import type { Profile } from "@/lib/types";

type Props = { profile: Profile };

export default function AboutClient({ profile }: Props) {
  const reduced = useReducedMotion();
  const axes = useKineticAxes(reduced ?? null);
  const displayName = profile.display_name ?? profile.slug;
  const portraitSrc = profile.profile_image_url ?? profile.hero_image_url;

  const stats = profile.stats ?? {};
  const hasStats = Object.keys(stats).length > 0;
  const agencies = profile.agencies ?? [];
  const links = profile.custom_links ?? [];

  return (
    <>
      {/* Header */}
      <section className="px-5 md:px-10 lg:px-16 pt-10 md:pt-16 pb-8 md:pb-12">
        <p className="mono text-[0.62rem] uppercase tracking-[0.28em] text-flare mb-3">
          {copy.about.eyebrow}
        </p>
        <motion.h1
          className="display text-[clamp(3rem,12vw,8rem)] text-ink"
          style={{ fontVariationSettings: axes }}
        >
          {copy.about.title}
        </motion.h1>
      </section>

      {/* Portrait + Bio */}
      <section className="px-5 md:px-10 lg:px-16 py-10 md:py-16 border-t border-rule">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="md:col-span-5"
          >
            <div className="relative aspect-[3/4] overflow-hidden bg-shade grain max-w-md mx-auto md:mx-0">
              {portraitSrc && (
                <Image
                  src={portraitSrc}
                  alt={displayName}
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover"
                />
              )}
            </div>
          </motion.div>

          <div className="md:col-span-7">
            <p className="mono text-[0.62rem] uppercase tracking-[0.28em] text-flare mb-4">
              {copy.about.bio_heading}
            </p>
            <p
              className={`font-serif text-lg md:text-xl leading-relaxed ${
                profile.bio ? "text-ink-soft" : "italic text-muted"
              }`}
            >
              {profile.bio ?? copy.about.bio_empty}
            </p>
            {profile.about && (
              <p className="mt-6 font-serif text-base md:text-lg text-ink-soft leading-relaxed whitespace-pre-line">
                {profile.about}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="px-5 md:px-10 lg:px-16 py-12 md:py-16 border-t border-rule bg-shade/40">
        <p className="mono text-[0.62rem] uppercase tracking-[0.28em] text-flare mb-6 md:mb-8">
          {copy.about.stats_heading}
        </p>
        {hasStats ? (
          <dl className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-6 gap-y-8">
            {Object.entries(stats).map(([key, value]) => (
              <div key={key} className="border-t border-rule pt-3">
                <dt className="mono text-[0.6rem] uppercase tracking-[0.24em] text-muted mb-2">
                  {key}
                </dt>
                <dd className="font-serif text-xl md:text-2xl lg:text-3xl text-ink">{value}</dd>
              </div>
            ))}
          </dl>
        ) : (
          <p className="font-serif italic text-lg text-muted">{copy.about.stats_empty}</p>
        )}
      </section>

      {/* Agencies + Custom links */}
      {(agencies.length > 0 || links.length > 0) && (
        <section className="px-5 md:px-10 lg:px-16 py-12 md:py-16 border-t border-rule">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
            {agencies.length > 0 && (
              <div className="md:col-span-6">
                <p className="mono text-[0.62rem] uppercase tracking-[0.28em] text-flare mb-4">
                  {copy.about.agencies_heading}
                </p>
                <ul className="space-y-3">
                  {agencies.map((a) => {
                    const url = a.url ? safeUrl(a.url) : null;
                    return (
                      <li key={a.name} className="border-t border-rule pt-3">
                        {url ? (
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover-mark font-serif text-lg text-ink"
                          >
                            {a.name}
                          </a>
                        ) : (
                          <span className="font-serif text-lg text-ink">{a.name}</span>
                        )}
                        {a.city && (
                          <span className="ml-3 mono text-[0.62rem] uppercase tracking-[0.24em] text-muted">
                            {a.city}
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {links.length > 0 && (
              <div className="md:col-span-6">
                <p className="mono text-[0.62rem] uppercase tracking-[0.28em] text-flare mb-4">
                  {copy.about.links_heading}
                </p>
                <ul className="space-y-3">
                  {links.map((l) => {
                    const url = safeUrl(l.url);
                    if (!url) return null;
                    return (
                      <li key={l.label} className="border-t border-rule pt-3">
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover-mark font-serif text-lg text-ink"
                        >
                          {l.label}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}
    </>
  );
}
