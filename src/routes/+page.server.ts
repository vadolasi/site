import { getFileDates } from "$lib/server/utils"
import type { PageServerLoad } from "./$types"

export const prerender = true

export const load: PageServerLoad = async () => {
  const postsModules = import.meta.glob("/src/content/posts/*.md", {
    eager: true
  })

  const images = import.meta.glob(
    "/src/lib/assets/posts/*.{webp,png,jpg,jpeg}",
    {
      eager: true,
      query: {
        enhanced: true,
        w: "400;800",
        aspect: "16:9"
      }
    }
  )

  const postsData = await Promise.all(
    Object.entries(postsModules).map(async ([path, mod]) => {
      // biome-ignore lint/suspicious/noExplicitAny: d
      const p = mod as any
      const dates = await getFileDates(path)

      let coverImage = null
      if (p.metadata.cover) {
        const coverPath = p.metadata.cover.replace("$lib", "/src/lib")
        if (images[coverPath]) {
          // biome-ignore lint/suspicious/noExplicitAny: d
          coverImage = (images[coverPath] as any)?.default
        }
      }

      return {
        slug: path.split("/").pop()?.replace(".md", ""),
        ...p.metadata,
        dates,
        coverImage
      }
    })
  )

  const latestPosts = postsData
    .sort(
      (a, b) =>
        new Date(b.dates.created).getTime() -
        new Date(a.dates.created).getTime()
    )
    .slice(0, 4)

  return { latestPosts }
}
