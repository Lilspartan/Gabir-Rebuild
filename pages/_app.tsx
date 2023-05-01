import '../styles/globals.css';
import 'movement.css';
import { Analytics } from '@vercel/analytics/react';
import Script from 'next/script'

function MyApp({ Component, pageProps }) {
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
            gtag('config', 'G-4G44T1DDKE', {
              page_path: window.location.pathname,
            });
          `,
          }}
      />
      <Component {...pageProps} />
      <Analytics />
    </>
  )
}

export default MyApp
