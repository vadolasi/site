import { visit } from "unist-util-visit"
import type { Node } from "unist"

interface ImageModule {
	default: {
		img: {
			src: string
			w: number
			h: number
		}
		sources: {
			avif: string
			webp: string
		}
	}
}

interface HastElement extends Node {
	type: "element"
	tagName: string
	properties?: Record<string, unknown>
	children?: HastElement[]
}

interface HastNode extends Node {
	type: string
	tagName?: string
	properties?: Record<string, unknown>
	children?: HastNode[]
	value?: string
}

/**
 * Plugin rehype para processar imagens inline do markdown
 * e substituir por elementos picture com imagens enhanced
 */
export function rehypeEnhancedImages(
	slug: string,
	images: Record<string, unknown>
) {
	return (tree: Node) => {
		visit(tree, "element", (node: HastElement) => {
			if (node.tagName === "img" && typeof node.properties?.src === "string") {
				const src = node.properties.src as string

				// Só processar imagens relativas (./)
				if (!src.startsWith("./")) {
					return
				}

				// Construir o caminho da imagem
				const imageName = src.replace("./", "")
				const imagePath = `/src/content/posts/${slug}/${imageName}`

				// Procurar a imagem enhanced correspondente
				const imageModule = images[imagePath] as ImageModule | undefined

				if (!imageModule) {
					// Se não encontrar imagem enhanced, deixar como está
					console.warn(`Imagem não encontrada ou não processada: ${imagePath}`)
					return
				}

				const { img, sources } = imageModule.default
				const alt = (node.properties.alt as string) || ""

				// Criar elemento picture com sources otimizadas
				const pictureNode: HastNode = {
					type: "element",
					tagName: "picture",
					properties: {},
					children: [
						// Source AVIF
						{
							type: "element",
							tagName: "source",
							properties: {
								type: "image/avif",
								srcset: sources.avif
							},
							children: []
						},
						// Source WebP
						{
							type: "element",
							tagName: "source",
							properties: {
								type: "image/webp",
								srcset: sources.webp
							},
							children: []
						},
						// Fallback img
						{
							type: "element",
							tagName: "img",
							properties: {
								src: img.src,
								alt,
								width: img.w,
								height: img.h,
								loading: "lazy",
								decoding: "async"
							},
							children: []
						}
					]
				}

				// Substituir o node img pelo picture
				Object.assign(node, pictureNode)
			}
		})
	}
}
