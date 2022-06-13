import { useState, useEffect } from 'react';
import { Session } from '../../utils/interfaces';
import { DriverCard, Card } from '../../components';
import classnames from 'classnames';
import io from 'socket.io-client';
let socket;

const TrackOverlay = () => {
    const [session, setSession] = useState<Session>({
		flags: [],
		session: {
			number: 0,
			type: "PRACTICE",
			timeRemaining: 0,
			fastRepairs: 0,
			fastestLap: null,
		},
		track: {
		  name: "Unkown Track",
		  city: "Unknown City",
		  country: "Unknown Country",  
		  temperature: "N/A",
		  length: "N/A",
		},
		weather: {
			windSpeed: "N/A",
			temperature: "N/A",
			skies: "Sunny"
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
        <div className = "background min-h-screen h-auto p-12">
            <h1 className = "font-bold text-center text-xl">{ session.track.name }</h1>
            <h2 className = "text-center text-lg">{ session.track.city }, { session.track.country }</h2>

            <h1 className = "text-center font-bold my-2">Time Remaining: <span className = "font-normal">{ new Date(session.session.timeRemaining * 1000).toISOString().substr(11, 8) }</span></h1>
            <hr className = "m-4"/>
            <span className = "font-bold">Weather: <span className = "font-normal">{ session.weather.skies }</span></span><br />
            <span className = "font-bold">Wind: <span className = "font-normal">{ session.weather.windSpeed }</span></span><br />
            <span className = "font-bold">Track Temperature: <span className = "font-normal">{ session.track.temperature }</span></span><br />
            <span className = "font-bold">Air Temperature: <span className = "font-normal">{ session.weather.temperature }</span></span><br />
            <span className = "font-bold">Track Length: <span className = "font-normal">{ session.track.length }</span></span><br />
            <span className = "font-bold">Quick Repairs: <span className = "font-normal">{ session.session.fastRepairs }</span></span><br />
        </div>
    )
}

export default TrackOverlay;