import type { Handle } from "@sveltejs/kit"
import acceptLanguage from "accept-language"

export const handle: Handle = async ({ event, resolve }) => {
  event.locals.navigationId = crypto.randomUUID()

  const { pathname } = event.url
  if (
    pathname === "/" ||
    pathname === "/about" ||
    pathname.startsWith("/blog")
  ) {
    const promise = event
      .fetch("https://cloud.umami.is/api/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "User-Agent": event.request.headers.get("user-agent") || ""
        },
        body: JSON.stringify({
          website: "be7d11a3-4142-4fcf-ab51-20d004a273bb",
          url: event.url.href,
          referrer: event.request.headers.get("referer") || undefined,
          language:
            acceptLanguage.get(event.request.headers.get("accept-language")) ||
            undefined,
          hostname: event.url.hostname
        })
      })
      .catch(() => {})

    if (event.platform?.ctx?.waitUntil) {
      event.platform.ctx.waitUntil(promise)
    }
  }

  const response = await resolve(event)
  return response
}
