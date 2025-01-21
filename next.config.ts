import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["i.imgur.com"], // Add your external image domains here
  },
};

export default nextConfig;
