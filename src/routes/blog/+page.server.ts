import { extractMetadata } from "$lib/server/markdown"
import { getFileDates } from "$lib/server/utils"
import type { PageServerLoad } from "./$types"

export const prerender = true

export const load: PageServerLoad = async ({ setHeaders }) => {
	setHeaders({
		"cache-control": "public, max-age=0, s-maxage=3600, must-revalidate"
	})
	const posts = import.meta.glob("/src/content/posts/**/post.md", {
		query: "?raw",
		import: "default"
	})
	const images = import.meta.glob(
		"/src/content/posts/**/cover.{webp,png,jpg,jpeg}",
		{
			eager: true,
			query: { enhanced: true, w: "400;800", aspect: "16:9" }
		}
	)

	const postsList = await Promise.all(
		Object.entries(posts).map(async ([path, loader]) => {
			const parts = path.split("/")
			const slug = parts[parts.length - 2]
			const content = (await loader()) as string
			const metadata = extractMetadata(content, "blog")
			const dates = await getFileDates(path)

			let coverImage: Record<string, unknown> | null = null
			const coverKey = Object.keys(images).find((k) =>
				k.includes(`/src/content/posts/${slug}/cover.`)
			)
			if (coverKey) {
				const imageModule = images[coverKey] as {
					default: Record<string, unknown>
				}
				coverImage = imageModule.default
			}

			return {
				slug,
				...metadata,
				dates,
				coverImage
			}
		})
	)

	// Filter out drafts and sort by date (newest first)
	const publishedPosts = postsList
		.filter((post) => !post.draft)
		.sort((a, b) => {
			return (
				new Date(b.dates.created).getTime() -
				new Date(a.dates.created).getTime()
			)
		})

	return {
		posts: publishedPosts
	}
}
