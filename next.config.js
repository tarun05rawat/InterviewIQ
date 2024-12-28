const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.json$/,
      type: "json",
      include: [path.resolve(__dirname, "src/data")],
    });
    return config;
  },
};

module.exports = nextConfig;
