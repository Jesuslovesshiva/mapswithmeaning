/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: "./src/pages",
};

module.exports = {
  reactStrictMode: true,
  pageExtensions: ["js", "jsx", "ts", "tsx"],
  // basePath: "/mapswithmeaning",
};

const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const withPlugins = require("next-compose-plugins");

module.exports = withPlugins([], {
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
});
