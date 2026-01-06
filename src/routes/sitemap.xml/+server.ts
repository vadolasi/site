import { create } from "xmlbuilder2"
import { getFileDates } from "$lib/server/utils"

export const prerender = true

export async function GET() {
  const posts = import.meta.glob("/src/content/posts/*.md", { eager: true })
  const siteUrl = "https://vitordaniel.com"

  const doc = create({ version: "1.0", encoding: "UTF-8" }).ele("urlset", {
    xmlns: "http://www.sitemaps.org/schemas/sitemap/0.9"
  })

  doc.ele("url").ele("loc").txt(siteUrl).up().up()
  doc.ele("url").ele("loc").txt(`${siteUrl}/about`).up().up()
  doc.ele("url").ele("loc").txt(`${siteUrl}/blog`).up().up()

  for (const path in posts) {
    const slug = path.split("/").pop()?.replace(".md", "")
    if (slug) {
      const dates = await getFileDates(path)
      doc
        .ele("url")
        .ele("loc")
        .txt(`${siteUrl}/blog/posts/${slug}`)
        .up()
        .ele("lastmod")
        .txt(dates.updated.toISOString())
        .up()
        .up()
    }
  }

  const xml = doc.end({ prettyPrint: true })

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml"
    }
  })
}
