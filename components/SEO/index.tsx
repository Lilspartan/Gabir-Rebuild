import Head from 'next/head';

type Props = {
    title?: string,
    description?: string,
    url?: string,
}

const index = ({
    title = "Gabir Motors Pit Wall",
    description = "Harness your inner Pit Crew using this handy tool to keep up with all the car stats your heart desires in real time! Powered by Gabir Motors, the world's premiere pretend Motorsports Company.",
    url = ""
}: Props) => {
  return (
    <Head>
        <title>{ title }</title>
        <link rel="icon" href="/small_logo.png" />
        <link rel="stylesheet" href="https://use.typekit.net/mzl0gsb.css" />

        <meta name="author" content = "Gabe Krahulik" />
        <meta name="keywords" content="Gabir Motors, Penny Arcade, Iracing, pit wall, racing, motorsports" />

        <meta name="title" content={ title } />
        <meta name="description" content={ description } />

        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://pitwall.gabirmotors.com/${url}`} />
        <meta property="og:title" content={ title } />
        <meta property="og:description" content={ description } />
        <meta property="og:image" content="/header.jpg" />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={`https://pitwall.gabirmotors.com/${url}`} />
        <meta property="twitter:title" content={ title } />
        <meta property="twitter:description" content={ description } />
        <meta property="twitter:image" content="/header.jpg"></meta>
    </Head>
  )
}

export default index