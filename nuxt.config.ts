import { defineNuxtConfig } from "nuxt3"
import UnpluginComponentsVite from "unplugin-vue-components/vite"
import IconsResolver from "unplugin-icons/resolver"

export default defineNuxtConfig({
  srcDir: "src",
  buildModules: ["nuxt-windicss", "unplugin-icons/nuxt"],

  components: true,

  vite: {
    plugins: [
      UnpluginComponentsVite({
        dts: true,
        resolvers: [
          IconsResolver({
            prefix: "Icon"
          })
        ]
      })
    ]
  }
})
