import { readFile } from "node:fs/promises"
import { processMarkdown, extractMetadata } from "$lib/server/markdown"
import type { PageServerLoad } from "./$types"

export const prerender = true

export const load: PageServerLoad = async ({ setHeaders }) => {
	setHeaders({
		"cache-control": "public, max-age=0, s-maxage=3600, must-revalidate"
	})
	const aboutContent = await readFile("./src/content/about/about.md", "utf-8")
	const { html: aboutHtml } = await processMarkdown(aboutContent, "none")

	const projectsModules = import.meta.glob("/src/content/projects/*.md")
	const images = import.meta.glob("/src/lib/assets/*.{webp,png,jpg,jpeg}", {
		eager: true,
		query: { enhanced: true, w: "400;800;1200", aspect: "16:9" }
	})

	const projects = await Promise.all(
		Object.keys(projectsModules).map(async (path) => {
			const slug = path.split("/").pop()?.replace(".md", "")
			const filePath = path.replace("/src", "./src")
			const content = await readFile(filePath, "utf-8")
			// Usa extractMetadata para apenas pegar metadados (mais rápido)
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
		})
	)

	return {
		projects,
		aboutHtml
	}
}
