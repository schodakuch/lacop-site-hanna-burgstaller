"use client";

import Image from "next/image";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { useCallback, useMemo } from "react";
import { copy } from "@/data/copy";
import { useKineticAxes } from "@/lib/kinetic";
import type { Category, Media } from "@/lib/types";

type Props = {
  categories: Category[];
  media: Media[];
};

// Filterable portfolio grid. The active category is read from the URL
// search param `?category=<slug>` so home-page category cards can
// deep-link into the filter. "Alle" is the empty-param state.
export default function PortfolioClient({ categories, media }: Props) {
  const reduced = useReducedMotion();
  const axes = useKineticAxes(reduced ?? null);
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const active = params.get("category") ?? "";

  const setActive = useCallback(
    (slug: string) => {
      const url = slug ? `${pathname}?category=${slug}` : pathname;
      router.replace(url, { scroll: false });
    },
    [pathname, router],
  );

  const visible = useMemo(() => {
    if (!active) return media;
    const cat = categories.find((c) => c.slug === active);
    if (!cat) return media;
    return media.filter((m) => m.category_id === cat.id);
  }, [active, categories, media]);

  return (
    <>
      <section className="px-5 md:px-10 lg:px-16 pt-10 md:pt-16 pb-6 md:pb-10">
        <p className="mono text-[0.62rem] uppercase tracking-[0.28em] text-flare mb-3">
          {copy.portfolio.eyebrow}
        </p>
        <motion.h1
          className="display text-[clamp(3rem,12vw,8rem)] text-ink"
          style={{ fontVariationSettings: axes }}
        >
          {copy.portfolio.title}
        </motion.h1>

        {/* Filter pills */}
        <div
          role="tablist"
          aria-label={copy.portfolio.title}
          className="mt-10 flex flex-wrap gap-x-6 gap-y-3 border-t border-rule pt-5"
        >
          <FilterPill
            active={!active}
            onClick={() => setActive("")}
            label={copy.portfolio.filter_all}
          />
          {categories.map((cat) => (
            <FilterPill
              key={cat.slug}
              active={active === cat.slug}
              onClick={() => setActive(cat.slug)}
              label={cat.name}
            />
          ))}
        </div>
      </section>

      <section className="px-5 md:px-10 lg:px-16 pb-20 md:pb-28">
        {visible.length === 0 ? (
          <p className="mono text-[0.7rem] uppercase tracking-[0.28em] text-muted py-20 text-center">
            {copy.portfolio.empty}
          </p>
        ) : (
          <motion.ul
            layout
            className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5"
          >
            {visible.map((item, i) => (
              <motion.li
                key={item.id}
                layout
                initial={reduced ? false : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: (i % 6) * 0.05, ease: [0.16, 1, 0.3, 1] }}
                className="group"
              >
                <figure>
                  <div
                    className="relative overflow-hidden bg-shade grain"
                    style={{
                      aspectRatio: `${item.width ?? 3} / ${item.height ?? 4}`,
                    }}
                  >
                    <Image
                      src={item.url}
                      alt={item.title ?? ""}
                      fill
                      sizes="(min-width: 1024px) 33vw, 50vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                  </div>
                  {(item.title || item.photographer_credit) && (
                    <figcaption className="mt-2 flex items-baseline justify-between gap-3">
                      <span className="mono text-[0.6rem] uppercase tracking-[0.24em] text-muted">
                        {item.title ?? ""}
                      </span>
                      {item.photographer_credit && (
                        <span className="mono text-[0.58rem] uppercase tracking-[0.22em] text-muted/80">
                          © {item.photographer_credit}
                        </span>
                      )}
                    </figcaption>
                  )}
                </figure>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </section>
    </>
  );
}

function FilterPill({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`mono text-[0.68rem] uppercase tracking-[0.24em] transition-colors ${
        active ? "text-flare" : "text-ink-soft hover:text-ink"
      }`}
    >
      {label}
    </button>
  );
}
