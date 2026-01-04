import { getFileDates } from "$lib/server/utils"
import type { PageServerLoad } from "./$types"

export const load: PageServerLoad = async ({ params }) => {
  const relativePath = `/src/content/posts/${params.slug}.md`
  const dates = await getFileDates(relativePath)

  return {
    dates
  }
}
