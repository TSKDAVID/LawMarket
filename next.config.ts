import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const supabaseUrl = (
  process.env.SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  ""
).trim();

if (process.env.VERCEL && !supabaseUrl) {
  throw new Error(
    "Add NEXT_PUBLIC_SUPABASE_URL (or SUPABASE_URL) in Vercel → Settings → Environment Variables for Production, then redeploy."
  );
}

if (process.env.VERCEL && supabaseUrl) {
  try {
    console.log(`[lawmarket] Supabase host: ${new URL(supabaseUrl).hostname}`);
  } catch {
    throw new Error(`Invalid SUPABASE_URL: ${supabaseUrl}`);
  }
}

const supabaseAnonKey = (
  process.env.SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  ""
).trim();

const supabaseHost = supabaseUrl
  ? new URL(supabaseUrl).hostname
  : undefined;

const nextConfig: NextConfig = {
  // Prefer server-only aliases at build so a stale NEXT_PUBLIC_* on Vercel
  // does not bake a dead Supabase host into the client bundle.
  env: process.env.SUPABASE_URL
    ? {
        NEXT_PUBLIC_SUPABASE_URL: supabaseUrl,
        ...(process.env.SUPABASE_ANON_KEY
          ? { NEXT_PUBLIC_SUPABASE_ANON_KEY: supabaseAnonKey }
          : {}),
      }
    : {},
  trailingSlash: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      // Lawyer portraits and post covers served from Supabase Storage.
      ...(supabaseHost
        ? ([
            {
              protocol: "https" as const,
              hostname: supabaseHost,
              pathname: "/storage/v1/object/public/**",
            },
          ])
        : []),
    ],
  },
};

export default withNextIntl(nextConfig);
