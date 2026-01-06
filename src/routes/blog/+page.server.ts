import { getFileDates } from "$lib/server/utils"
import type { PageServerLoad } from "./$types"

export const prerender = true

export const load: PageServerLoad = async () => {
  const posts = import.meta.glob("/src/content/posts/*.md", { eager: true })
  const images = import.meta.glob(
    "/src/lib/assets/posts/*.{webp,png,jpg,jpeg}",
    {
      eager: true,
      query: { enhanced: true, w: "400;800", aspect: "16:9" }
    }
  )

  const postsList = await Promise.all(
    Object.entries(posts).map(async ([path, post]) => {
      const p = post
      const slug = path.split("/").pop()?.replace(".md", "")
      const dates = await getFileDates(path)

      let coverImage = null
      if (p.metadata.cover) {
        if (images[p.metadata.cover]) {
          const imageModule = images[p.metadata.cover] as { default: any }
          coverImage = imageModule.default
        }
      }

      return {
        slug,
        ...p.metadata,
        dates,
        coverImage
      }
    })
  )

  // Sort by date (newest first)
  postsList.sort((a, b) => {
    return (
      new Date(b.dates.created).getTime() - new Date(a.dates.created).getTime()
    )
  })

  return {
    posts: postsList
  }
}
