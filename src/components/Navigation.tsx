"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useProfile } from "@/context/ProfileContext";
import { copy } from "@/data/copy";

// Classic four-route top bar, skinned in the site's kinetic / dark-ground
// idiom (mono eyebrows, acid chartreuse active state, grain-friendly
// translucent paper). The right-edge minimap from the previous longscroll
// build doesn't fit a multi-route IA — swapped for a conventional
// desktop bar + mobile drawer so the site behaves like every other
// LACOP portfolio (chiara-ebner pattern).

const ROUTES = [
  { href: "/", key: "home", label: copy.nav.home },
  { href: "/portfolio", key: "portfolio", label: copy.nav.portfolio },
  { href: "/about", key: "about", label: copy.nav.about },
  { href: "/contact", key: "contact", label: copy.nav.contact },
] as const;

export default function Navigation() {
  const profile = useProfile();
  const pathname = usePathname();
  const [drawer, setDrawer] = useState(false);

  const displayName = profile.display_name ?? profile.slug;
  const firstName = displayName.split(" ")[0];
  const lastName = displayName.split(" ").slice(1).join(" ");

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

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

  return (
    <header
      className="sticky top-0 z-50 bg-paper/92 backdrop-blur-md border-b border-rule"
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <div className="h-14 md:h-16 px-5 md:px-10 lg:px-16 flex items-center justify-between gap-6">
        <Link href="/" className="flex items-baseline gap-2 min-w-0" aria-label={displayName}>
          <span className="mono text-[0.58rem] uppercase tracking-[0.28em] text-muted hidden sm:inline">
            {profile.role}
          </span>
          <span className="hidden sm:inline text-muted/60">·</span>
          <span className="text-[0.98rem] md:text-[1.02rem] font-medium truncate">{firstName}</span>
          {lastName && (
            <span className="text-[0.9rem] md:text-[0.96rem] text-ink-soft truncate">{lastName}</span>
          )}
        </Link>

        {/* Desktop routes */}
        <nav aria-label="Hauptnavigation" className="hidden md:flex items-center gap-7">
          {ROUTES.map((r) => {
            const active = isActive(r.href);
            return (
              <Link
                key={r.key}
                href={r.href}
                aria-current={active ? "page" : undefined}
                className={`text-[0.95rem] tracking-[-0.01em] transition-colors ${
                  active ? "text-flare font-medium" : "text-ink-soft hover:text-ink"
                }`}
              >
                {r.label}
              </Link>
            );
          })}
        </nav>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setDrawer((v) => !v)}
          aria-expanded={drawer}
          aria-controls="nav-drawer"
          className="md:hidden text-[0.95rem] font-medium tracking-[-0.01em] text-ink min-h-11 min-w-11 px-2 flex items-center justify-center -mr-2"
        >
          {drawer ? copy.nav.close : copy.nav.menu}
        </button>
      </div>

      {/* Mobile drawer */}
      <div
        id="nav-drawer"
        className={`md:hidden transition-[max-height,opacity] duration-300 ${
          drawer
            ? "max-h-[calc(100vh-3.5rem)] opacity-100 border-t border-rule overflow-y-auto"
            : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <ol className="px-5 py-6 divide-y divide-rule">
          {ROUTES.map((r, i) => {
            const active = isActive(r.href);
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
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[1.25rem] tracking-[-0.01em] font-light">{r.label}</span>
                </Link>
              </li>
            );
          })}
        </ol>
      </div>
    </header>
  );
}
