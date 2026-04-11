import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  // Prevent Next.js from bundling ffmpeg-static so it can locate its
  // native binary via __dirname at runtime on Vercel serverless.
  serverExternalPackages: ["ffmpeg-static"],
  // Include the ffmpeg binary in serverless function file tracing.
  outputFileTracingIncludes: {
    "/api/**": ["./node_modules/ffmpeg-static/**/*"],
  },
};

export default nextConfig;
