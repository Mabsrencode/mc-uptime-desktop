import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // output: "export", // standalone
  images: {
    unoptimized: true,
  },
  outputFileTracingExcludes: {
    "*": [
      "node_modules/@swc/core-linux-x64-gnu",
      "node_modules/@swc/core-linux-x64-musl",
    ],
  },
  webpack: (config) => {
    config.externals = [
      ...(config.externals || []),
      "bufferutil",
      "utf-8-validate",
    ];
    return config;
  },
};

export default nextConfig;
