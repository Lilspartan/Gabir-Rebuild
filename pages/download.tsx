import { useState, useEffect } from 'react';
import { Card, Button, Loading, Alert, SEO } from '../components';
import { FaItchIo } from 'react-icons/fa';

export default function Home() {
	useEffect(() => {
		window.location.href = "https://github.com/Lilspartan/Pit-Wall-Electron-Client/releases/latest";
	}, [])

	return (
		<>
            <SEO 
                title = "Pit Wall Client Download"
                url = "download"
                description = "Download the Pit Wall desktop app and start using the pit wall on your own streams today!"
            />
		</>
	)
}