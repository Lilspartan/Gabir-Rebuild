import '../styles/globals.css';
import 'movement.css';
import Script from 'next/script'
import { Loading } from '../components'
import { SpeedInsights } from "@vercel/speed-insights/next"

function MyApp({
  Component,
  pageProps: { ...pageProps },
}) {
  return (
    <>
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
      <SpeedInsights />
    </>
  )
}

export default MyApp