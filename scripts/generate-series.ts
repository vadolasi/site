import { readFileSync, readdirSync, writeFileSync } from "node:fs"
import { resolve } from "node:path"
import { extractMetadata } from "../src/lib/server/markdown"

interface SeriesData {
	id: string
	posts: string[]
}

async function generateSeries() {
	const postsDir = resolve("./src/content/posts")
	const dirs = readdirSync(postsDir, { withFileTypes: true }).filter((d) =>
		d.isDirectory()
	)

	const seriesMap = new Map<string, Set<{ slug: string; index: number }>>()

	// Ler todos os posts e extrair séries
	for (const dir of dirs) {
		const slug = dir.name
		const content = readFileSync(resolve(postsDir, slug, "post.md"), "utf-8")

		try {
			const metadata = extractMetadata(content, "blog")

			if (metadata.serie) {
				if (!seriesMap.has(metadata.serie.id)) {
					seriesMap.set(metadata.serie.id, new Set())
				}

				seriesMap.get(metadata.serie.id)!.add({
					slug,
					index: metadata.serie.index
				})
			}
		} catch {
			// Ignora posts com metadados inválidos
		}
	}

	// Converteu map para array e ordena
	const seriesData: SeriesData[] = Array.from(seriesMap.entries()).map(
		([id, posts]) => ({
			id,
			posts: Array.from(posts)
				.sort((a, b) => a.index - b.index)
				.map((p) => p.slug)
		})
	)

	// Escreve series.json
	const outputPath = resolve("./src/content/posts/series.json")
	writeFileSync(outputPath, JSON.stringify(seriesData, null, 2), "utf-8")

	console.log(`✓ Generated series.json with ${seriesData.length} series`)
	console.log(JSON.stringify(seriesData, null, 2))
}

generateSeries().catch((err) => {
	console.error("Error generating series.json:", err)
	process.exit(1)
})
