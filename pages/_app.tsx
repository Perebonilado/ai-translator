import type { AppProps } from 'next/app'
import "../config/tailwind/main.css"
import "../config/tailwind/chrome-bug.css"

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default MyApp
