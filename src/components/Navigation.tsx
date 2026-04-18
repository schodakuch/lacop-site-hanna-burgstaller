"use client";

import { useEffect, useState } from "react";
import { useLang } from "@/context/LanguageContext";
import { useProfile } from "@/context/ProfileContext";
import { scenes, translations } from "@/data/content";

// Right-edge minimap — the only chrome on the site.
// Every other site in this repo has a top bar or a left rail; this one has
// scene dots on the right that track IntersectionObserver entries.
// Mobile falls back to a top-right language toggle + compact dot column.

export default function Navigation() {
  const { lang, toggle, t } = useLang();
  const profile = useProfile();
  const displayName = profile.display_name ?? profile.slug;
  const firstName = displayName.split(" ")[0];
  const lastName = displayName.split(" ").slice(1).join(" ");
  const [activeKey, setActiveKey] = useState<string>("hello");

  useEffect(() => {
    if (typeof window === "undefined") return;
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
        const key = visible.target.id.replace("scene-", "");
        const scene = scenes.find((s) => s.n === key);
        if (scene) setActiveKey(scene.key);
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const go = (anchor: string) => {
    const el = document.querySelector(anchor);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

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
              aria-label={`Scene ${s.n} — ${t(translations.nav[s.key])}`}
              aria-current={active ? "true" : undefined}
            >
              <span
                className={`mono tabular-nums text-[0.66rem] tracking-[0.22em] transition-all ${
                  active
                    ? "text-bronze opacity-100 translate-x-0"
                    : "text-muted opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0"
                }`}
              >
                {s.n} · {t(translations.nav[s.key])}
              </span>
              <span
                aria-hidden
                className={`block transition-all ${
                  active
                    ? "w-6 h-[2px] bg-bronze"
                    : "w-3 h-[1px] bg-muted group-hover:w-5 group-hover:bg-ink"
                }`}
              />
            </button>
          );
        })}
        <button
          type="button"
          onClick={toggle}
          className="mono mt-4 pt-3 border-t border-rule text-[0.66rem] uppercase tracking-[0.22em] text-ink-soft hover:text-bronze transition-colors"
          aria-label="Toggle language"
        >
          {lang === "en" ? "DE" : "EN"}
        </button>
      </nav>

      {/* Mobile — top-right strip with scene number + language */}
      <div className="md:hidden fixed top-5 right-5 z-40 flex items-center gap-4">
        <span className="mono text-[0.66rem] tracking-[0.22em] text-muted tabular-nums">
          {scenes.find((s) => s.key === activeKey)?.n ?? "01"} / {scenes[scenes.length - 1].n}
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
                  active ? "w-2.5 h-2.5 bg-bronze" : "w-1.5 h-1.5 bg-muted/50"
                }`}
              />
            </button>
          );
        })}
      </nav>
    </>
  );
}
