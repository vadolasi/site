import adapter from "@sveltejs/adapter-cloudflare"
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte"
import { mdsvex } from "mdsvex"
import { visit } from "unist-util-visit"

const shiftHeaders = () => (tree) => {
  visit(tree, "element", (node) => {
    const match = node.tagName.match(/^h([1-6])$/)
    if (match) {
      const level = parseInt(match[1], 10)
      node.tagName = `h${Math.min(level + 1, 6)}`
    }
  })
}

/** @type {import("@sveltejs/kit").Config} */
const config = {
  // Consult https://svelte.dev/docs/kit/integrations
  // for more information about preprocessors
  preprocess: [
    vitePreprocess(),
    mdsvex({
      extensions: [".svx", ".md"],
      rehypePlugins: [shiftHeaders]
    })
  ],
  kit: {
    // adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
    // If your environment is not supported, or you settled on a specific environment, switch out the adapter.
    // See https://svelte.dev/docs/kit/adapters for more information about adapters.
    adapter: adapter()
  },
  extensions: [".svelte", ".svx", ".md"]
}

export default config
