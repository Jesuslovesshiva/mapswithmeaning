/** @type {import('next').NextConfig} */
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const withPlugins = require("next-compose-plugins");

const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ["js", "jsx", "ts", "tsx"],
  images: {
    remotePatterns: [
      { hostname: "upload.wikimedia.org" }, // This replaces the old domains array
    ],
  },
  webpack(config, { isServer }) {
    if (process.env.ANALYZE) {
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: "server",
          analyzerPort: isServer ? 8888 : 8889,
          openAnalyzer: true,
        })
      );
    }
    return config;
  },
  // Add other configurations here if needed
};

module.exports = withPlugins([], nextConfig);
