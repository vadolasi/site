import { pluginLineNumbers } from "@expressive-code/plugin-line-numbers"
import withToc from "@stefanprobst/rehype-extract-toc"
import { pluginFileIcons } from "@xt0rted/expressive-code-file-icons"
import ecTwoSlash from "expressive-code-twoslash"
import matter from "gray-matter"
import rehypeAutolinkHeadings from "rehype-autolink-headings"
import rehypeExpressiveCode, {
	type RehypeExpressiveCodeOptions
} from "rehype-expressive-code"
import rehypeShiftHeading from "rehype-shift-heading"
import rehypeSlug from "rehype-slug"
import rehypeStringify from "rehype-stringify"
import remarkGfm from "remark-gfm"
import remarkParse from "remark-parse"
import remarkRehype from "remark-rehype"
import { unified } from "unified"
import * as v from "valibot"
import rehypeExternalLinks from "rehype-external-links"
import rehypeMermaid from "./rehype-mermaid-simple"
import { pluginCollapsibleSections } from "@expressive-code/plugin-collapsible-sections"
import { rehypeGithubAlerts, type IAlert } from "rehype-github-alerts"
import { rehypeEnhancedImages } from "./rehype-enhanced-images"
import type { ElementContent } from "hast"

const SerieSchema = v.object({
	id: v.string(),
	index: v.number()
})

const MarkdownMetadataSchema = v.object({
	title: v.string(),
	description: v.string(),
	keywords: v.optional(v.array(v.string())),
	serie: v.optional(SerieSchema),
	draft: v.optional(v.boolean())
})

const ProjectMetadataSchema = v.object({
	title: v.string(),
	description: v.string(),
	cover: v.optional(v.string()),
	link: v.optional(v.string()),
	repo: v.optional(v.string()),
	site: v.optional(v.string()),
	technologies: v.optional(v.array(v.string())),
	featured: v.optional(v.number()),
	about: v.optional(v.string())
})

export type BlogMetadata = v.InferOutput<typeof MarkdownMetadataSchema>
export type ProjectMetadata = v.InferOutput<typeof ProjectMetadataSchema>

export interface MarkdownMetadata {
	title: string
	description: string
	cover?: string
	keywords?: string[]
	serie?: {
		id: string
		index: number
	}
	draft?: boolean
	[key: string]: unknown
}

export interface ProcessedMarkdown {
	html: string
	metadata: MarkdownMetadata
	toc?: Record<string, unknown>
}

type MetadataType = "blog" | "project" | "none"

// Cache de metadados durante o build
const metadataCache = new Map<string, MarkdownMetadata>()

/**
 * Extrai apenas metadados do markdown (sem processar HTML)
 * Rápido e cacheável
 */
export function extractMetadata(
	content: string,
	type: MetadataType = "blog"
): MarkdownMetadata {
	const { data: metadata } = matter(content)

	if (type === "none") {
		return metadata as MarkdownMetadata
	}

	const schema =
		type === "blog" ? MarkdownMetadataSchema : ProjectMetadataSchema
	return v.parse(schema, metadata)
}

/**
 * Processa markdown completo com cache
 */
export async function processMarkdown(
	content: string,
	type: MetadataType = "blog",
	cacheKey?: string,
	slug?: string,
	images?: Record<string, unknown>
): Promise<ProcessedMarkdown> {
	// Usa cache se disponível
	if (cacheKey && metadataCache.has(cacheKey)) {
		const metadata = metadataCache.get(cacheKey)!
		// Ainda precisa processar HTML, mas metadados já estão validados
		const { content: markdownContent } = matter(content)
		const { html, toc } = await renderMarkdownToHtml(
			markdownContent,
			slug,
			images
		)
		return {
			html,
			metadata,
			toc
		}
	}

	const { data: metadata, content: markdownContent } = matter(content)

	if (type === "none") {
		const { html, toc } = await renderMarkdownToHtml(
			markdownContent,
			slug,
			images
		)
		return {
			html,
			metadata: metadata as MarkdownMetadata,
			toc
		}
	}

	const schema =
		type === "blog" ? MarkdownMetadataSchema : ProjectMetadataSchema
	const validatedMetadata = v.parse(schema, metadata)

	// Armazena no cache
	if (cacheKey) {
		metadataCache.set(cacheKey, validatedMetadata)
	}

	const { html, toc } = await renderMarkdownToHtml(
		markdownContent,
		slug,
		images
	)

	return {
		html,
		metadata: validatedMetadata,
		toc
	}
}

/**
 * Renderiza apenas HTML do markdown (sem validação de metadados)
 * Usado internamente para cache
 */
async function renderMarkdownToHtml(
	markdownContent: string,
	slug?: string,
	images?: Record<string, unknown>
): Promise<{ html: string; toc?: Record<string, unknown> }> {
	const processor = unified()
		.use(remarkParse)
		.use(remarkGfm)
		.use(remarkRehype, { allowDangerousHtml: true })
		.use(rehypeShiftHeading, { shift: 1 })
		.use(rehypeSlug)
		.use(withToc)
		.use(() => rehypeMermaid())
		.use(() =>
			rehypeGithubAlerts({
				build: (alertOptions: IAlert, originalChildren: ElementContent[]) => {
					const keyword = alertOptions.keyword.toLowerCase()
					const variantMap: Record<string, string> = {
						tip: "alert-info",
						success: "alert-success",
						important: "alert-warning",
						warning: "alert-warning",
						caution: "alert-error"
					}
					const variant = variantMap[keyword] || "alert-info"

					return {
						type: "element",
						tagName: "div",
						properties: { className: ["alert", variant], role: "alert" },
						children: [
							{
								type: "element",
								tagName: "div",
								properties: {},
								children: [...originalChildren]
							}
						]
					} as ElementContent
				}
			})
		)

	// Adicionar plugin de enhanced images se slug e images foram fornecidos
	if (slug && images) {
		processor.use(() => rehypeEnhancedImages(slug, images))
	}

	processor
		.use(rehypeAutolinkHeadings, {
			behavior: "prepend",
			properties: {
				className: ["anchor-link"],
				ariaHidden: true,
				tabIndex: -1
			},
			content: {
				type: "text",
				value: "#"
			}
		})
		.use(rehypeExternalLinks, { target: "_blank", rel: [] })
		.use(rehypeExpressiveCode, {
			themes: ["catppuccin-macchiato"],
			plugins: [
				ecTwoSlash(),
				pluginLineNumbers(),
				pluginCollapsibleSections(),
				pluginFileIcons()
			],
			defaultProps: {
				overridesByLang: {
					bash: {
						showLineNumbers: false
					}
				}
			}
		} as RehypeExpressiveCodeOptions)
		.use(rehypeStringify, { allowDangerousHtml: true })

	const file = await processor.process(markdownContent)
	const html = String(file)
	return { html, toc: file.data.toc as Record<string, unknown> | undefined }
}

/**
 * Limpa o cache de metadados (útil para testes)
 */
export function clearMetadataCache(): void {
	metadataCache.clear()
}
