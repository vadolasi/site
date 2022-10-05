/** @type {import("next").NextConfig} */
import withPreact from "next-plugin-preact"
import WindiCSS from "windicss-webpack-plugin"
import UnpluginIcons from "unplugin-icons/webpack"

const nextConfig = withPreact({
  reactStrictMode: true,
  swcMinify: true,
  webpack: config => {
    config.plugins.push(new WindiCSS)
    config.plugins.push(UnpluginIcons({ compiler: "jsx", jsx: "preact" }))

    return config
  }
})

export default nextConfig
