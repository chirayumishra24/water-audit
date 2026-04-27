import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  reactCompiler: true,
  transpilePackages: ["next-mdx-remote"],
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
