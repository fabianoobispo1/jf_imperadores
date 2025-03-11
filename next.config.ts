import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // Só use isso em desenvolvimento
  },
};

export default nextConfig;
