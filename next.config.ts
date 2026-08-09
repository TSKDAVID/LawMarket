import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

/**
 * Static export for GitHub Pages. Custom domains (e.g. lawmarket.ge) serve from
 * the site root, so basePath stays empty. Project-page previews use /LawMarket.
 */
const isGithubPages = process.env.GITHUB_PAGES === "true";
const useProjectBasePath =
  isGithubPages && process.env.CUSTOM_DOMAIN !== "true";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  ...(useProjectBasePath
    ? {
        basePath: "/LawMarket",
        assetPrefix: "/LawMarket",
      }
    : {}),
};

export default withNextIntl(nextConfig);
