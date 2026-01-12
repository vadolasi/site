import { processMarkdown, extractMetadata } from "$lib/server/markdown"
import type { PageServerLoad } from "./$types"

export const prerender = true

const aboutModule = import.meta.glob("/src/content/about/about.md", {
	eager: true,
	query: "?raw",
	import: "default"
})

const aboutContent = Object.values(aboutModule)[0] as string

export const load: PageServerLoad = async ({ setHeaders }) => {
	setHeaders({
		"cache-control": "public, max-age=0, s-maxage=3600, must-revalidate"
	})
	const { html: aboutHtml } = await processMarkdown(aboutContent, "none")

	const projectsModules = import.meta.glob("/src/content/projects/*.md", {
		query: "?raw",
		import: "default"
	})
	const images = import.meta.glob("/src/lib/assets/*.{webp,png,jpg,jpeg}", {
		eager: true,
		query: { enhanced: true, w: "400;800;1200", aspect: "16:9" }
	})

	const projects = (
		await Promise.all(
			Object.entries(projectsModules).map(async ([path, loader]) => {
				try {
					const slug = path.split("/").pop()?.replace(".md", "")
					const content = (await loader()) as string

					const metadata = extractMetadata(content, "project")

					let coverImage: Record<string, unknown> | null = null
					if (metadata.cover) {
						if (images[metadata.cover]) {
							const imageModule = images[metadata.cover] as {
								default: Record<string, unknown>
							}
							coverImage = imageModule.default
						}
					}

					return {
						...metadata,
						slug,
						coverImage
					}
				} catch {
					// Ignora projetos com metadados inválidos
					return null
				}
			})
		)
	).filter(
		(project): project is Exclude<typeof project, null> => project !== null
	)

	return {
		projects,
		aboutHtml
	}
}
