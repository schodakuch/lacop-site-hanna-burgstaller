import Link from "next/link";
import { copy } from "@/data/copy";

export default function NotFound() {
  return (
    <article className="px-5 md:px-16 lg:px-24 pt-40 pb-24 max-w-[80ch]">
      <span className="mono text-[0.68rem] uppercase tracking-[0.24em] text-muted">
        — / —
      </span>
      <h1 className="display mt-6 text-[clamp(2.8rem,8vw,5.4rem)]">
        {copy.notfound.heading}
      </h1>
      <p className="mt-5 text-[1.02rem] leading-relaxed text-ink-soft">
        {copy.notfound.body}
      </p>
      <div className="mt-10">
        <Link
          href="/"
          className="text-[0.95rem] font-medium text-ink hover-mark hover:text-flare transition-colors"
        >
          ← {copy.notfound.home}
        </Link>
      </div>
    </article>
  );
}
