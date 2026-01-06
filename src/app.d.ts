declare global {
  namespace App {
    interface Platform {
      env: Env
      cf: CfProperties
      ctx: ExecutionContext
    }
  }
}

declare module "$content/*.md" {
  import type { SvelteComponent } from "svelte"

  export default class Comp extends SvelteComponent {}
}

declare module "$content/posts/*.md" {
  import type { SvelteComponent } from "svelte"
  import type { BlogPostMetadata } from "./content/types"
  import type { Toc } from "@stefanprobst/rehype-extract-toc"

  export default class Comp extends SvelteComponent {}

  export const metadata: BlogPostMetadata & {
    toc: Toc
    readingTime: { text: string; minutes: number; time: number; words: number }
  }
}
