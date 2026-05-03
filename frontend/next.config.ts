import type { NextConfig } from "next";
import path from "node:path";

const backendOrigin = (
  process.env.BACKEND_URL ?? "http://localhost:5000"
).replace(/\/$/, "");

const nextConfig: NextConfig = {
  // Run `pnpm run dev` / `pnpm run build` from `frontend/` so cwd is this app (not the monorepo root).
  turbopack: {
    root: path.resolve(process.cwd()),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${backendOrigin}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
