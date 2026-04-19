"use client";

import { useEffect, useMemo, useState } from "react";
import { useLang } from "@/context/LanguageContext";
import { useCategories, useProfile } from "@/context/ProfileContext";
import { fixedScenes, translations } from "@/data/content";

// Right-edge minimap — the only chrome on the site.
// Scene 01 Hello + 05 Process + 06 Reach are the fixed narrative bookends;
// scenes 02/03/04 are built from the active customer's first three
// categories (any names). Flipping LACOP_USER_SLUG changes which profile is
// rendered without touching this file.

type SceneRow = { key: string; n: string; anchor: string; label: string };

export default function Navigation() {
  const { lang, toggle, t } = useLang();
  const profile = useProfile();
  const categories = useCategories();
  const displayName = profile.display_name ?? profile.slug;
  const firstName = displayName.split(" ")[0];
  const lastName = displayName.split(" ").slice(1).join(" ");

  const scenes: SceneRow[] = useMemo(() => {
    const contentScenes: SceneRow[] = categories.slice(0, 3).map((c, i) => ({
      key: c.slug || `cat-${i}`,
      n: String(i + 2).padStart(2, "0"),
      anchor: `#scene-${String(i + 2).padStart(2, "0")}`,
      label: c.name,
    }));
    return [
      { key: "hello", n: fixedScenes.hello.n, anchor: fixedScenes.hello.anchor, label: t(translations.nav.hello) },
      ...contentScenes,
      { key: "process", n: fixedScenes.process.n, anchor: fixedScenes.process.anchor, label: t(translations.nav.process) },
      { key: "reach", n: fixedScenes.reach.n, anchor: fixedScenes.reach.anchor, label: t(translations.nav.reach) },
    ];
  }, [categories, lang, t]);

  const [activeKey, setActiveKey] = useState<string>(scenes[0]?.key ?? "hello");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const map = new Map(scenes.map((s) => [s.anchor.replace("#", ""), s.key]));
    const els = scenes
      .map((s) => document.querySelector(s.anchor))
      .filter((el): el is HTMLElement => el instanceof HTMLElement);
    if (els.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const key = map.get(visible.target.id);
        if (key) setActiveKey(key);
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [scenes]);

  const go = (anchor: string) => {
    const el = document.querySelector(anchor);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const lastScene = scenes[scenes.length - 1];
  const currentN = scenes.find((s) => s.key === activeKey)?.n ?? scenes[0]?.n ?? "01";

  return (
    <>
      {/* Corner brand — always visible top-left */}
      <a
        href="#scene-01"
        onClick={(e) => {
          e.preventDefault();
          go("#scene-01");
        }}
        className="fixed top-5 md:top-7 left-5 md:left-10 z-40 block leading-tight"
        aria-label={displayName}
      >
        <span className="mono text-[0.6rem] tracking-[0.24em] uppercase text-muted">
          {profile.role}
        </span>
        <span className="block text-[0.98rem] md:text-[1.05rem] mt-1">
          <span className="font-medium">{firstName}</span>{" "}
          {lastName && <span className="text-ink-soft">{lastName}</span>}
        </span>
      </a>

      {/* Desktop right-edge minimap */}
      <nav
        aria-label="Scene minimap"
        className="hidden md:flex fixed top-1/2 right-6 lg:right-10 z-40 -translate-y-1/2 flex-col items-end gap-3"
      >
        {scenes.map((s) => {
          const active = s.key === activeKey;
          return (
            <button
              key={s.key}
              type="button"
              onClick={() => go(s.anchor)}
              className="group flex items-center gap-3 py-1"
              aria-label={`Scene ${s.n} — ${s.label}`}
              aria-current={active ? "true" : undefined}
            >
              <span
                className={`mono tabular-nums text-[0.66rem] tracking-[0.22em] transition-all ${
                  active
                    ? "text-flare opacity-100 translate-x-0"
                    : "text-muted opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0"
                }`}
              >
                {s.n} · {s.label}
              </span>
              <span
                aria-hidden
                className={`block transition-all ${
                  active
                    ? "w-6 h-[2px] bg-flare"
                    : "w-3 h-[1px] bg-muted group-hover:w-5 group-hover:bg-ink"
                }`}
              />
            </button>
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

      {/* Mobile — top-right strip with scene number + language */}
      <div className="md:hidden fixed top-5 right-5 z-40 flex items-center gap-4">
        <span className="mono text-[0.66rem] tracking-[0.22em] text-muted tabular-nums">
          {currentN} / {lastScene?.n ?? "06"}
        </span>
        <button
          type="button"
          onClick={toggle}
          className="mono text-[0.66rem] uppercase tracking-[0.22em] text-ink"
          aria-label="Toggle language"
        >
          {lang === "en" ? "DE" : "EN"}
        </button>
      </div>

      {/* Mobile bottom dot strip — tap targets are the full 36x36 button; the
          visible dot is purely decorative inside it so the hit area clears 44px
          touch minima (sum of button size + small gap). */}
      <nav
        aria-label="Scene minimap — mobile"
        className="md:hidden fixed left-1/2 -translate-x-1/2 z-40 flex items-center gap-1 bg-paper/90 backdrop-blur px-2 py-1 rounded-full border border-rule"
        style={{ bottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
      >
        {scenes.map((s) => {
          const active = s.key === activeKey;
          return (
            <button
              key={s.key}
              type="button"
              onClick={() => go(s.anchor)}
              aria-label={`Scene ${s.n}`}
              aria-current={active ? "true" : undefined}
              className="w-9 h-9 flex items-center justify-center rounded-full"
            >
              <span
                aria-hidden
                className={`block rounded-full transition-all ${
                  active ? "w-2.5 h-2.5 bg-flare" : "w-1.5 h-1.5 bg-muted/50"
                }`}
              />
            </button>
          );
        })}
      </nav>
    </>
  );
}
