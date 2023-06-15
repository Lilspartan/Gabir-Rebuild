import '../styles/globals.css';
import 'movement.css';
import Script from 'next/script'
import { SessionProvider, useSession } from "next-auth/react"
import { Loading } from '../components'

function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      <Script strategy="afterInteractive" src="https://www.googletagmanager.com/gtag/js?id=G-4G44T1DDKE"/>
      <Script
        id='google-analytics'
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-4G44T1DDKE');
          `,
          }}
      />
      {Component.auth ? ( 
        <Auth>
          <Component {...pageProps} />
        </Auth>
      ) : (
        <Component {...pageProps} />
      ) }
    </SessionProvider>
  )
}

function Auth({ children }) {
  // if `{ required: true }` is supplied, `status` can only be "loading" or "authenticated"
  const { status } = useSession({ required: true })

  if (status === "loading") {
    return <div className = "text-white">Loading...</div>
  }

  return children
}

export default MyApp