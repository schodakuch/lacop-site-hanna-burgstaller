"use client";

import {
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  type MotionValue,
} from "framer-motion";

// Scroll-velocity-driven font-variation-settings for Fraunces. Exposes
// opsz + wght + SOFT + WONK axes so the display heading swells, softens,
// and goes slightly wonky when the visitor scrolls fast, then settles
// back when still. Shared across all pages — the kinetic typography is
// the site's signature interaction, so every heading gets it.

export function useKineticAxes(
  reduced: boolean | null,
): MotionValue<string> | string {
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { damping: 60, stiffness: 200, mass: 0.4 });
  const absVel = useTransform(smooth, (v) => Math.min(Math.abs(v), 3000));

  const t: MotionValue<number> = useTransform(absVel, [0, 1600, 3000], [0, 0.6, 1]);

  const wght = useTransform(t, [0, 1], [340, 820]);
  const soft = useTransform(t, [0, 1], [0, 100]);
  const wonk = useTransform(t, [0, 1], [0, 1]);
  const opsz = useTransform(t, [0, 1], [120, 144]);

  const still = useMotionValue("\"opsz\" 144, \"wght\" 340, \"SOFT\" 0, \"WONK\" 0");
  const live = useMotionTemplate`"opsz" ${opsz}, "wght" ${wght}, "SOFT" ${soft}, "WONK" ${wonk}`;
  return reduced ? still : live;
}
