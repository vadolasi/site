import { Feed } from "feed"
import type { Component } from "svelte"
import { render } from "svelte/server"
import type { BlogPostMetadata } from "$content/types"
import { getFileDates } from "$lib/server/utils"

export const prerender = true

export async function GET() {
  const posts = import.meta.glob("/src/content/posts/*.md", { eager: true })
  const images = import.meta.glob(
    "/src/lib/assets/posts/*.{png,jpg,jpeg,webp}",
    {
      eager: true,
      import: "default"
    }
  )
  const siteUrl = "https://vitordaniel.is-a.dev"

  const sortedPosts = (
    await Promise.all(
      Object.entries(posts).map(async ([path, post]) => {
        const p = post as { metadata: BlogPostMetadata; default: Component }
        const slug = path.split("/").pop()?.replace(".md", "")
        const dates = await getFileDates(path)
        return { slug, ...p.metadata, content: p.default, dates }
      })
    )
  ).sort((a, b) => b.dates.updated.getTime() - a.dates.updated.getTime())

  const feed = new Feed({
    title: "Blog de Vitor Daniel",
    description: "Artigos sobre desenvolvimento web e tecnologia",
    id: siteUrl,
    link: siteUrl,
    language: "pt-BR",
    copyright: `${new Date().getFullYear()} Vitor Daniel. Todos os direitos reservados.`,
    updated: sortedPosts[0]?.dates.updated ?? new Date(),
    generator: "SvelteKit",
    feedLinks: {
      atom: `${siteUrl}/atom.xml`
    },
    author: {
      name: "Vitor Daniel",
      link: siteUrl
    }
  })

  for (const post of sortedPosts) {
    feed.addItem({
      title: post.title,
      id: `${siteUrl}/blog/${post.slug}`,
      link: `${siteUrl}/blog/${post.slug}`,
      description: post.description,
      author: [
        {
          name: "Vitor Daniel",
          link: siteUrl,
          email: "vitor036daniel@gmail.com",
          avatar:
            "https://gravatar.com/avatar/442d640bd2bfcac2e9b8afdb72742dc77fa0763f3cabe3e0cc3bf75bfcc14b5d?s=48"
        }
      ],
      content: render(post.content).body,
      date: post.dates.updated,
      published: post.dates.created,
      image: post.cover ? `${siteUrl}${images[post.cover]}` : undefined
    })
  }

  return new Response(feed.atom1(), {
    headers: {
      "Content-Type": "application/atom+xml"
    }
  })
}
