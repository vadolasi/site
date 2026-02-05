import { processMarkdown, extractMetadata } from "$lib/server/markdown"
import { getFileDates } from "$lib/server/utils"
import type { EntryGenerator, PageServerLoad } from "./$types"

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
	const dates = await getFileDates(relativePath)

	// Ler e processar o arquivo markdown
	const postsModules = import.meta.glob("/src/content/posts/**/post.md", {
		query: "?raw",
		import: "default"
	})
	const postLoader = postsModules[relativePath]
	if (!postLoader) {
		throw new Error("Post not found")
	}
	const fileContent = (await postLoader()) as string

	// Carregar todas as imagens do post (não apenas cover)
	const allImages = import.meta.glob(
		"/src/content/posts/**/*.{webp,png,jpg,jpeg,gif,svg}",
		{
			eager: false,
			query: { enhanced: true }
		}
	)

	// Filtrar imagens deste post específico
	const postImages: Record<string, unknown> = {}
	for (const [path, loader] of Object.entries(allImages)) {
		if (path.includes(`/src/content/posts/${params.slug}/`)) {
			postImages[path] = await loader()
		}
	}

	const { html, metadata, toc } = await processMarkdown(
		fileContent,
		"blog",
		undefined,
		params.slug,
		postImages
	)

	// Bloquear acesso a posts draft
	if (metadata.draft) {
		throw new Error("Post not found")
	}

	// Processar imagem de capa
	let coverImage: Record<string, unknown> | null = null
	{
		const coverKey = Object.keys(postImages).find((k) =>
			k.includes(`/src/content/posts/${params.slug}/cover.`)
		)
		if (coverKey) {
			const imageModule = postImages[coverKey] as {
				default: Record<string, unknown>
			}
			coverImage = imageModule.default
		}
	}

	// Buscar posts para a série (se houver)
	let seriesPosts: Array<{ slug: string; title: string }> = []
	if (metadata.serie) {
		const allPostsData = await Promise.all(
			Object.entries(postsModules).map(async ([path, loader]) => {
				const parts = path.split("/")
				const slug = parts[parts.length - 2]
				const content = (await loader()) as string
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
	const coverImages = import.meta.glob(
		"/src/content/posts/**/cover.{webp,png,jpg,jpeg}",
		{
			eager: false,
			query: { enhanced: true }
		}
	)

	const allPostsData = await Promise.all(
		Object.entries(postsModules).map(async ([path, loader]) => {
			const parts = path.split("/")
			const slug = parts[parts.length - 2]
			const content = (await loader()) as string
			// Usa extractMetadata para apenas pegar metadados (mais rápido)
			const postMetadata = extractMetadata(content, "blog")
			const postDates = await getFileDates(path)

			let postCoverImage: Record<string, unknown> | null = null
			{
				const coverKey = Object.keys(coverImages).find((k) =>
					k.includes(`/src/content/posts/${slug}/cover.`)
				)
				if (coverKey) {
					const imageModule = (await coverImages[coverKey]()) as {
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
