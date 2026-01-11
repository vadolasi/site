import { create } from "xmlbuilder2"
import { getFileDates } from "$lib/server/utils"
import { extractMetadata } from "$lib/server/markdown"
import { readdirSync, readFileSync, existsSync } from "fs"
import { resolve } from "path"

export const prerender = true

export async function GET() {
	const postsDir = resolve("src/content/posts")
	const postDirs = readdirSync(postsDir, { withFileTypes: true }).filter((d) =>
		d.isDirectory()
	)
	const siteUrl = "https://vitordaniel.com"

	const doc = create({ version: "1.0", encoding: "UTF-8" }).ele("urlset", {
		xmlns: "http://www.sitemaps.org/schemas/sitemap/0.9"
	})

	doc.ele("url").ele("loc").txt(siteUrl).up().up()
	doc.ele("url").ele("loc").txt(`${siteUrl}/about`).up().up()
	doc.ele("url").ele("loc").txt(`${siteUrl}/blog`).up().up()

	for (const dir of postDirs) {
		const slug = dir.name
		const path = `/src/content/posts/${slug}/post.md`
		const fullPath = resolve(postsDir, slug, "post.md")
		if (!existsSync(fullPath)) continue
		const content = readFileSync(fullPath, "utf-8")
		const metadata = extractMetadata(content, "blog")

		// Pular posts draft
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
