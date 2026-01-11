import { readFile, writeFile } from "node:fs/promises"
import { extractMetadata } from "./markdown"
import type { BlogMetadata } from "./markdown"

export interface SeriesData {
	id: string
	posts: Array<{
		slug: string
		index: number
		title: string
	}>
}

/**
 * Gera arquivo series.json baseado nos metadados dos posts
 */
export async function generateSeriesJson(): Promise<void> {
	const postsModules = import.meta.glob("/src/content/posts/*.md")
	const seriesMap = new Map<string, SeriesData>()

	// Processa cada post para extrair metadados
	const posts = await Promise.all(
		Object.keys(postsModules).map(async (path) => {
			const slug = path.split("/").pop()?.replace(".md", "")
			const filePath = path.replace("/src", "./src")
			const content = await readFile(filePath, "utf-8")
			const metadata = extractMetadata(content, "blog") as BlogMetadata

			return { slug, metadata }
		})
	)

	// Agrupa posts por série
	for (const { slug, metadata } of posts) {
		if (metadata.serie) {
			const serieId = metadata.serie.id
			if (!seriesMap.has(serieId)) {
				seriesMap.set(serieId, {
					id: serieId,
					posts: []
				})
			}

			const series = seriesMap.get(serieId)!
			series.posts.push({
				slug: slug!,
				index: metadata.serie.index,
				title: metadata.title
			})
		}
	}

	// Ordena posts por índice dentro de cada série
	for (const series of seriesMap.values()) {
		series.posts.sort((a, b) => a.index - b.index)
	}

	// Converte para array e escreve arquivo
	const seriesArray = Array.from(seriesMap.values())
	const outputPath = "./src/lib/data/series.json"

	await writeFile(outputPath, JSON.stringify(seriesArray, null, 2), "utf-8")
	console.log(`✓ Generated ${outputPath} with ${seriesArray.length} series`)
}
