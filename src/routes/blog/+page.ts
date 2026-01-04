import type { PageLoad } from "./$types"

export const load: PageLoad = async () => {
  const posts = import.meta.glob("/src/content/posts/*.md", { eager: true })

  const postsList = Object.entries(posts).map(([path, post]) => {
    const p = post as { metadata: BlogPostMetadata }
    const slug = path.split("/").pop()?.replace(".md", "")
    return {
      slug,
      ...p.metadata
    }
  })

  return {
    posts: postsList
  }
}
