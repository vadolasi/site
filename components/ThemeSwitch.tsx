import { FunctionComponent, useEffect, useState } from "react"
import { useTheme } from "next-themes"
import SunIcon from "~icons/fa-solid/sun"
import MoonIcon from "~icons/fa-solid/moon"

const ThemeSwitch: FunctionComponent = () => {
  const { theme, setTheme } = useTheme()

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return theme == "dark" ?
    <button className="border-0 outline-none fixed top-5 right-5 text-xl p-1" onClick={() => setTheme("light")}>
      <MoonIcon />
    </button>
    : <button className="border-0 outline-none fixed top-5 right-5 text-xl p-1" onClick={() => setTheme("dark")}>
      <SunIcon />
    </button>
}

export default ThemeSwitch
