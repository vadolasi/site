import { readFile } from "node:fs/promises"
import { processMarkdown, extractMetadata } from "$lib/server/markdown"
import { getFileDates } from "$lib/server/utils"
import type { EntryGenerator, PageServerLoad } from "./$types"

export const prerender = true

export const entries: EntryGenerator = async () => {
	const posts = import.meta.glob("/src/content/posts/**/post.md")
	const entries = await Promise.all(
		Object.keys(posts).map(async (path) => {
			const parts = path.split("/")
			const slug = parts[parts.length - 2]
			const filePath = path.replace("/src", "./src")
			const content = await readFile(filePath, "utf-8")
			const metadata = extractMetadata(content, "blog")
			return { slug: slug ?? "", draft: metadata.draft }
		})
	)
	return entries
		.filter((entry) => !entry.draft)
		.map((entry) => ({ slug: entry.slug }))
}

export const load: PageServerLoad = async ({ params, setHeaders }) => {
	setHeaders({
		"cache-control": "public, max-age=0, s-maxage=3600, must-revalidate"
	})
	const relativePath = `/src/content/posts/${params.slug}/post.md`
	const absolutePath = `./src/content/posts/${params.slug}/post.md`
	const dates = await getFileDates(relativePath)

	// Ler e processar o arquivo markdown
	const fileContent = await readFile(absolutePath, "utf-8")
	const { html, metadata, toc } = await processMarkdown(fileContent)

	// Bloquear acesso a posts draft
	if (metadata.draft) {
		throw new Error("Post not found")
	}

	const postsModules = import.meta.glob("/src/content/posts/**/post.md", {
		eager: false
	})
	const images = import.meta.glob(
		"/src/content/posts/**/cover.{webp,png,jpg,jpeg}",
		{
			eager: false,
			query: { enhanced: true }
		}
	)

	// Processar imagem de capa
	let coverImage: Record<string, unknown> | null = null
	{
		const coverKey = Object.keys(images).find((k) =>
			k.includes(`/src/content/posts/${params.slug}/cover.`)
		)
		if (coverKey) {
			const imageModule = (await images[coverKey]()) as {
				default: Record<string, unknown>
			}
			coverImage = imageModule.default
		}
	}

	// Buscar posts para a série (se houver)
	let seriesPosts: Array<{ slug: string; title: string }> = []
	if (metadata.serie) {
		const allPostsData = await Promise.all(
			Object.keys(postsModules).map(async (path) => {
				const parts = path.split("/")
				const slug = parts[parts.length - 2]
				const filePath = path.replace("/src", "./src")
				const content = await readFile(filePath, "utf-8")
				// Usa extractMetadata para apenas pegar metadados (mais rápido)
				const postMetadata = extractMetadata(content, "blog")
				return {
					slug,
					metadata: postMetadata
				}
			})
		)

		seriesPosts = allPostsData
			.filter(
				(p) => p.metadata.serie?.id === metadata.serie?.id && !p.metadata.draft
			)
			.sort(
				(a, b) =>
					(a.metadata.serie?.index ?? 0) - (b.metadata.serie?.index ?? 0)
			)
			.map((p) => ({
				slug: p.slug,
				title: p.metadata.title
			}))
	}

	// Buscar posts recentes
	const allPostsData = await Promise.all(
		Object.keys(postsModules).map(async (path) => {
			const parts = path.split("/")
			const slug = parts[parts.length - 2]
			const filePath = path.replace("/src", "./src")
			const content = await readFile(filePath, "utf-8")
			// Usa extractMetadata para apenas pegar metadados (mais rápido)
			const postMetadata = extractMetadata(content, "blog")
			const postDates = await getFileDates(path)

			let postCoverImage: Record<string, unknown> | null = null
			{
				const coverKey = Object.keys(images).find((k) =>
					k.includes(`/src/content/posts/${slug}/cover.`)
				)
				if (coverKey) {
					const imageModule = (await images[coverKey]()) as {
						default: Record<string, unknown>
					}
					postCoverImage = imageModule.default
				}
			}

			return {
				slug,
				...postMetadata,
				dates: postDates,
				coverImage: postCoverImage
			}
		})
	)

	const latestPosts = allPostsData
		.filter((p) => p.slug !== params.slug && !p.draft)
		.sort(
			(a, b) =>
				new Date(b.dates.created).getTime() -
				new Date(a.dates.created).getTime()
		)
		.slice(0, 3)

	return {
		html,
		meta: {
			...metadata,
			toc
		},
		coverImage,
		seriesPosts,
		dates,
		latestPosts
	}
}
