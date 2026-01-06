import withToc from "@stefanprobst/rehype-extract-toc"
import withTocExport from "@stefanprobst/rehype-extract-toc/mdsvex"
import adapter from "@sveltejs/adapter-cloudflare"
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte"
import { mdsvex } from "mdsvex"
import rehypeAutolinkHeadings from "rehype-autolink-headings"
import rehypeShiftHeading from "rehype-shift-heading"
import rehypeSlug from "rehype-slug"
import remarkReadingTime from "remark-reading-time"
import readingMdsvexTime from "remark-reading-time/mdsvex.js"

/** @type {import("@sveltejs/kit").Config} */
const config = {
  // Consult https://svelte.dev/docs/kit/integrations
  // for more information about preprocessors
  preprocess: [
    vitePreprocess(),
    mdsvex({
      extensions: [".svx", ".md"],
      rehypePlugins: [
        [rehypeShiftHeading, { shift: 1 }],
        rehypeSlug,
        withToc,
        [withTocExport, { name: "toc" }],
        [
          rehypeAutolinkHeadings,
          {
            behavior: "prepend",
            properties: {
              className: ["anchor-link"],
              ariaHidden: true,
              tabIndex: -1
            },
            content: {
              type: "text",
              value: "#"
            }
          }
        ]
      ],
      remarkPlugins: [remarkReadingTime, readingMdsvexTime]
    })
  ],
  kit: {
    // adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
    // If your environment is not supported, or you settled on a specific environment, switch out the adapter.
    // See https://svelte.dev/docs/kit/adapters for more information about adapters.
    adapter: adapter(),
    alias: {
      $content: "src/content"
    }
  },
  extensions: [".svelte", ".svx", ".md"]
}

export default config
