"use client";

import { useEffect, useMemo, useState } from "react";
import { useLang } from "@/context/LanguageContext";
import { useProfile, useCategories } from "@/context/ProfileContext";
import { translations } from "@/data/content";
import { SCENE_IDS, rhythmSceneId, type SceneEntry } from "@/lib/scenes";

// Scene minimap — desktop: right-edge dots with scene labels revealed on
// hover, wired to the active scene via IntersectionObserver. Mobile: a
// corner brand pill + a small "Jump to ▾" button that opens a sheet
// listing the six scenes. No top bar, no left rail — that's the whole
// chrome. Scene order is site-level (cover → 3 rhythm → process → contact);
// rhythm scene labels come from the tenant's `category.name` so the nav
// reflows for any customer the multi-tenant shell renders.

export default function Navigation() {
  const { lang, toggle, t } = useLang();
  const profile = useProfile();
  const categories = useCategories();
  const [active, setActive] = useState<string>(SCENE_IDS.cover);
  const [drawer, setDrawer] = useState(false);

  const displayName = profile.display_name ?? profile.slug;
  const firstName = displayName.split(" ")[0];
  const lastName = displayName.split(" ").slice(1).join(" ");

  const scenes: SceneEntry[] = useMemo(() => {
    const rhythm = categories.slice(0, 3).map((c, i): SceneEntry => ({
      id: rhythmSceneId(i),
      kind: "rhythm",
      label: { en: c.name, de: c.name },
    }));
    return [
      { id: SCENE_IDS.cover, kind: "cover", label: translations.nav.cover },
      ...rhythm,
      { id: SCENE_IDS.process, kind: "process", label: translations.nav.process },
      { id: SCENE_IDS.contact, kind: "contact", label: translations.nav.contact },
    ];
  }, [categories]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const els = scenes
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el instanceof HTMLElement);
    if (els.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        setActive(visible.target.id);
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [scenes]);

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

  const jumpTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    setDrawer(false);
  };

  const currentScene = scenes.find((s) => s.id === active);

  return (
    <>
      {/* ───── Desktop brand pill (top-left corner) ───── */}
      <a
        href={`#${SCENE_IDS.cover}`}
        aria-label={displayName}
        className="hidden md:block fixed top-7 left-10 z-40 leading-tight"
        onClick={(e) => {
          e.preventDefault();
          jumpTo(SCENE_IDS.cover);
        }}
      >
        <span className="mono text-[0.58rem] tracking-[0.28em] uppercase text-muted">
          {profile.role}
        </span>
        <span className="block text-[1.02rem] mt-1">
          <span className="font-medium">{firstName}</span>
          {lastName && <> <span className="text-ink-soft">{lastName}</span></>}
        </span>
      </a>

      {/* ───── Desktop scene minimap (right edge) ───── */}
      <nav
        aria-label="Scenes"
        className="hidden md:flex fixed top-1/2 right-6 lg:right-10 z-40 -translate-y-1/2 flex-col items-end gap-1"
      >
        {scenes.map((s) => {
          const isActive = active === s.id;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => jumpTo(s.id)}
              aria-current={isActive ? "true" : undefined}
              aria-label={`${t(s.label)} scene`}
              className="group flex items-center gap-3 w-11 h-11 justify-end"
            >
              <span
                aria-hidden
                className={`mono text-[0.62rem] tracking-[0.22em] uppercase transition-all ${
                  isActive
                    ? "text-flare opacity-100 translate-x-0"
                    : "text-muted opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0"
                }`}
              >
                {t(s.label)}
              </span>
              <span
                aria-hidden
                className={`block rounded-full transition-all ${
                  isActive
                    ? "w-[14px] h-[2px] bg-flare"
                    : "w-[8px] h-[1px] bg-muted group-hover:bg-ink group-hover:w-[12px]"
                }`}
              />
            </button>
          );
        })}
        <button
          type="button"
          onClick={toggle}
          aria-label="Toggle language"
          className="mono mt-4 pt-3 border-t border-rule text-[0.62rem] uppercase tracking-[0.24em] text-ink-soft hover:text-flare transition-colors"
        >
          {lang === "en" ? "DE" : "EN"}
        </button>
      </nav>

      {/* ───── Mobile: corner brand + a single "Jump to ▾" button ───── */}
      <div
        className="md:hidden fixed top-0 inset-x-0 z-50 bg-paper/92 backdrop-blur-md border-b border-rule"
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        <div className="h-14 px-5 flex items-center justify-between gap-3">
          <a
            href={`#${SCENE_IDS.cover}`}
            onClick={(e) => {
              e.preventDefault();
              jumpTo(SCENE_IDS.cover);
            }}
            className="flex items-baseline gap-2 min-w-0"
            aria-label={displayName}
          >
            <span className="text-[0.98rem] font-medium truncate">{firstName}</span>
            {lastName && (
              <span className="text-[0.9rem] text-ink-soft truncate">{lastName}</span>
            )}
          </a>
          <div className="flex items-center gap-1">
            {currentScene && (
              <span
                className="mono text-[0.58rem] tracking-[0.22em] uppercase text-muted pr-3 border-r border-rule mr-1"
                aria-hidden
              >
                {t(currentScene.label)}
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
              aria-controls="scene-drawer"
              className="mono text-[0.64rem] uppercase tracking-[0.22em] text-ink min-h-11 min-w-11 px-2 flex items-center justify-center -mr-2"
            >
              {drawer ? t(translations.nav.close) : `${t(translations.nav.jump_to)} ▾`}
            </button>
          </div>
        </div>
        <div
          id="scene-drawer"
          className={`transition-[max-height,opacity] duration-300 ${
            drawer
              ? "max-h-[calc(100vh-3.5rem)] opacity-100 border-t border-rule overflow-y-auto"
              : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          <ol className="px-5 py-6 divide-y divide-rule">
            {scenes.map((s, i) => {
              const isActive = active === s.id;
              const n = String(i + 1).padStart(2, "0");
              return (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => jumpTo(s.id)}
                    aria-current={isActive ? "true" : undefined}
                    className={`w-full flex items-baseline gap-5 py-4 min-h-14 text-left ${
                      isActive ? "text-flare" : "text-ink"
                    }`}
                  >
                    <span
                      className={`mono text-[0.66rem] tracking-[0.22em] tabular-nums w-8 shrink-0 ${
                        isActive ? "text-flare" : "text-muted"
                      }`}
                    >
                      {n}
                    </span>
                    <span className="text-[1.25rem] tracking-[-0.01em] font-light">
                      {t(s.label)}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </>
  );
}
