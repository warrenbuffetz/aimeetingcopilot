import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@interview-copilot/shared"],
  serverExternalPackages: ["pdf-parse"],
};

export default nextConfig;
