import type { AppProps } from "next/app"
import { ThemeProvider } from "next-themes"
import "windi.css"
import { useEffect, useState } from "react"

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class">
      <Component {...pageProps} />
    </ThemeProvider>
  )
}

export default MyApp
