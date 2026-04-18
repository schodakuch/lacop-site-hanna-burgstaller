"use client";

import { useLang } from "@/context/LanguageContext";
import { useProfile } from "@/context/ProfileContext";
import { translations } from "@/data/content";

export default function Footer() {
  const { t } = useLang();
  const profile = useProfile();
  const year = new Date().getFullYear();
  const displayName = profile.display_name ?? profile.slug;

  return (
    <footer className="border-t border-rule px-5 md:px-16 lg:px-24">
      <div className="py-8 flex flex-col md:flex-row md:items-baseline md:justify-between gap-3 text-[0.82rem] text-muted">
        <span>
          © {year} {displayName}. {t(translations.footer.rights)}.
        </span>
        <span className="mono text-[0.66rem] uppercase tracking-[0.22em]">
          {t(translations.footer.set)}
        </span>
      </div>
    </footer>
  );
}
