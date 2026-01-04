declare global {
  interface BlogPostMetadata {
    title: string
    description: string
    cover: string
    keywords: string[]
    serie?: {
      id: string
      index: number
    }
    [key: string]: unknown
  }
}

declare module "*.md" {
  import type { ComponentType, SvelteComponent } from "svelte"

  export const metadata: BlogPostMetadata
  const component: ComponentType<SvelteComponent>
  export default component
}

export {}
