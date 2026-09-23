import type { CSSProperties } from "react";

/** Stagger helper for [data-reveal] elements. */
export function delay(ms: number): CSSProperties {
  return { "--delay": `${ms}ms` } as CSSProperties;
}
