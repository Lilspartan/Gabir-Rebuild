import '../styles/globals.css';
import 'movement.css';
import Script from 'next/script'
import { SessionProvider } from "next-auth/react"

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
      <Component {...pageProps} />
    </SessionProvider>
  )
}

export default MyApp
