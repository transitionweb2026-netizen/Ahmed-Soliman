import type { Dictionary } from "@/lib/dictionary";

export type NavKey = keyof Pick<Dictionary["nav"], "home" | "about" | "services" | "videos" | "articles" | "contact">;

export const navItems: Array<{ key: NavKey; path: string }> = [
  { key: "home", path: "" },
  { key: "about", path: "/about" },
  { key: "services", path: "/services" },
  { key: "videos", path: "/videos" },
  { key: "articles", path: "/articles" },
  { key: "contact", path: "/contact" },
];
