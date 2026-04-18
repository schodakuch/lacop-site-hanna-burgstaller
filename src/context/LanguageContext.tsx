"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Lang = "en" | "de";

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggle: () => void;
  t: <T extends { en: string; de: string }>(v: T) => string;
};

const LanguageContext = createContext<Ctx | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");

  useEffect(() => {
    const stored = typeof window !== "undefined" ? window.localStorage.getItem("mr_lang") : null;
    if (stored === "en" || stored === "de") {
      setLang(stored);
      return;
    }
    if (typeof navigator !== "undefined" && navigator.language?.toLowerCase().startsWith("de")) {
      setLang("de");
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("mr_lang", lang);
      document.documentElement.lang = lang;
    }
  }, [lang]);

  const value = useMemo<Ctx>(
    () => ({
      lang,
      setLang,
      toggle: () => setLang((l) => (l === "en" ? "de" : "en")),
      t: <T extends { en: string; de: string }>(v: T) => v[lang],
    }),
    [lang],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used inside LanguageProvider");
  return ctx;
}
