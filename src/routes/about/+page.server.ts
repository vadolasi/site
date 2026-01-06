import type { PageServerLoad } from "./$types"

export const prerender = true

export const load: PageServerLoad = async () => {
  const projectsModules = import.meta.glob("/src/content/projects/*.md", {
    eager: true
  })
  const images = import.meta.glob("/src/lib/assets/*.{webp,png,jpg,jpeg}", {
    eager: true,
    query: { enhanced: true, w: "400;800;1200", aspect: "16:9" }
  })

  const projects = await Promise.all(
    Object.entries(projectsModules).map(async ([path, mod]) => {
      const slug = path.split("/").pop()?.replace(".md", "")
      // biome-ignore lint/suspicious/noExplicitAny: metadata type is not strictly defined here
      const p = mod as any

      let coverImage = null
      if (p.metadata.cover) {
        if (images[p.metadata.cover]) {
          // biome-ignore lint/suspicious/noExplicitAny: image module type is dynamic
          const imageModule = images[p.metadata.cover] as { default: any }
          coverImage = imageModule.default
        }
      }

      return {
        ...p.metadata,
        slug,
        featured: p.metadata.featured === true,
        coverImage
      }
    })
  )

  return {
    projects
  }
}
