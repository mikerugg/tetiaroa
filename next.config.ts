import type { NextConfig } from "next";

const isProductionBuild = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  ...(isProductionBuild
    ? {
        turbopack: {
          resolveAlias: {
            "@/app/studio/studio-dev":
              "./app/studio/studio-dev.production.tsx",
          },
        },
      }
    : {}),
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.tetiaroasociety.org",
        pathname: "/sites/default/files/**",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
        pathname: "/wikipedia/commons/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/programs/research/cool-reef",
        destination: "/impact/cool-reef",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
