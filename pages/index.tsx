import type { NextPage } from "next"
import Image from "next/image"
import profilePic from "../public/me.jpeg"
import GithubIcon from "~icons/fa/github.jsx"
import LinkedinIcon from "~icons/fa/linkedin-square.jsx"
import EmailIcon from "~icons/fa/envelope.jsx"
import TelegramIcon from "~icons/fa/telegram.jsx"
import Icon from "../components/Icon"
import DefaultLayout from "../layouts/default"

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
      <h1 className="text-2xl font-bold mt-5">Vitor Daniel</h1>
      <h1 className="text-lg">Desenvolvedor</h1>

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
    </DefaultLayout>
  )
}

export default Home
