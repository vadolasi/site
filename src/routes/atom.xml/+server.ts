import { Feed } from "feed"
import { getFileDates } from "$lib/server/utils"
import { processMarkdown, extractMetadata } from "$lib/server/markdown"
import { readdirSync, readFileSync, existsSync } from "fs"
import { resolve } from "path"

export const prerender = true

export async function GET() {
	const postsDir = resolve("src/content/posts")
	const postDirs = readdirSync(postsDir, { withFileTypes: true }).filter((d) =>
		d.isDirectory()
	)
	const siteUrl = "https://vitordaniel.com"

	const sortedPosts = (
		await Promise.all(
			postDirs.map(async (dir) => {
				const slug = dir.name
				const path = `/src/content/posts/${slug}/post.md`
				const fullPath = resolve(postsDir, slug, "post.md")
				if (!existsSync(fullPath)) return null
				const content = readFileSync(fullPath, "utf-8")
				const dates = await getFileDates(path)
				const metadata = extractMetadata(content, "blog")
				const { html } = await processMarkdown(content, "blog")
				return { slug, metadata, html, dates }
			})
		)
	)
		.filter((post) => post && !post.metadata.draft)
		.sort((a, b) => b.dates.updated.getTime() - a.dates.updated.getTime())

	const feed = new Feed({
		title: "Blog de Vitor Daniel",
		description: "Artigos sobre desenvolvimento web e tecnologia",
		id: siteUrl,
		link: siteUrl,
		language: "pt-BR",
		copyright: `© ${new Date().getFullYear()} Vitor Daniel. Todos os direitos reservados.`,
		updated: sortedPosts[0]?.dates.updated ?? new Date(),
		generator: "SvelteKit",
		feedLinks: {
			atom: `${siteUrl}/atom.xml`
		},
		author: {
			name: "Vitor Daniel",
			link: siteUrl
		}
	})

	for (const post of sortedPosts) {
		feed.addItem({
			title: post.metadata.title,
			id: `${siteUrl}/blog/${post.slug}`,
			link: `${siteUrl}/blog/${post.slug}`,
			description: post.metadata.description,
			author: [
				{
					name: "Vitor Daniel",
					link: siteUrl,
					email: "vitor036daniel@gmail.com"
				}
			],
			content: post.html,
			copyright: `© ${new Date().getFullYear()} Vitor Daniel`,
			date: post.dates.updated,
			published: post.dates.created,
			image: post.metadata.cover
				? `${siteUrl}${post.metadata.cover}`
				: undefined
		})
	}

	return new Response(feed.atom1(), {
		headers: {
			"Content-Type": "application/atom+xml",
			"cache-control": "public, max-age=0, s-maxage=3600, must-revalidate"
		}
	})
}
