import { Feed } from "feed"
import { getFileDates } from "$lib/server/utils"
import { processMarkdown, extractMetadata } from "$lib/server/markdown"

export const prerender = true

export async function GET() {
	const postsModules = import.meta.glob("/src/content/posts/**/post.md", {
		query: "?raw",
		import: "default"
	})
	const siteUrl = "https://vitordaniel.is-a.dev"

	const sortedPosts = (
		await Promise.all(
			Object.entries(postsModules).map(async ([path, loader]) => {
				const parts = path.split("/")
				const slug = parts[parts.length - 2]
				const content = (await loader()) as string
				const dates = await getFileDates(path)
				const metadata = extractMetadata(content, "blog")
				const { html } = await processMarkdown(content, "blog")
				return { slug, metadata, html, dates }
			})
		)
	)
		.filter((post) => post && post !== null && !post.metadata.draft)
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
