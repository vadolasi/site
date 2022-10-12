import Link from "next/link"
import { FunctionComponent } from "preact"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import "dayjs/locale/pt-br"

dayjs.extend(relativeTime)

interface Props {
  name: string
  description: string
  slug: string
  tags: string[]
  publishDate: Date
}

const Article: FunctionComponent<Props> = ({ name, description, slug, tags, publishDate }) => {
  return (
    <article className="p-6 bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
      <div className="flex justify-between items-center mb-5 text-gray-500">
        <ul className="inline-flex">
          {tags.map(tag => (
            <li key={tag}>
              <span className="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800">{tag}</span>
            </li>
          ))}
        </ul>
        <span className="text-sm">{dayjs().locale("pt-br").to(publishDate)}</span>
      </div>
      <h2 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"><a href="#">{name}</a></h2>
      <p className="mb-5 font-light text-gray-500 dark:text-gray-400">{description}</p>
      <div className="flex justify-between items-center">
        <Link href={`/blog/${slug}`}>
          <a className="inline-flex items-center font-medium text-primary-600 dark:text-primary-500 hover:underline">
            Ler mais
            <svg className="ml-2 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"></path>
            </svg>
          </a>
        </Link>
      </div>
    </article>
  )
}

export default Article
