"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { copy } from "@/data/copy";
import { useKineticAxes } from "@/lib/kinetic";
import type { Category, Media, Profile } from "@/lib/types";

// Four-route home. Hero uses hero_image_url with the standard LACOP
// fallback chain (hero_image_url || media[0]?.url || profile_image_url).
// Kinetic display axes stay — they're the site's signature — but
// applied to the section headings rather than as the hero itself.

type Props = {
  profile: Profile;
  categories: Category[];
  media: Media[];
};

export default function HomeClient({ profile, categories, media }: Props) {
  const reduced = useReducedMotion();
  const axes = useKineticAxes(reduced ?? null);
  const displayName = profile.display_name ?? profile.slug;
  const [firstName, ...rest] = displayName.split(" ");
  const lastName = rest.join(" ");

  const heroSrc =
    profile.hero_image_url || media[0]?.url || profile.profile_image_url;

  const stats = profile.stats ?? {};
  const hasStats = Object.keys(stats).length > 0;
  const hasBio = Boolean(profile.bio);

  return (
    <>
      {/* HERO */}
      <section className="relative px-5 md:px-10 lg:px-16 pt-8 md:pt-14 pb-14 md:pb-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 items-end">
          <div className="md:col-span-5 order-2 md:order-1">
            <p className="mono text-[0.66rem] uppercase tracking-[0.28em] text-flare mb-4">
              {profile.role} · {copy.nav.home}
            </p>
            <motion.h1
              className="display text-[clamp(3.2rem,14vw,9rem)] text-ink"
              style={{ fontVariationSettings: axes }}
            >
              <span className="block">{firstName}</span>
              {lastName && <span className="block text-flare">{lastName}</span>}
            </motion.h1>
            <p className="font-serif italic text-lg md:text-xl text-ink-soft mt-6 max-w-md">
              {profile.bio ?? copy.home.tagline_fallback}
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link
                href="/portfolio"
                className="inline-flex items-center gap-3 mono text-[0.68rem] uppercase tracking-[0.24em] text-paper bg-flare px-6 py-3 hover:bg-flare-soft transition-colors"
              >
                {copy.home.categories_cta} →
              </Link>
              <Link
                href="/contact"
                className="hover-mark mono text-[0.68rem] uppercase tracking-[0.24em] text-ink-soft hover:text-flare"
              >
                {copy.nav.contact}
              </Link>
            </div>
          </div>

          {/* Hero image */}
          {heroSrc && (
            <motion.div
              initial={reduced ? false : { opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="md:col-span-7 order-1 md:order-2 relative"
            >
              <div className="relative aspect-[4/5] md:aspect-[3/4] overflow-hidden bg-shade grain">
                <Image
                  src={heroSrc}
                  alt={displayName}
                  fill
                  priority
                  sizes="(min-width: 768px) 55vw, 100vw"
                  className="object-cover"
                />
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* CATEGORIES */}
      {categories.length > 0 && (
        <section className="px-5 md:px-10 lg:px-16 py-14 md:py-20 border-t border-rule">
          <div className="flex items-end justify-between gap-6 mb-8 md:mb-12">
            <div>
              <p className="mono text-[0.62rem] uppercase tracking-[0.28em] text-flare mb-3">
                {copy.home.categories_eyebrow}
              </p>
              <motion.h2
                className="display text-[clamp(2rem,6vw,3.6rem)] text-ink"
                style={{ fontVariationSettings: axes }}
              >
                {copy.portfolio.title}
              </motion.h2>
            </div>
            <Link
              href="/portfolio"
              className="hover-mark hidden sm:inline mono text-[0.66rem] uppercase tracking-[0.24em] text-flare"
            >
              {copy.home.categories_cta} →
            </Link>
          </div>

          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {categories.map((cat, i) => {
              const cover =
                cat.cover_image_url ||
                media.find((m) => m.category_id === cat.id)?.url;
              return (
                <motion.li
                  key={cat.id}
                  initial={reduced ? false : { opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-10% 0px" }}
                  transition={{ duration: 0.7, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    href={`/portfolio?category=${cat.slug}`}
                    className="group block"
                  >
                    <div className="relative aspect-[3/4] overflow-hidden bg-shade grain">
                      {cover && (
                        <Image
                          src={cover}
                          alt={cat.name}
                          fill
                          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-paper/80 via-paper/0 to-paper/0" />
                      <div className="absolute inset-x-0 bottom-0 p-5 md:p-6 flex items-baseline justify-between gap-3">
                        <span className="display text-[1.6rem] md:text-[2rem] tracking-[-0.02em] text-ink">
                          {cat.name}
                        </span>
                        <span className="mono text-[0.6rem] uppercase tracking-[0.24em] text-flare opacity-0 group-hover:opacity-100 transition-opacity">
                          öffnen →
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.li>
              );
            })}
          </ul>
        </section>
      )}

      {/* STATS + BIO teaser */}
      <section className="px-5 md:px-10 lg:px-16 py-14 md:py-20 border-t border-rule bg-shade/40">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-5">
            <p className="mono text-[0.62rem] uppercase tracking-[0.28em] text-flare mb-4">
              {copy.home.stats_eyebrow}
            </p>
            {hasStats ? (
              <dl className="grid grid-cols-2 gap-x-6 gap-y-6">
                {Object.entries(stats).map(([key, value]) => (
                  <div key={key} className="border-t border-rule pt-3">
                    <dt className="mono text-[0.6rem] uppercase tracking-[0.22em] text-muted mb-1">
                      {key}
                    </dt>
                    <dd className="font-serif text-xl md:text-2xl text-ink">{value}</dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p className="font-serif italic text-lg text-muted">{copy.home.stats_empty}</p>
            )}
          </div>

          <div className="md:col-span-6 md:col-start-7">
            <p className="mono text-[0.62rem] uppercase tracking-[0.28em] text-flare mb-4">
              {copy.home.about_eyebrow}
            </p>
            <p className={`font-serif text-base md:text-lg leading-relaxed ${hasBio ? "text-ink-soft" : "italic text-muted"}`}>
              {profile.bio ?? copy.home.about_empty}
            </p>
            <Link
              href="/about"
              className="hover-mark inline-block mt-8 mono text-[0.66rem] uppercase tracking-[0.24em] text-flare"
            >
              {copy.home.about_more} →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
