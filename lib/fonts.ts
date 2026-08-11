/**
 * Self-hosted fonts via Fontsource (variable weight, subset by unicode-range).
 *
 * Previously these came from `next/font/google`, which downloads font files
 * from Google at BUILD time — CI/Vercel builds failed whenever Google rotated
 * the pinned file URLs (404s). Vendoring through npm makes builds
 * deterministic and offline-safe.
 *
 * The CSS custom properties consumed by globals.css (--font-playfair,
 * --font-inter, --font-noto-serif-ka, --font-noto-sans-ka) are defined on
 * :root in app/globals.css.
 */
import "@fontsource-variable/playfair-display";
import "@fontsource-variable/inter";
import "@fontsource-variable/noto-serif-georgian";
import "@fontsource-variable/noto-sans-georgian";
