import mermaid from "isomorphic-mermaid"
import svgToDataURI from "mini-svg-data-uri"
import { toText } from "hast-util-to-text"
import { visitParents } from "unist-util-visit-parents"
import type { Node } from "unist"

interface CodeInstance {
	diagram: string
	ancestors: Array<Record<string, unknown>>
}

export interface RehypeMermaidOptions {
	strategy?: "img-svg" | "inline-svg"
}

/**
 * A rehype plugin to render Mermaid diagrams
 */
export default function rehypeMermaid(options?: RehypeMermaidOptions) {
	const strategy = options?.strategy || "inline-svg"

	try {
		mermaid.initialize({
			startOnLoad: false,
			securityLevel: "strict",
			htmlLabels: false,
			theme: "dark",
			themeVariables: {
				background: "#181825",
				primaryColor: "#1e2030",
				primaryTextColor: "#cdd6f4",
				primaryBorderColor: "#8aadf4",
				secondaryColor: "#1e2030",
				tertiaryColor: "#1e2030",
				lineColor: "#8aadf4",
				timelineColor: "#8aadf4",
				textColor: "#cdd6f4",
				fontFamily:
					'"Inter", "SF Pro Text", "Segoe UI", system-ui, -apple-system, sans-serif',
				nodeBorder: "#8aadf4",
				clusterBkg: "#181825",
				clusterBorder: "#8aadf4",
				edgeLabelBackground: "#1e2030",
				actorTextColor: "#cdd6f4",
				actorLineColor: "#8aadf4",
				actorBorder: "#8aadf4"
			}
		})
	} catch {
		// already initialized
	}

	return async (ast: Node) => {
		const instances: CodeInstance[] = []

		visitParents(
			ast,
			"element",
			(
				node: Record<string, unknown>,
				ancestors: Array<Record<string, unknown>>
			) => {
				// Check if it's a code block with language-mermaid
				if (node.tagName === "code") {
					const properties = node.properties as
						| Record<string, unknown>
						| undefined
					let className = properties?.className
					if (typeof className === "string") {
						className = className.split(" ")
					}

					if (
						Array.isArray(className) &&
						className.includes("language-mermaid")
					) {
						instances.push({
							diagram: toText(node as unknown as Parameters<typeof toText>[0], {
								whitespace: "pre"
							}),
							ancestors: ancestors as Array<Record<string, unknown>>
						})
					}
				}
			}
		)

		if (!instances.length) {
			return
		}

		// Render all diagrams
		const results = await Promise.all(
			instances.map((instance) =>
				mermaid.render(
					"mermaid-" + Math.random().toString(36).slice(2, 9),
					instance.diagram
				)
			)
		)

		// Replace code blocks with rendered SVG
		for (const [index, instance] of instances.entries()) {
			const result = results[index]
			const { svg } = result

			let replacement: Record<string, unknown> | undefined

			if (strategy === "inline-svg") {
				replacement = {
					type: "raw",
					value: svg
				}
			} else {
				replacement = {
					type: "element",
					tagName: "img",
					properties: {
						src: svgToDataURI(svg),
						alt: "Mermaid diagram"
					},
					children: []
				}
			}

			const { ancestors } = instance
			const codeNode = ancestors.at(-1)!
			const preNode = ancestors.at(-2)!

			if (preNode && "children" in preNode && Array.isArray(preNode.children)) {
				const codeIndex = preNode.children.indexOf(codeNode)
				if (codeIndex !== -1) {
					preNode.children[codeIndex] = replacement
				}
			}
		}
	}
}
