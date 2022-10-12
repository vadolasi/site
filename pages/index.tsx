import type { NextPage } from "next"
import Image from "next/image"
import profilePic from "../public/me.jpeg"
import GithubIcon from "~icons/fa/github.jsx"
import LinkedinIcon from "~icons/fa/linkedin-square.jsx"
import EmailIcon from "~icons/fa/envelope.jsx"
import TelegramIcon from "~icons/fa/telegram.jsx"
import Icon from "../components/Icon"
import DefaultLayout from "../layouts/default"
import Link from "next/link"

const Home: NextPage = () => {
  return (
    <DefaultLayout>
      <Image
        src={profilePic}
        alt="Picture of the author"
        width={200}
        height={200}
        placeholder="blur"
        className="rounded-full"
      />
      <h1 className="m-2 text-3xl lg:text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">Vitor Daniel</h1>
      <p className="font-light text-gray-500 sm:text-xl dark:text-gray-400 mb-8">Desenvolvedor</p>

      <div className="flex text-2xl mt-5 gap-1">
        <Icon link="https://github.com/vadolasi" text="Github">
          <GithubIcon />
        </Icon>
        <Icon link="https://www.linkedin.com/in/vitor-daniel-b288a5158" text="Linkedin">
          <LinkedinIcon />
        </Icon>
        <Icon link="mailto:vitor036daniel@gmail.com" text="Email">
          <EmailIcon />
        </Icon>
        <Icon link="https://t.me/vadolasi" text="Telegram">
          <TelegramIcon />
        </Icon>
      </div>

      <p className="mt-5 text-lg font-normal text-gray-500 sm:px-16 xl:px-48 dark:text-gray-400">Visite meu <Link href="/blog"><a className="font-medium text-blue-600 dark:text-blue-500 hover:underline">blog</a></Link></p>
    </DefaultLayout>
  )
}

export default Home
