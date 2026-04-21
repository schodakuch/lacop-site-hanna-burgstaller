"use client";

import Link from "next/link";
import { useProfile } from "@/context/ProfileContext";
import { copy } from "@/data/copy";
import { getSocialLabel } from "@/lib/utils";

export default function Footer() {
  const profile = useProfile();
  const year = new Date().getFullYear();
  const displayName = profile.display_name ?? profile.slug;
  const socials = Object.entries(profile.social_links ?? {}).filter(([, v]) => Boolean(v));

  return (
    <footer className="border-t border-rule px-5 md:px-10 lg:px-16 mt-auto">
      <div className="py-8 md:py-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6 text-[0.82rem] text-muted">
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
          <span>© {year} {displayName}</span>
          <span className="hidden md:inline text-rule">·</span>
          <span>{copy.footer.rights}</span>
          <span className="hidden md:inline text-rule">·</span>
          <Link href="/impressum" className="hover-mark text-ink-soft hover:text-ink">
            {copy.footer.impressum}
          </Link>
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          {socials.map(([platform, url]) => (
            <a
              key={platform}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover-mark text-ink-soft hover:text-flare"
            >
              {getSocialLabel(platform)}
            </a>
          ))}
          <a href="#top" className="hover-mark text-[0.88rem] font-medium text-ink-soft hover:text-flare">
            {copy.footer.top} ↑
          </a>
          <a
            href="https://lacop.app"
            target="_blank"
            rel="noopener noreferrer"
            className="mono text-[0.62rem] uppercase tracking-[0.22em] text-muted hover:text-ink-soft"
          >
            {copy.footer.made_with} <span className="text-ink-soft">LACOP</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
