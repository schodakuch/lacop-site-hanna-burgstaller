"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import type { Profile } from "@/lib/types";
import { copy } from "@/data/copy";
import { useKineticAxes } from "@/lib/kinetic";
import { getSocialLabel, safeUrl } from "@/lib/utils";

type Props = { profile: Profile };

function bookingEmailFor(profile: Profile): string {
  if (profile.website_domain) {
    return `hello@${profile.website_domain.replace(/^https?:\/\//, "")}`;
  }
  return `hello@${profile.slug}.lacop.site`;
}

export default function ContactClient({ profile }: Props) {
  const reduced = useReducedMotion();
  const axes = useKineticAxes(reduced ?? null);
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const email = bookingEmailFor(profile);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "");
    const from = String(data.get("email") ?? "");
    const subject = String(data.get("subject") ?? "");
    const message = String(data.get("message") ?? "");
    const body = `${message}\n\n—\n${name}${from ? ` <${from}>` : ""}`;
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setTimeout(() => {
      setSent(true);
      setSubmitting(false);
    }, 300);
  }

  const socials = Object.entries(profile.social_links ?? {}).filter(([, v]) => Boolean(v));

  return (
    <>
      <section className="px-5 md:px-10 lg:px-16 pt-10 md:pt-16 pb-8 md:pb-12">
        <p className="mono text-[0.62rem] uppercase tracking-[0.28em] text-flare mb-3">
          {copy.contact.eyebrow}
        </p>
        <motion.h1
          className="display text-[clamp(2.2rem,8.5vw,5.4rem)] text-ink"
          style={{ fontVariationSettings: axes }}
        >
          {copy.contact.title}
        </motion.h1>
        <p className="font-serif italic text-lg md:text-xl text-ink-soft mt-6 max-w-xl">
          {copy.contact.subtitle}
        </p>
      </section>

      <section className="px-5 md:px-10 lg:px-16 py-12 md:py-20 border-t border-rule">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
          {/* Info column */}
          <div className="md:col-span-5 space-y-10">
            <div>
              <p className="mono text-[0.6rem] uppercase tracking-[0.26em] text-muted mb-2">
                {copy.contact.form.email}
              </p>
              <a
                href={`mailto:${email}`}
                className="hover-mark font-serif italic text-xl md:text-2xl text-ink hover:text-flare break-all"
              >
                {email}
              </a>
            </div>

            {socials.length > 0 && (
              <div>
                <p className="mono text-[0.6rem] uppercase tracking-[0.26em] text-muted mb-3">
                  {copy.contact.follow_heading}
                </p>
                <ul className="flex flex-wrap gap-x-5 gap-y-2">
                  {socials.map(([platform, url]) => {
                    const safe = safeUrl(url);
                    if (!safe) return null;
                    return (
                      <li key={platform}>
                        <a
                          href={safe}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover-mark font-serif italic text-lg text-flare hover:text-ink"
                        >
                          {getSocialLabel(platform)}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>

          {/* Form */}
          <div className="md:col-span-7">
            {sent ? (
              <div className="py-12 text-center">
                <p className="display text-5xl sm:text-6xl text-flare mb-6">✓</p>
                <p className="font-serif italic text-xl md:text-2xl text-ink">
                  {copy.contact.form.sent}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Field name="name" label={copy.contact.form.name} required />
                  <Field name="email" type="email" label={copy.contact.form.email} required />
                </div>
                <Field name="subject" label={copy.contact.form.subject} required />
                <Field name="message" label={copy.contact.form.message} required textarea />
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 text-[0.95rem] font-medium text-paper bg-flare px-6 py-3 hover:bg-flare-soft transition-colors disabled:opacity-60"
                >
                  {submitting ? copy.contact.form.sending : copy.contact.form.send}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

function Field({
  name,
  label,
  type = "text",
  required,
  textarea,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  textarea?: boolean;
}) {
  return (
    <label className="block">
      <span className="block mono text-[0.6rem] uppercase tracking-[0.26em] text-muted mb-2">
        {label}
      </span>
      {textarea ? (
        <textarea
          name={name}
          required={required}
          rows={5}
          className="w-full bg-transparent border-0 border-b border-rule focus:border-flare pb-2 outline-none text-ink font-serif text-lg transition-colors resize-none"
        />
      ) : (
        <input
          name={name}
          type={type}
          required={required}
          className="w-full bg-transparent border-0 border-b border-rule focus:border-flare pb-2 outline-none text-ink font-serif text-lg transition-colors"
        />
      )}
    </label>
  );
}
