import { readFile } from "node:fs/promises"
import { processMarkdown, extractMetadata } from "$lib/server/markdown"
import { getFileDates } from "$lib/server/utils"
import type { PageServerLoad } from "./$types"

export const prerender = true

export const load: PageServerLoad = async ({ setHeaders }) => {
	setHeaders({
		"cache-control": "public, max-age=0, s-maxage=3600, must-revalidate"
	})
	const bioContent = await readFile("./src/content/about/bio.md", "utf-8")
	const { html: bioHtml } = await processMarkdown(bioContent, "none")

	const postsModules = import.meta.glob("/src/content/posts/**/post.md")

	const images = import.meta.glob(
		"/src/content/posts/**/cover.{webp,png,jpg,jpeg}",
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
		Object.keys(postsModules).map(async (path) => {
			const parts = path.split("/")
			const slug = parts[parts.length - 2]
			const filePath = path.replace("/src", "./src")
			const content = await readFile(filePath, "utf-8")
			const metadata = extractMetadata(content, "blog")
			const dates = await getFileDates(path)

			let coverImage: Record<string, unknown> | null = null
			// procurar cover dentro da pasta do post
			const coverKey = Object.keys(images).find((k) =>
				k.includes(`/src/content/posts/${slug}/cover.`)
			)
			if (coverKey) {
				coverImage = (images[coverKey] as Record<string, unknown>)?.default
			}

			return {
				slug,
				...metadata,
				dates,
				coverImage
			}
		})
	)

	const latestPosts = postsData
		.filter((post) => !post.draft)
		.sort(
			(a, b) =>
				new Date(b.dates.created).getTime() -
				new Date(a.dates.created).getTime()
		)
		.slice(0, 4)

	return { latestPosts, bioHtml }
}
