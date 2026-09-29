"use client";

import { useEffect, useRef, useState } from "react";
import { formatNumber } from "@/lib/i18n";

type CountUpProps = {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
};

const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

/** Counts from 0 to `value` the first time it scrolls into view. */
export function CountUp({ value, prefix = "", suffix = "", duration = 2200 }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  // Server HTML carries the final number (for no-JS visitors and crawlers);
  // the client rewinds to 0 and counts up once the card is on screen.
  const [current, setCurrent] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setCurrent(0);

    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          setCurrent(Math.round(easeOutExpo(progress) * value));
          if (progress < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.5 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value, duration]);

  return (
    <span ref={ref} dir="ltr" className="lining-nums tabular-nums">
      {/* Screen readers get the final figure, not every animation frame. */}
      <span aria-hidden="true">
        {prefix}
        {formatNumber(current)}
        {suffix}
      </span>
      <span className="sr-only">
        {prefix}
        {formatNumber(value)}
        {suffix}
      </span>
    </span>
  );
}
