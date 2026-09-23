"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const MAX_TILT = 5; // degrees

/**
 * One small client island that powers motion site-wide, so every section can
 * stay a Server Component:
 *  - [data-reveal]  → fades/slides in once when scrolled into view
 *  - [data-tilt]    → subtle 3D perspective tilt following the pointer
 *  - .glass-interactive → specular highlight follows the pointer
 */
export function Interactions() {
  const pathname = usePathname();

  // Scroll reveal — re-scan after every navigation.
  useEffect(() => {
    const items = document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-visible)");
    if (!("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );
    items.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);

  // Pointer tilt + glass light, via event delegation (no per-card listeners).
  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches) return;

    let frame = 0;
    let active: HTMLElement | null = null;

    const reset = (el: HTMLElement) => {
      el.classList.remove("is-tilting");
      el.style.removeProperty("--rx");
      el.style.removeProperty("--ry");
    };

    const onMove = (event: PointerEvent) => {
      const target = event.target as Element | null;
      const glass = target?.closest<HTMLElement>(".glass-interactive, [data-tilt]") ?? null;
      const tilt = target?.closest<HTMLElement>("[data-tilt]") ?? null;

      if (active && active !== tilt) reset(active);
      active = tilt;

      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (glass) {
          const r = glass.getBoundingClientRect();
          glass.style.setProperty("--mx", `${event.clientX - r.left}px`);
          glass.style.setProperty("--my", `${event.clientY - r.top}px`);
        }
        if (tilt && !reduced.matches) {
          const r = tilt.getBoundingClientRect();
          const px = (event.clientX - r.left) / r.width - 0.5;
          const py = (event.clientY - r.top) / r.height - 0.5;
          tilt.classList.add("is-tilting");
          tilt.style.setProperty("--rx", `${(-py * MAX_TILT).toFixed(2)}deg`);
          tilt.style.setProperty("--ry", `${(px * MAX_TILT).toFixed(2)}deg`);
        }
      });
    };

    const onLeave = () => {
      if (active) reset(active);
      active = null;
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return null;
}
