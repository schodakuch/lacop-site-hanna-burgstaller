"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useLang } from "@/context/LanguageContext";
import { useProfile } from "@/context/ProfileContext";
import { translations } from "@/data/content";
import { buildRoutes, type RouteEntry } from "@/lib/routes";

// Right-edge route minimap — always-visible labels with `NN  LABEL  •`
// rows, active state driven by `usePathname()`. Desktop chrome is the
// minimap + a corner brand pill; mobile chrome is a thin top bar +
// "Jump to ▾" drawer. No top bar on desktop (that's the divergence
// from carina/lea, which either use a left side rail or a top bar).

export default function Navigation() {
  const { lang, toggle, t } = useLang();
  const profile = useProfile();
  const pathname = usePathname();
  const [drawer, setDrawer] = useState(false);

  const displayName = profile.display_name ?? profile.slug;
  const firstName = displayName.split(" ")[0];
  const lastName = displayName.split(" ").slice(1).join(" ");

  const routes: RouteEntry[] = useMemo(
    () =>
      buildRoutes({
        home: translations.nav.home,
        photos: translations.nav.photos,
        process: translations.nav.process,
        contact: translations.nav.contact,
      }),
    [],
  );

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  // Close the mobile drawer whenever the route changes.
  useEffect(() => setDrawer(false), [pathname]);

  useEffect(() => {
    if (!drawer) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDrawer(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [drawer]);

  const currentRoute = routes.find((r) => isActive(r.href));

  return (
    <>
      {/* ───── Desktop brand pill (top-left corner) ───── */}
      <Link
        href="/"
        aria-label={displayName}
        className="hidden md:block fixed top-7 left-10 z-40 leading-tight"
      >
        <span className="mono text-[0.58rem] tracking-[0.28em] uppercase text-muted">
          {profile.role}
        </span>
        <span className="block text-[1.02rem] mt-1">
          <span className="font-medium">{firstName}</span>
          {lastName && <> <span className="text-ink-soft">{lastName}</span></>}
        </span>
      </Link>

      {/* ───── Desktop route minimap (right edge) ───── */}
      <nav
        aria-label="Pages"
        className="hidden md:flex fixed top-1/2 right-4 lg:right-6 z-40 -translate-y-1/2 flex-col items-stretch gap-0 w-[200px] max-h-[80vh] overflow-y-auto border-l border-rule pl-4"
      >
        {routes.map((r, i) => {
          const active = isActive(r.href);
          const n = String(i + 1).padStart(2, "0");
          return (
            <Link
              key={r.key}
              href={r.href}
              aria-current={active ? "page" : undefined}
              className="group grid grid-cols-[auto_1fr_auto] items-center gap-3 min-h-11 py-1 text-left"
            >
              <span
                aria-hidden
                className={`mono text-[0.6rem] tracking-[0.22em] tabular-nums transition-colors ${
                  active ? "text-flare" : "text-muted group-hover:text-ink"
                }`}
              >
                {n}
              </span>
              <span
                className={`mono text-[0.62rem] tracking-[0.22em] uppercase truncate transition-colors ${
                  active ? "text-flare" : "text-ink-soft group-hover:text-ink"
                }`}
              >
                {t(r.label)}
              </span>
              <span
                aria-hidden
                className={`block rounded-full transition-all ${
                  active
                    ? "w-[10px] h-[10px] bg-flare"
                    : "w-[6px] h-[6px] bg-rule group-hover:bg-ink-soft"
                }`}
              />
            </Link>
          );
        })}
        <button
          type="button"
          onClick={toggle}
          aria-label="Toggle language"
          className="mono self-start mt-3 pt-3 border-t border-rule text-[0.62rem] uppercase tracking-[0.24em] text-ink-soft hover:text-flare transition-colors"
        >
          {lang === "en" ? "DE" : "EN"}
        </button>
      </nav>

      {/* ───── Mobile top bar + drawer ───── */}
      <div
        className="md:hidden fixed top-0 inset-x-0 z-50 bg-paper/92 backdrop-blur-md border-b border-rule"
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        <div className="h-14 px-5 flex items-center justify-between gap-3">
          <Link
            href="/"
            className="flex items-baseline gap-2 min-w-0"
            aria-label={displayName}
          >
            <span className="text-[0.98rem] font-medium truncate">{firstName}</span>
            {lastName && (
              <span className="text-[0.9rem] text-ink-soft truncate">{lastName}</span>
            )}
          </Link>
          <div className="flex items-center gap-1">
            {currentRoute && (
              <span
                className="mono text-[0.58rem] tracking-[0.22em] uppercase text-muted pr-3 border-r border-rule mr-1"
                aria-hidden
              >
                {t(currentRoute.label)}
              </span>
            )}
            <button
              type="button"
              onClick={toggle}
              className="mono text-[0.64rem] uppercase tracking-[0.22em] text-ink-soft min-h-11 min-w-11 px-2 flex items-center justify-center"
              aria-label="Toggle language"
            >
              {lang === "en" ? "DE" : "EN"}
            </button>
            <button
              type="button"
              onClick={() => setDrawer((v) => !v)}
              aria-expanded={drawer}
              aria-controls="page-drawer"
              className="mono text-[0.64rem] uppercase tracking-[0.22em] text-ink min-h-11 min-w-11 px-2 flex items-center justify-center -mr-2"
            >
              {drawer ? t(translations.nav.close) : `${t(translations.nav.jump_to)} ▾`}
            </button>
          </div>
        </div>
        <div
          id="page-drawer"
          className={`transition-[max-height,opacity] duration-300 ${
            drawer
              ? "max-h-[calc(100vh-3.5rem)] opacity-100 border-t border-rule overflow-y-auto"
              : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          <ol className="px-5 py-6 divide-y divide-rule">
            {routes.map((r, i) => {
              const active = isActive(r.href);
              const n = String(i + 1).padStart(2, "0");
              return (
                <li key={r.key}>
                  <Link
                    href={r.href}
                    aria-current={active ? "page" : undefined}
                    className={`w-full flex items-baseline gap-5 py-4 min-h-14 text-left ${
                      active ? "text-flare" : "text-ink"
                    }`}
                  >
                    <span
                      className={`mono text-[0.66rem] tracking-[0.22em] tabular-nums w-8 shrink-0 ${
                        active ? "text-flare" : "text-muted"
                      }`}
                    >
                      {n}
                    </span>
                    <span className="text-[1.25rem] tracking-[-0.01em] font-light">
                      {t(r.label)}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </>
  );
}
