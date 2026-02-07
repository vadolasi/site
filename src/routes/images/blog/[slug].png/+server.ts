import { ImageResponse } from "@ethercorps/sveltekit-og"
import ArticleOG from "$lib/components/og/ArticleOG.svelte"
import { extractMetadata } from "$lib/server/markdown"
import type { EntryGenerator, RequestHandler } from "./$types"

export const prerender = true

const posts = import.meta.glob("/src/content/posts/**/post.md", {
	eager: true,
	query: "?raw",
	import: "default"
}) as Record<string, string>

const images = import.meta.glob(
	"/src/content/posts/**/cover.{webp,png,jpg,jpeg}",
	{
		eager: true,
		query: "?inline&format=jpeg&quality=60&w=360&h=240&fit=cover",
		import: "default"
	}
) as Record<string, string>

const postMetaBySlug = new Map<string, { title?: string; draft?: boolean }>()
for (const [path, content] of Object.entries(posts)) {
	const parts = path.split("/")
	const slug = parts[parts.length - 2]
	const metadata = extractMetadata(content, "blog")
	postMetaBySlug.set(slug, metadata)
}

const coverBySlug = new Map<string, string>()
for (const [path, dataUrl] of Object.entries(images)) {
	const parts = path.split("/")
	const slug = parts[parts.length - 2]
	if (dataUrl) {
		coverBySlug.set(slug, dataUrl)
	}
}

export const entries: EntryGenerator = async () => {
	return Array.from(postMetaBySlug.entries())
		.filter(([, meta]) => !meta.draft)
		.map(([slug]) => ({ slug }))
}

const ogCache = new Map<
	string,
	{
		body: Uint8Array
		contentType: string
	}
>()

export const GET: RequestHandler = async ({ params }) => {
	const slug = params.slug
	const cached = ogCache.get(slug)
	if (cached) {
		return new Response(cached.body, {
			headers: {
				"content-type": cached.contentType,
				"cache-control": "public, max-age=0, s-maxage=86400, must-revalidate"
			}
		})
	}
	const meta = postMetaBySlug.get(slug)
	if (!meta) {
		return new Response("Not found", { status: 404 })
	}
	const title = meta.title ?? "Post"
	const coverSrc = coverBySlug.get(slug) ?? null
	const props = { title, cover: coverSrc }
	const imageResponse = new ImageResponse(
		ArticleOG,
		{
			width: 1200,
			height: 630,
			headers: {
				"cache-control": "public, max-age=0, s-maxage=86400, must-revalidate"
			}
		},
		props
	)
	const body = new Uint8Array(await imageResponse.arrayBuffer())
	const contentType = imageResponse.headers.get("content-type") ?? "image/png"
	ogCache.set(slug, { body, contentType })
	return new Response(body, {
		headers: {
			"content-type": contentType,
			"cache-control": "public, max-age=0, s-maxage=86400, must-revalidate"
		}
	})
}
