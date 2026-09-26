import type { Metadata } from "next";
import { IBM_Plex_Sans_Arabic, Manrope } from "next/font/google";
import "./admin.css";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-admin", display: "swap" });
const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600"],
  variable: "--font-admin-ar",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "CMS · Dr. Ahmed Soliman", template: "%s · CMS" },
  robots: { index: false, follow: false },
  icons: { icon: "/icon.svg" },
};

/** Root layout for the CMS (separate from the public site's layout and styles). */
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" className={`${manrope.variable} ${plexArabic.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
