import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["motion", "lucide-react"],
  },
  images: {
    remotePatterns: [
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
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      ...[
        ["/fr/ile", "/fr/island"],
        ["/fr/ile/oiseaux", "/fr/island/birds"],
        ["/fr/ile/plantes", "/fr/island/plants"],
        ["/fr/ile/poisson", "/fr/island/fish"],
        ["/fr/ile/tortues", "/fr/island/turtles"],
        ["/fr/ile/mammiferes-marins", "/fr/island/marine-mammals"],
        ["/fr/ile/invertebres", "/fr/island/invertebrates"],
      ].map(([source, destination]) => ({ source, destination, permanent: true })),
      {
        source: "/programs/research/cool-reef",
        destination: "/impact/cool-reef",
        permanent: true,
      },
      {
        source: "/field-station",
        destination: "/stations/bailey-field-station",
        permanent: true,
      },
      {
        source: "/fr/ile/geologie",
        destination: "/fr/island/geology",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
