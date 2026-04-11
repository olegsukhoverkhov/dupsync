import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  // Include ffmpeg-static binary in serverless function bundles.
  // Without this, Next.js tree-shaking excludes the native binary.
  outputFileTracingIncludes: {
    "/api/**": ["./node_modules/ffmpeg-static/**/*"],
  },
};

export default nextConfig;
