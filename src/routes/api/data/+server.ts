import type { RequestHandler } from "./$types"

export const POST: RequestHandler = async ({ request, fetch }) => {
  const body = await request.json()

  const res = await fetch("https://cloud.umami.is/api/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "User-Agent": request.headers.get("user-agent") || ""
    },
    body: JSON.stringify({
      payload: {
        website: "be7d11a3-4142-4fcf-ab51-20d004a273bb",
        url: request.headers.get("referer") ?? body.url,
        referrer: body.referrer,
        language: request.headers.get("accept-language") ?? body.language,
        hostname: request.headers.get("origin") ?? body.hostname,
        screen: body.screen,
        title: body.title,
        id: body.visitorId
      },
      type: body.event === "identity" ? "identify" : "event"
    })
  })

  return new Response(null, { status: res.status })
}
