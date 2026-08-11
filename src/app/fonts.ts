import localFont from "next/font/local";
import { IBM_Plex_Mono } from "next/font/google";

/**
 * BRAND.md §3 — the two self-hosted Georgian brand fonts (single regular
 * weight each; all hierarchy comes from size/spacing/color, never weight),
 * plus IBM Plex Mono for document apparatus (§ numbers, prices, case codes).
 */

/** ALK Sanet — the display voice. */
export const alkSanet = localFont({
  src: "../fonts/alk-sanet-webfont.woff2",
  weight: "400",
  style: "normal",
  variable: "--font-alk",
  display: "swap",
  preload: true,
});

/** BPG Nino Mkhedruli — the text voice. */
export const bpgNino = localFont({
  src: "../fonts/bpg-nino-mkhedruli-webfont.woff2",
  weight: "400",
  style: "normal",
  variable: "--font-bpg",
  display: "swap",
  preload: true,
});

/** IBM Plex Mono — document apparatus only (numeric/Latin). */
export const plexMono = IBM_Plex_Mono({
  weight: "400",
  subsets: ["latin", "latin-ext"],
  variable: "--font-plex",
  display: "swap",
  preload: true,
});
