import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  distDir: "out",
  images: {
    unoptimized: true,
  },
  trailingSlash: true, // Helps with static export compatibility
};

export default nextConfig;