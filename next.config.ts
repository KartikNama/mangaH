import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

initOpenNextCloudflareForDev();

const mediaBackend = process.env.MEDIA_PROXY_URL ?? "http://127.0.0.1:3033";
const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  // Local only: proxy /media → Oracle backend. Production uses NEXT_PUBLIC_MEDIA_URL.
  ...(isDev
    ? {
        async rewrites() {
          return [
            {
              source: "/media/:path*",
              destination: `${mediaBackend}/media/:path*`,
            },
          ];
        },
      }
    : {}),
  images: {
    dangerouslyAllowLocalIP: isDev,
    localPatterns: [{ pathname: "/media/**" }],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "media.saudult.xyz",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
