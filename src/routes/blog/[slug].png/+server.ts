import { extractMetadata } from "$lib/server/markdown"
import type { EntryGenerator, RequestHandler } from "./$types"

export const prerender = true

export const entries: EntryGenerator = async () => {
	const posts = import.meta.glob("/src/content/posts/**/post.md", {
		query: "?raw",
		import: "default"
	})

	const entries = await Promise.all(
		Object.entries(posts).map(async ([path, loader]) => {
			const parts = path.split("/")
			const slug = parts[parts.length - 2]
			const content = (await loader()) as string
			const metadata = extractMetadata(content, "blog")
			return { slug, draft: metadata.draft }
		})
	)

	return entries
		.filter((entry) => !entry.draft)
		.map((entry) => ({ slug: entry.slug ?? "" }))
}

export const GET: RequestHandler = async ({ params, url }) => {
	const target = new URL(`/images/blog/${params.slug}.png`, url)
	return new Response(null, {
		status: 302,
		headers: {
			location: target.toString()
		}
	})
}
