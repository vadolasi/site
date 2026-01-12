import { create } from "xmlbuilder2"
import { getFileDates } from "$lib/server/utils"
import { extractMetadata } from "$lib/server/markdown"

export const prerender = true

const postsModules = import.meta.glob("/src/content/posts/**/post.md", {
	eager: true,
	query: "?raw",
	import: "default"
})

export async function GET() {
	const siteUrl = "https://vitordaniel.is-a.dev"

	const doc = create({ version: "1.0", encoding: "UTF-8" }).ele("urlset", {
		xmlns: "http://www.sitemaps.org/schemas/sitemap/0.9"
	})

	doc.ele("url").ele("loc").txt(siteUrl).up().up()
	doc.ele("url").ele("loc").txt(`${siteUrl}/about`).up().up()
	doc.ele("url").ele("loc").txt(`${siteUrl}/blog`).up().up()

	for (const [path, content] of Object.entries(postsModules)) {
		const parts = path.split("/")
		const slug = parts[parts.length - 2]
		const metadata = extractMetadata(content as string, "blog")

		if (metadata.draft) continue

		const dates = await getFileDates(path)
		doc
			.ele("url")
			.ele("loc")
			.txt(`${siteUrl}/blog/${slug}`)
			.up()
			.ele("lastmod")
			.txt(dates.updated.toISOString())
			.up()
			.up()
	}

	const xml = doc.end({ prettyPrint: true })

	return new Response(xml, {
		headers: {
			"Content-Type": "application/xml",
			"cache-control": "public, max-age=0, s-maxage=3600, must-revalidate"
		}
	})
}
