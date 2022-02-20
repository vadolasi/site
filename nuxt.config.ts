import { defineNuxtConfig } from "nuxt3"
import UnpluginComponentsVite from "unplugin-vue-components/vite"
import IconsResolver from "unplugin-icons/resolver"

export default defineNuxtConfig({
  srcDir: "src",
  buildModules: ["nuxt-windicss", "unplugin-icons/nuxt", "@nuxtjs/color-mode", "@vueuse/nuxt"],

  components: true,

  colorMode: {
    classSuffix: ""
  },

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
