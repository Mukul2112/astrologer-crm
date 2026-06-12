import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: {
    appIsrStatus: false, // Hides the "Route Static" / "Turbopack" indicator
    buildActivity: false,
  },
};

export default nextConfig;
