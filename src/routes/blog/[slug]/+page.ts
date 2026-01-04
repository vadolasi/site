import { error } from "@sveltejs/kit"
import type { EntryGenerator, PageLoad } from "./$types"

export const prerender = true

export const entries: EntryGenerator = () => {
  const posts = import.meta.glob("$lib/content/posts/*.md")
  return Object.keys(posts).map((path) => {
    const slug = path.split("/").pop()?.replace(".md", "")
    console.log("Generating entry for slug:", slug)
    return { slug: slug ?? "" }
  })
}

export const load: PageLoad = async ({ params, data }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const serverData = data as any
  try {
    const posts = import.meta.glob("/src/content/posts/*.md", { eager: true })
    const postPath = `/src/content/posts/${params.slug}.md`
    const post = posts[postPath] as {
      default: unknown
      metadata: BlogPostMetadata
    }

    if (!post) throw new Error(`Post not found: ${postPath}`)

    // Find other posts in the same series
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

    const images = import.meta.glob("/src/lib/assets/*.{webp,png,jpg,jpeg}", {
      eager: false,
      query: { enhanced: true }
    })

    let coverImage = null
    if (post.metadata.cover) {
      const path = post.metadata.cover.replace("$lib", "/src/lib")
      const imageModule = (await images[path]()) as { default: string }

      if (imageModule) {
        coverImage = imageModule.default
      }
    }

    return {
      Content: post.default,
      meta: post.metadata,
      coverImage,
      seriesPosts,
      dates: serverData?.dates
    }
  } catch (e) {
    console.error(e)
    error(404, `Could not find ${params.slug}`)
  }
}
