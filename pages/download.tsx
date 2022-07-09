import { useState, useEffect } from 'react';
import { Card, Button, Loading, Alert, SEO } from '../components';
import { FaItchIo } from 'react-icons/fa';

export default function Home() {
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		setLoading(false);
	}, [])

	return (
		<>
            <SEO 
                title = "Pit Wall Client Download"
                url = "download"
                description = "Download the Pit Wall desktop app and start using the pit wall on your own streams today!"
            />

			<Loading loading = { loading } />

			<div id = "bg" className = {`dark background-c min-h-screen h-auto`}>
				{/* <Alert permaDismiss = {true} id = "no-drag" body = "Windows are no longer draggable due to it causing too many issues" /> */}
                <div className = "p-8">
                    <Button link = "https://lilspartan.itch.io/gabir-motors-pit-wall-telemetry-app" block = {false}> Download From Itch <FaItchIo className = "inline text-3xl" /> </Button>
                </div>
			</div>
		</>
	)
}