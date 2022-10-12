import type { NextPage } from "next"
import Article from "../../components/Article"
import Search from "../../components/Search"
import Pagination from "../../components/Pagination"
import DefaultLayout from "../../layouts/default"

const BlogIndex: NextPage = () => {
  return (
    <DefaultLayout>
      <section className="bg-white dark:bg-gray-900 min-h-screen w-full">
        <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
          <div className="mx-auto max-w-screen-sm text-center lg:mb-16 mb-8">
            <h2 className="mb-4 text-3xl lg:text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">Our Blog</h2>
            <p className="font-light text-gray-500 sm:text-xl dark:text-gray-400 mb-8">We use an agile approach to test assumptions and connect with the needs of your audience early and often.</p>
            <Search />
          </div>
          <div className="grid gap-8 lg:grid-cols-2">
            <Article name="Teste" description="Lorem ipsum at dolor amet" tags={["article", "teste", "fasfads"]} slug="fsaasdfadf" publishDate={new Date("2022-01-17")} />
          </div>
        </div>
        <Pagination />
      </section>
    </DefaultLayout>
  )
}

export default BlogIndex
