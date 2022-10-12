/** @type {import("next").NextConfig} */
import withPreact from "next-plugin-preact"
import WindiCSS from "windicss-webpack-plugin"
import UnpluginIcons from "unplugin-icons/webpack"

export default withPreact({
  reactStrictMode: true,
  swcMinify: true,
  webpack: config => {
    config.plugins.push(new WindiCSS)
    config.plugins.push(UnpluginIcons({ compiler: "jsx", jsx: "preact" }))

    return config
  },
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: {
    domains: ["flowbite.s3.amazonaws.com", "flowbite.com"]
  }
})
