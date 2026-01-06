import type { Toc } from "@stefanprobst/rehype-extract-toc"
import { error } from "@sveltejs/kit"
import type { BlogPostMetadata } from "$content/types"
import type { PageLoad } from "./$types"

export const prerender = true

export const load: PageLoad = async ({ params, data }) => {
  try {
    const posts = import.meta.glob("/src/content/posts/*.md", { eager: true })
    const postPath = `/src/content/posts/${params.slug}.md`
    const post = posts[postPath] as {
      default: unknown
      metadata: BlogPostMetadata
      toc: Toc
    }

    if (!post) throw new Error(`Post not found: ${postPath}`)

    let seriesPosts: Array<{ slug: string; title: string; index: number }> = []
    if (post.metadata.serie) {
      seriesPosts = Object.entries(posts)
        .map(([path, mod]) => {
          const p = mod as { metadata: BlogPostMetadata }
          return {
            slug: path.split("/").pop()?.replace(".md", "") ?? "",
            title: p.metadata.title,
            serie: p.metadata.serie
          }
        })
        .filter((p) => p.serie?.id === post.metadata.serie?.id)
        .map((p) => ({
          slug: p.slug,
          title: p.title,
          index: p.serie?.index ?? 0
        }))
        .sort((a, b) => a.index - b.index)
    }

    const images = import.meta.glob(
      "/src/lib/assets/posts/*.{webp,png,jpg,jpeg}",
      {
        eager: true,
        query: { enhanced: true }
      }
    )

    let coverImage = null
    if (post.metadata.cover) {
      const path = post.metadata.cover.replace("$lib", "/src/lib")
      const imageModule = images[path] as { default: string }

      if (imageModule) {
        coverImage = imageModule.default
      }
    }

    return {
      Content: post.default,
      meta: post.metadata,
      toc: post.toc,
      coverImage,
      seriesPosts,
      dates: data.dates,
      latestPosts: data.latestPosts
    }
  } catch (e) {
    console.error(e)
    error(404, `Could not find ${params.slug}`)
  }
}
