import { Feed } from "feed"
import { getFileDates } from "$lib/server/utils"
import { processMarkdown, extractMetadata } from "$lib/server/markdown"

export const prerender = true

export async function GET() {
	const postsModules = import.meta.glob("/src/content/posts/**/post.md", {
		query: "?raw",
		import: "default"
	})

	// Fazer a glob dos covers uma vez
	const coverAssets = import.meta.glob(
		"/src/content/posts/**/cover.{webp,png,jpg,jpeg}",
		{ eager: true, query: "?url", import: "default" }
	) as Record<string, string>

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

				// Procurar pela URL do cover já resolvida pelo Vite com hash
				let coverImage: string | null = null
				const coverKey = Object.keys(coverAssets).find((k) =>
					k.includes(`/src/content/posts/${slug}/cover.`)
				)
				if (coverKey) {
					const imageUrl = coverAssets[coverKey]
					if (typeof imageUrl === "string") {
						const absoluteImageUrl = new URL(imageUrl, siteUrl).href
						coverImage = absoluteImageUrl
					}
				}

				return { slug, metadata, html, dates, coverImage }
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
		const feedItem: {
			title: string
			id: string
			link: string
			description: string
			author: Array<{ name: string; link: string; email: string }>
			content: string
			copyright: string
			date: Date
			published: Date
			image?: string
		} = {
			title: post.metadata.title,
			id: `${siteUrl}/blog/${post.slug}`,
			link: `${siteUrl}/blog/${post.slug}`,
			description: post.metadata.description,
			author: [
				{
					name: "Vitor Daniel",
					link: siteUrl,
					email: "vitor@vitordaniel.is-a.dev"
				}
			],
			content: post.html,
			copyright: `© ${new Date().getFullYear()} Vitor Daniel`,
			date: post.dates.updated,
			published: post.dates.created
		}

		if (post.coverImage) {
			feedItem.image = post.coverImage
		}

		feed.addItem(feedItem)
	}

	return new Response(feed.atom1(), {
		headers: {
			"Content-Type": "application/atom+xml",
			"cache-control": "public, max-age=0, s-maxage=3600, must-revalidate"
		}
	})
}
