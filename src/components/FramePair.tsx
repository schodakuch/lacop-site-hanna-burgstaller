"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { Media } from "@/lib/types";

// Signature per-category opener: two "hero" frames with an offset
// vertical rhythm, alternating side per category (offset="left" puts
// the primary frame on the left, "right" flips it). Keep this shared
// between the cover-adjacent teaser usage and the /photos route's
// per-category openers so the runway voice is consistent.

type Props = {
  shots: Media[];
  offset: "left" | "right";
  alt: string;
  reduced: boolean | null;
};

export default function FramePair({ shots, offset, alt, reduced }: Props) {
  if (shots.length === 0) {
    return (
      <div className="mt-10 md:mt-14 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10">
        <div
          className={`md:col-span-7 ${
            offset === "left" ? "md:col-start-1" : "md:col-start-6"
          } bg-shade rounded-sm`}
          style={{ aspectRatio: "720 / 900" }}
        />
      </div>
    );
  }
  const [first, second] = shots;
  const primarySpan =
    offset === "left"
      ? "md:col-span-7 md:col-start-1"
      : "md:col-span-7 md:col-start-6";
  const secondarySpan =
    offset === "left"
      ? "md:col-span-4 md:col-start-9 md:mt-24"
      : "md:col-span-4 md:col-start-1 md:mt-24";

  return (
    <div className="mt-10 md:mt-14 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10">
      <motion.figure
        initial={reduced ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className={`relative ${primarySpan}`}
      >
        <div
          className="relative overflow-hidden bg-shade grain"
          style={{
            aspectRatio: `${first.width ?? 720} / ${first.height ?? 900}`,
          }}
        >
          <Image
            src={first.url}
            alt={first.title ?? `${alt} — frame 01`}
            fill
            sizes="(min-width: 768px) 55vw, 100vw"
            className="object-cover"
          />
        </div>
        <figcaption className="mono text-[0.62rem] tracking-[0.2em] text-muted tabular-nums mt-2">
          {alt} — 01 / {String(shots.length).padStart(2, "0")}
        </figcaption>
      </motion.figure>
      {second && (
        <motion.figure
          initial={reduced ? false : { opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.7, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
          className={`relative ${secondarySpan}`}
        >
          <div
            className="relative overflow-hidden bg-shade grain"
            style={{
              aspectRatio: `${second.width ?? 720} / ${second.height ?? 900}`,
            }}
          >
            <Image
              src={second.url}
              alt={second.title ?? `${alt} — frame 02`}
              fill
              sizes="(min-width: 768px) 32vw, 100vw"
              className="object-cover"
            />
          </div>
          <figcaption className="mono text-[0.62rem] tracking-[0.2em] text-muted tabular-nums mt-2">
            {alt} — 02 / {String(shots.length).padStart(2, "0")}
          </figcaption>
        </motion.figure>
      )}
    </div>
  );
}
