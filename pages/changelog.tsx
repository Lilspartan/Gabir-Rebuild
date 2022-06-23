import { useState, useEffect } from 'react';
import { DriverCard, Card, ChatCard, StreamCard, ConnectionCard, NotesCard, Button, Loading, Alert } from '../components';
import Head from 'next/head'

export default function Home() {
	const [loading, setLoading] = useState(false);
	const [theme, setTheme] = useState( {
		theme: "dark",
		backgroundImage: "https://i.gabirmotors.com/assets/other/carbon_fiber.jpg",
		backgroundColor: "#000000",
		useMetric: false
	})

    useEffect(() => {
		document.getElementById("bg").style.backgroundImage = `url(${theme.backgroundImage})`;
		document.getElementById("bg").style.backgroundColor = `${theme.backgroundColor}`;
	}, [theme])

	return (
		<>
			<Loading loading = { loading } />

			<div id = "bg" className = {`${theme.theme === "dark" ? "dark" : ""} background min-h-screen h-auto`}>
				{/* <Alert permaDismiss = {true} id = "no-drag" body = "Windows are no longer draggable due to it causing too many issues" /> */}

				<div className = "text-black dark:text-white flex flex-col-reverse lg:flex-row justify-center">
					<Head>
						<title>GM Pit Wall Changelog</title>
						<link rel="icon" href="/small_logo.png" />
						<link rel="stylesheet" href="https://use.typekit.net/mzl0gsb.css" />

						<meta name="title" content="GM Pit Wall Changelog" />
						<meta name="description" content="Keep up with what's new on the Pit Wall" />

						<meta property="og:type" content="website" />
						<meta property="og:url" content="https://pitwall.gabirmotors.com/changelog" />
						<meta property="og:title" content="GM Pit Wall Changelog" />
						<meta property="og:description" content="Keep up with what's new on the Pit Wall" />
						<meta property="og:image" content="/header.jpg" />

						<meta property="twitter:card" content="summary_large_image" />
						<meta property="twitter:url" content="https://pitwall.gabirmotors.com/changelog" />
						<meta property="twitter:title" content="Gabir Motors Pit Wall" />
						<meta property="twitter:description" content="Keep up with what's new on the Pit Wall" />
						<meta property="twitter:image" content="/header.jpg"></meta>
					</Head>
					<div className = "flex flex-col w-full pl-4">
                        <div className = "p-4">
                            <h1 className = "text-3xl font-bold">V1.1 - Overlays</h1>
                            <h2 className = "text-xl italic font-bold">June 23, 2022</h2>

                            <p></p>
                        </div>
                        
                        <div className = "p-4">
                            <h1 className = "text-3xl font-bold">V1.0 - Initial Release</h1>
                            <h2 className = "text-xl italic font-bold">June 16, 2022</h2>
                        </div>
                    </div>
				</div>
			</div>
		</>
	)
}