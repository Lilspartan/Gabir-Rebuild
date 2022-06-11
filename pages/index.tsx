import { useState, useEffect } from 'react';
import { Driver, Session } from '../utils/interfaces';
import classnames from 'classnames';
import io from 'socket.io-client';
import Head from 'next/head'
let socket;

export default function Home() {
	const [drivers, setDrivers] = useState<Driver[]>([
		{ 
			carIndex: 0, 
			name: "Waiting to Recieve Standings...", 
			userID: 0, 
			carNumber: "0", 
			classID: 0, 
			isPaceCar: false,
			raceData: { 
				position: 1, 
				onPitRoad: true, 
				class: 0, 
				f2Time: 0, 
				lap: 1, 
				lapsCompleted: 0 } 
		}
	])
	const [firstPlaceLaps, setFirstPLaceLaps] = useState(0);
	const [displayType, setDisplayType] = useState("Leader")
	const [session, setSession] = useState<Session>({
		flags: [],
		session: {
			number: 0,
			type: "PRACTICE",
			timeRemaining: 0,
			fastRepairs: 0,
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
	const [flag, setFlag] = useState("");
	const [flagColor, setFlagColor] = useState([
		"#00000000",
		"#00000000"
	]);

	const socketInitializer = async () => {
		if (socket) return;
		socket = io("https://streaming.gabirmotors.com");

		socket.on('connect', () => {
			console.log('connected');
		})

		socket.on('standings_update', (data) => {
			let newDrivers = [];
			let parsed = JSON.parse(data)

			let _d = parsed.sessionRacers.sort((a, b) => {
				return a.raceData.position - b.raceData.position;
			})

			setSession(parsed.sessionInfo)
			
			_d.forEach(d => {
				if (d.raceData.position !== 0) newDrivers.push(d);
			})
			
			if (newDrivers.length) setDrivers(newDrivers);

			setFirstPLaceLaps(drivers[0]?.raceData.lapsCompleted || 0);
		})
	}

	useEffect(() => {
		socketInitializer();
	}, [])

	useEffect(() => {
		if (session.flags.includes("Green")) {
			setFlag("Green Flag");
			setFlagColor([
				"#00ff00",
				"#000000"
			]);
		} else if (session.flags.includes("OneLapToGreen")) {
			setFlag("One Lap to Green");
			setFlagColor([
				"#00ff00",
				"#000000"
			]);
		} else if (session.flags.includes("Checkered")) {
			setFlag("Checkered Flag");
			setFlagColor([
				"#ffffff",
				"#000000"
			]);
		} else if (session.flags.includes("CautionWaving")) {
			setFlag("Caution Thrown");
			setFlagColor([
				"#ffff00aa",
				"#000000"
			]);
		} else if (session.flags.includes("Caution")) {
			setFlag("Caution");
			setFlagColor([
				"#ffff00",
				"#000000"
			]);
		} else {
			setFlag("");
			setFlagColor([
				"#00000000",
				"#00000000"
			]);
		}
	}, [session])

	return (
		<div className = "text-white flex flex-col lg:flex-row justify-center">
			<Head>
			<	link rel="stylesheet" href="https://use.typekit.net/mzl0gsb.css" />
			</Head>
			<div id="left" className = "px-10 py-8 m-4 rounded-lg bg-[#222222aa]">
				<h1 className = "text-center text-2xl font-bold">Race Standings</h1>
				<h1 className = "text-center mb-4">{ (session.session.type === "PRACTICE" ? "Currently in Practice" : (
					session.session.type === "QUALIFY" ? "Currently Qualifying" : "Currently Racing!"
				)) }</h1>
				<table className = "">
					<thead>
						<tr>
							<th></th>
							<th></th>
							<th></th>
						</tr>
					</thead>

					<tbody>
						{ (session.flags.includes("Caution") || session.flags.includes("CautionWaving")) ? (
							<tr className = "font-bold">
								<td className = "px-4"></td>
								<td className = "px-6 py-1">PACE CAR</td>
								<td></td>
							</tr>
						) : "" }
						{drivers.map((d, i) => {
							let displayTime = "";
							if (displayType === "Interval") {
								if (i === 0) displayTime = "INTERVAL";
								else displayTime = (d.raceData.f2Time - drivers[i - 1].raceData.f2Time).toFixed(3);
							} else {
								if (i === 0) displayTime = "LEADER";
								else {
									displayTime = (d.raceData.f2Time).toFixed(3);
								}
							}

							let minutes = 0;
							if (!isNaN(Number(displayTime))) {
								let _seconds = Number(displayTime);
								let _tempSeconds = _seconds;
								_seconds = _seconds % 60;
								minutes = (_tempSeconds - _seconds) / 60;
								displayTime = `${displayType === "Interval" ? "" : ""} ${(minutes > 0 ? minutes + ":" : "")}${(_seconds < 10 ? (minutes > 0 ? "0" : "") + _seconds.toFixed(3) : _seconds.toFixed(3))}`
							}
							
							return (
								<tr className = {classnames([
									(d.raceData.onPitRoad ? "text-gray-400" : "")
								])}>
									<td className = "px-4">{ d.raceData.position }</td>
									<td className = "px-6 py-1">{ d.name }</td>
									<td>{ displayTime }</td>
								</tr>
							)
						})}
					</tbody>
				</table>
			</div>
			<div id="right" className = "flex flex-col">
				<div id="innerright" className = "px-10 py-8 flex flex-col md:flex-row justify-evenly">
					<div id = "controls" className = "md:pr-10">
						<div id = "flagSection" style = {{
							backgroundColor: flagColor[0],
							color: flagColor[1],
						}} className = {`${flag !== "" ? "px-24 py-12 rounded-lg font-bold text-2xl text-center" : ""} mb-8`}> 
							{ flag }
						</div>

						<a className = "cursor-pointer border-2 border-white px-4 py-2 rounded-lg transition duration-500 hover:bg-white hover:text-black" onClick = {() => {
							if (displayType === "Interval") setDisplayType("Leader");
							else setDisplayType("Interval");
						}}>Display Mode: { displayType }</a><br /><br />
					</div>
					
					{/* <pre>{ JSON.stringify(session.flags, null, 4) }</pre> */}

					<div id = "info" className = "md:pl-10">
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
				</div>
			</div>
		</div>
	)
}