import '@/styles/globals.css'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return (<>
    <Component {...pageProps} />
    <style jsx global>
      {`
        body {
          font-family: 'Roboto', sans-serif;
        }
      `}
    </style>
  </>)
}
