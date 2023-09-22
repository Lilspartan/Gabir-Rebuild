import Head from 'next/head';

type Props = {
    title?: string,
    description?: string,
    url?: string,
    headerImg?: string,
}

const index = ({
    title = "Gabir Motors",
    description = "The world's premiere, pretend Motorsports Company. Proud sponsor of Mike Racecar and the Penny Arcade iRacing league.",
    url = "",
    headerImg = "/header.jpg"
}: Props) => {
  return (
    <Head>
        <title>{ title }</title>
        <link rel="icon" href="/small_logo.png" />
        <link rel="stylesheet" href="https://use.typekit.net/mzl0gsb.css" />

        <meta name="author" content = "Gabe Krahulik" />
        <meta name="keywords" content="Gabir Motors, Penny Arcade, Iracing, racing, motorsports" />

        <meta name="title" content={ title } />
        <meta name="description" content={ description } />

        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://gabirmotors.com/${url}`} />
        <meta property="og:title" content={ title } />
        <meta property="og:description" content={ description } />
        <meta property="og:image" content={ headerImg } />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={`https://gabirmotors.com/${url}`} />
        <meta property="twitter:title" content={ title } />
        <meta property="twitter:description" content={ description } />
        <meta property="twitter:image" content={ headerImg }></meta>
        <meta property="twitter:site" content="@GabirMotors" />
    </Head>
  )
}

export default index