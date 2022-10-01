/** @type {import("next").NextConfig} */
import withPreact from "next-plugin-preact"
import WindiCSSWebpackPlugin from "windicss-webpack-plugin"

const nextConfig = withPreact({
  reactStrictMode: true,
  swcMinify: true,
  webpack: config => {
    config.plugins.push(new WindiCSSWebpackPlugin)
    return config
  }
})

export default nextConfig
