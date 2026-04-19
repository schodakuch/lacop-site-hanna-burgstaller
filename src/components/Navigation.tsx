"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useLang } from "@/context/LanguageContext";
import { useProfile } from "@/context/ProfileContext";
import { translations } from "@/data/content";
import { usePages } from "@/hooks/usePages";

// Multi-page navigation. Mobile: top bar + a large-text drawer with
// labels and page numbers (not just dots — visitors need to know which
// page each tap leads to). Desktop: right-edge minimap listing all four
// pages with their numbers and labels, persistent. The right-rail is
// the signature desktop chrome; the mobile drawer is the primary nav
// paradigm on touch.

export default function Navigation() {
  const { lang, toggle, t } = useLang();
  const profile = useProfile();
  const pages = usePages();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const displayName = profile.display_name ?? profile.slug;
  const firstName = displayName.split(" ")[0];
  const lastName = displayName.split(" ").slice(1).join(" ");

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const currentPage = pages.find((p) => isActive(p.href));

  return (
    <>
      {/* Mobile top bar — always visible. Brand left, page marker +
          language toggle + menu button right. min-h-14 gives steady
          clearance so cover content never slides under it. */}
      <header className="md:hidden fixed top-0 inset-x-0 z-50 bg-paper/92 backdrop-blur-md border-b border-rule">
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
            {currentPage && (
              <span
                className="mono text-[0.62rem] tracking-[0.22em] tabular-nums text-muted pr-3 border-r border-rule mr-1"
                aria-hidden
              >
                {currentPage.n}
              </span>
            )}
            <button
              type="button"
              onClick={toggle}
              className="mono text-[0.66rem] uppercase tracking-[0.22em] text-ink-soft min-h-11 min-w-11 px-2 flex items-center justify-center"
              aria-label="Toggle language"
            >
              {lang === "en" ? "DE" : "EN"}
            </button>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              className="mono text-[0.66rem] uppercase tracking-[0.22em] text-ink min-h-11 min-w-11 px-2 flex items-center justify-center -mr-2"
            >
              {open ? t(translations.nav.close) : t(translations.nav.menu)}
            </button>
          </div>
        </div>

        {/* Drawer — drops down from the bar. Large tap targets, numbered
            labels, active page in flare. */}
        <div
          id="mobile-menu"
          className={`transition-[max-height,opacity] duration-300 ${
            open
              ? "max-h-[calc(100vh-3.5rem)] opacity-100 border-t border-rule overflow-y-auto"
              : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          <ol className="px-5 py-6 divide-y divide-rule">
            {pages.map((p) => {
              const active = isActive(p.href);
              return (
                <li key={p.key}>
                  <Link
                    href={p.href}
                    className={`flex items-baseline gap-5 py-4 min-h-14 ${
                      active ? "text-flare" : "text-ink"
                    }`}
                    aria-current={active ? "page" : undefined}
                  >
                    <span
                      className={`mono text-[0.7rem] tracking-[0.22em] tabular-nums w-8 shrink-0 ${
                        active ? "text-flare" : "text-muted"
                      }`}
                    >
                      {p.n}
                    </span>
                    <span className="text-[1.35rem] tracking-[-0.01em] font-light">
                      {p.label}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ol>
        </div>
      </header>

      {/* Desktop — corner brand top-left + right-edge minimap */}
      <Link
        href="/"
        aria-label={displayName}
        className="hidden md:block fixed top-7 left-10 z-40 leading-tight"
      >
        <span className="mono text-[0.6rem] tracking-[0.24em] uppercase text-muted">
          {profile.role}
        </span>
        <span className="block text-[1.05rem] mt-1">
          <span className="font-medium">{firstName}</span>{" "}
          {lastName && <span className="text-ink-soft">{lastName}</span>}
        </span>
      </Link>

      <nav
        aria-label="Pages"
        className="hidden md:flex fixed top-1/2 right-6 lg:right-10 z-40 -translate-y-1/2 flex-col items-end gap-3"
      >
        {pages.map((p) => {
          const active = isActive(p.href);
          return (
            <Link
              key={p.key}
              href={p.href}
              className="group flex items-center gap-3 py-1"
              aria-label={`${p.n} — ${p.label}`}
              aria-current={active ? "page" : undefined}
            >
              <span
                className={`mono tabular-nums text-[0.66rem] tracking-[0.22em] transition-all ${
                  active
                    ? "text-flare opacity-100 translate-x-0"
                    : "text-muted opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0"
                }`}
              >
                {p.n} · {p.label}
              </span>
              <span
                aria-hidden
                className={`block transition-all ${
                  active
                    ? "w-6 h-[2px] bg-flare"
                    : "w-3 h-[1px] bg-muted group-hover:w-5 group-hover:bg-ink"
                }`}
              />
            </Link>
          );
        })}
        <button
          type="button"
          onClick={toggle}
          className="mono mt-4 pt-3 border-t border-rule text-[0.66rem] uppercase tracking-[0.22em] text-ink-soft hover:text-flare transition-colors"
          aria-label="Toggle language"
        >
          {lang === "en" ? "DE" : "EN"}
        </button>
      </nav>
    </>
  );
}
