import { Feed } from "feed"
import type { Component } from "svelte"
import { render } from "svelte/server"
import { getFileDates } from "$lib/server/utils"

export const prerender = true

export async function GET() {
  const posts = import.meta.glob("/src/content/posts/*.md", { eager: true })
  const siteUrl = "https://vitordaniel.com"

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
    title: "Vitor Daniel's Blog",
    description: "Personal blog of Vitor Daniel",
    id: siteUrl,
    link: siteUrl,
    language: "pt-BR",
    image: `${siteUrl}/favicon.png`,
    favicon: `${siteUrl}/favicon.ico`,
    copyright: `All rights reserved ${new Date().getFullYear()}, Vitor Daniel`,
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
      id: `${siteUrl}/blog/posts/${post.slug}`,
      link: `${siteUrl}/blog/posts/${post.slug}`,
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
      image: post.cover.startsWith("$lib")
        ? `${siteUrl}${post.cover.replace("$lib", "/src/lib")}`
        : post.cover
    })
  }

  return new Response(feed.atom1(), {
    headers: {
      "Content-Type": "application/atom+xml"
    }
  })
}
