import { getFileDates } from "$lib/server/utils"
import type { EntryGenerator, PageServerLoad } from "./$types"

export const prerender = true

export const entries: EntryGenerator = () => {
  const posts = import.meta.glob("/src/content/posts/*.md")
  return Object.keys(posts).map((path) => {
    const slug = path.split("/").pop()?.replace(".md", "")
    return { slug: slug ?? "" }
  })
}

export const load: PageServerLoad = async ({ params }) => {
  const relativePath = `/src/content/posts/${params.slug}.md`
  const dates = await getFileDates(relativePath)

  const postsModules = import.meta.glob("/src/content/posts/*.md", {
    eager: true
  })
  const images = import.meta.glob("/src/lib/assets/*.{webp,png,jpg,jpeg}", {
    eager: false,
    query: { enhanced: true }
  })

  const allPosts = await Promise.all(
    Object.entries(postsModules).map(async ([path, mod]) => {
      const slug = path.split("/").pop()?.replace(".md", "")
      const p = mod as any
      const postDates = await getFileDates(path)

      let coverImage = null
      if (p.metadata.cover) {
        const imagePath = p.metadata.cover.replace("$lib", "/src/lib")
        if (images[imagePath]) {
          const imageModule = (await images[imagePath]()) as { default: any }
          coverImage = imageModule.default
        }
      }

      console.log(p.metadata)

      return {
        slug,
        ...p.metadata,
        dates: postDates,
        coverImage
      }
    })
  )

  const latestPosts = allPosts
    .filter((p) => p.slug !== params.slug)
    .sort(
      (a, b) =>
        new Date(b.dates.created).getTime() -
        new Date(a.dates.created).getTime()
    )
    .slice(0, 3)

  return {
    dates,
    latestPosts
  }
}
