"use client";

import Link from "next/link";
import { useLang } from "@/context/LanguageContext";
import { translations } from "@/data/content";
import { usePages } from "@/hooks/usePages";

export default function Pagination({ pageKey }: { pageKey: string }) {
  const { t } = useLang();
  const pages = usePages();
  const idx = pages.findIndex((p) => p.key === pageKey);
  if (idx < 0) return null;
  const prev = idx > 0 ? pages[idx - 1] : null;
  const next = idx < pages.length - 1 ? pages[idx + 1] : null;

  return (
    <nav
      aria-label="Pagination"
      className="border-t border-rule mt-16 md:mt-24 pt-6 grid grid-cols-2 gap-6 text-[0.95rem]"
    >
      <div className="text-left">
        {prev ? (
          <Link href={prev.href} className="group inline-block">
            <span className="mono text-[0.6rem] tracking-[0.24em] text-muted block mb-1 tabular-nums">
              {prev.n} · {prev.label}
            </span>
            <span className="hover-mark">← {t(translations.pagination.prev)}</span>
          </Link>
        ) : (
          <span className="mono text-[0.62rem] uppercase tracking-[0.22em] text-muted">—</span>
        )}
      </div>
      <div className="text-right">
        {next ? (
          <Link href={next.href} className="group inline-block">
            <span className="mono text-[0.6rem] tracking-[0.24em] text-muted block mb-1 tabular-nums">
              {next.n} · {next.label}
            </span>
            <span className="hover-mark">{t(translations.pagination.next)} →</span>
          </Link>
        ) : (
          <span className="mono text-[0.62rem] uppercase tracking-[0.22em] text-muted">—</span>
        )}
      </div>
    </nav>
  );
}
