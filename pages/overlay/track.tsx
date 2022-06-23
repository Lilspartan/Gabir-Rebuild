import { useState, useEffect } from 'react';
import { Session } from '../../utils/interfaces';
import classnames from 'classnames';
import io from 'socket.io-client';
import trackmaps from '../../public/trackmaps.json';

let socket;

const TrackOverlay = () => {
    const [session, setSession] = useState<Session>({
		flags: [
			
		],
		session: {
			number: 0,
			type: "LOADING",
			timeRemaining: 0,
			fastRepairs: 0,
			fastestLap: null,
		},
		track: {
		  name: "Unknown Track",
		  city: "Unknown City",
		  id: -1,
		  country: "Unknown Country",  
		  temperature: "N/A",
		  length: "N/A",
		},
		weather: {
			windSpeed: "N/A",
			temperature: "N/A",
			skies: "N/A"
		}
	})

    const socketInitializer = async () => {
		if (socket) return;
		socket = io("https://streaming.gabirmotors.com");

		socket.on('connect', () => {
			console.log('connected');
		})

		socket.on('standings_update', (data) => {
			let parsed = JSON.parse(data)

			setSession(parsed.sessionInfo)
		})
	}

	useEffect(() => {
		socketInitializer();
	}, [])

    return (
		<div className = {`h-auto flex flex-row justify-end`}>
			<div className = {`bg-[#222222cc] text-white px-8 py-4 rounded-lg flex flex-col transition duration-500 mt-4 mr-4`}>
				<h1 className = "font-extrabold text-3xl">{ session.track.name }</h1>
				<h2 className = "text-center font-bold text-xl">{ session.track.city }, { session.track.country }</h2>
				<h3 className = "mt-4 text-xl text-center font-bold mb-1">https://pitwall.gabirmotors.com</h3>
				{/* <img src={`${trackmaps[session.track.id]}active.svg`} className = "inline" /> */}
			</div>
		</div>
    )
}

export default TrackOverlay;