export interface BlogPostMetadata {
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

export interface ProjectMetadataBase {
  title: string
  description: string
  cover?: string
  link?: string
  repo?: string
  technologies: string[]
  featured?: boolean
  about?: string
  [key: string]: unknown
}
