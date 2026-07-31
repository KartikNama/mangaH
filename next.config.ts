import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3033",
        pathname: "/media/**",
      },
      {
        protocol: "https",
        hostname: "media.saudult.xyz",
        pathname: "/media/**",
      },
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
    ],
  },
};

export default nextConfig;
