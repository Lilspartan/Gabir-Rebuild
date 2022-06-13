import { useState, useEffect } from 'react';
import Draggable from 'react-draggable';
import { Driver, Session, Connection } from '../utils/interfaces';
import { DriverCard, Card, ChatCard, StreamCard, ConnectionCard } from '../components';
import classnames from 'classnames';
import io from 'socket.io-client';
import Head from 'next/head'
let socket;
let connectionTimeout;

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
				lapsCompleted: 0 ,
				fastRepairsUsed: 0,
			},
			carData: {
				trackSurface: "NotInWorld",
				steer: 0,
				rpm: 0,
				gear: 0
			},
			lapTimes: {
				last: 0,
				best: { time: 0, lap: 0 }
			}, 
			flags: []
		}
	])
	const [highlightedDriver, setHighlightedDriver] = useState<Driver | null>(null);
	const [highlightedDriverIndex, setHighlightedDriverIndex] = useState<number | null>(null);
	const [displayType, setDisplayType] = useState("Leader")
	const [connection, setConection] = useState<Connection>("connecting");
	const [session, setSession] = useState<Session>({
		flags: [],
		session: {
			number: 0,
			type: "PRACTICE",
			timeRemaining: 0,
			fastRepairs: 0,
			fastestLap: {
				CarIdx: -1,
				FastestLap: -1,
				FastestTime: -1,
			},
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

	let width = typeof window !== "undefined" && window.innerWidth <= 900;

	const socketInitializer = async () => {
		if (socket) return;
		socket = io("https://streaming.gabirmotors.com");

		socket.on('connect', () => {
			console.log('connected');
		})

		socket.on('standings_update', (data) => {
			setConection("connected")
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

			clearTimeout(connectionTimeout);
			connectionTimeout = setTimeout(() => {
				console.log(drivers)
				if (drivers.length <= 1) setConection("disconnected")
			}, 5000)
		})
	}

	useEffect(() => {
		drivers.forEach((d) => {
			if (d.carIndex === highlightedDriverIndex) {
				return setHighlightedDriver(d);
			}
		})
	}, [drivers])

	useEffect(() => {
		socketInitializer();

		setTimeout(() => {
			if (drivers.length <= 1) setConection("disconnected")
		}, 25000)
	}, [])

	useEffect(() => {
		if (session.flags.includes("Checkered")) {
			setFlag("Checkered Flag");
			setFlagColor([
				"#ffffff",
				"#000000"
			]);
		} else if (session.flags.includes("White")) {
			setFlag("Final Lap");
			setFlagColor([
				"#ffffffaa",
				"#000000"
			]);
		} else if (session.flags.includes("Green")) {
			setFlag("Green Flag");
			setFlagColor([
				"#00ff00",
				"#000000"
			]);
		} else if (session.flags.includes("OneLapToGreen")) {
			setFlag("One Lap to Green");
			setFlagColor([
				"#00ff00aa",
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
		<div className = "background min-h-screen h-auto">
			<div className = "text-white flex flex-col-reverse lg:flex-row justify-center">
				<Head>
					<title>Gabir Motors Pit Wall</title>
					<link rel="icon" href="/small_logo.png" />
					<link rel="stylesheet" href="https://use.typekit.net/mzl0gsb.css" />
				</Head>
				<div id="left">
					<ConnectionCard connection = {connection} />
					<Card id = "standings-card" title = {`Race Standings | ${(session.session.type === "PRACTICE" ? "Practicing" : (
							session.session.type === "QUALIFY" ? "Qualifying" : "Racing"
						))}`}>
						<table className = "">
							<thead>
								<tr>
									<th></th>
									<th></th>
									<th></th>
								</tr>
							</thead>

							<tbody>
								{drivers.map((d, i) => {
									// let isFastestLap = (session.session.fastestLap !== null && d.carIndex === session.session.fastestLap.CarIdx);
									let displayTime = "";
									if (displayType === "Interval") {
										if (i === 0 && session.session.type === "RACE") displayTime = "INTERVAL";
										else if (i !== 0) displayTime = (d.raceData.f2Time - drivers[i - 1].raceData.f2Time).toFixed(3);
										else displayTime = d.raceData.f2Time.toFixed(3);
									} else {
										if (i === 0 && session.session.type === "RACE") displayTime = "LEADER";
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
											<td className = "px-6 py-1">
												<a onClick = {() => {
													setHighlightedDriverIndex(d.carIndex);
													setHighlightedDriver(d);
													console.log(d.carIndex)
												}} className = "block cursor-pointer">
													{ d.name }
												</a>	
											</td>
											<td>{ displayTime }</td>
										</tr>
									)
								})}
							</tbody>
						</table>

						{ drivers.length > 1 ? (
							<a className = "block text-center cursor-pointer border-2 border-white px-4 py-2 rounded-lg transition duration-500 hover:bg-white hover:text-black mt-8" onClick = {() => {
								if (displayType === "Interval") setDisplayType("Leader");
								else setDisplayType("Interval");
							}}>Display Mode: { displayType }</a>
						) : ""}
					</Card>

					<Card title = "Debug">
						<pre>{ JSON.stringify({flags:session.flags,highlightedDriver}, null, 4) }</pre>
					</Card>
				</div>
				<div id="right" className = "flex flex-col grow-0">
					<div id="innerright" className = "flex flex-col-reverse md:flex-row justify-evenly">
						<div>
							<ChatCard />

							<Card id = "welcome-card" title = "Welcome!">
								<h1 className = "font-bold text-center text-xl">Welcome to the</h1>
								<h1 className = "font-bold text-center text-5xl acumin">GABIR MOTORS PIT WALL</h1>
								<img src="https://i.gabirmotors.com/assets/other/pit_wall.png" alt="Gabir Motors Logo" className = "w-64 m-auto mt-6"/>
							</Card>
						</div>
						
						<div>
							<Card title = "Location">
								<h1 className = "font-bold text-center text-xl">{ session.track.name }</h1>
								<h2 className = "text-center text-lg">{ session.track.city }, { session.track.country }</h2>
							</Card>

							<Card title = "Race Info">
								<span className = "font-bold">Time Remaining: <span className = "font-normal">{ new Date(session.session.timeRemaining * 1000).toISOString().substr(11, 8) }</span></span><br />
								<span className = "font-bold">Quick Repairs: <span className = "font-normal">{ session.session.fastRepairs }</span></span><br />
								<span className = "font-bold">Track Length: <span className = "font-normal">{ session.track.length }</span></span><br />
								<span className = "font-bold">Lap: <span className = "font-normal">{ drivers[0].raceData.lap }</span></span><br />
							</Card>

							<Card title = "Weather">
								<span className = "font-bold">Skies: <span className = "font-normal">{ session.weather.skies }</span></span><br />
								<span className = "font-bold">Wind: <span className = "font-normal">{ session.weather.windSpeed }</span></span><br />
								<span className = "font-bold">Track Temperature: <span className = "font-normal">{ session.track.temperature }</span></span><br />
								<span className = "font-bold">Air Temperature: <span className = "font-normal">{ session.weather.temperature }</span></span><br />
							</Card>

							<Draggable handle = ".handle" bounds = ".background" disabled = {width} grid = {[5, 5]}>
								<div id = "controls" className = "flex flex-col">
									<div className = {`mx-4 handle block p-4 mt-8 bg-[#222222ff] ${flag !== "" ? "rounded-t-lg" : "rounded-lg"} cursor-move1`}>
										<h1 className = "font-bold">Flags</h1>
									</div>
									<div id = "flagSection" style = {{
										backgroundColor: flagColor[0],
										color: flagColor[1],
									}} className = {`mx-4 px-24 rounded-b-lg font-bold text-2xl text-center ${flag !== "" ? "py-12" : ""}`}> 
										{ flag }
									</div>
								</div>
							</Draggable>
						</div>
					</div>
					<div>
						<DriverCard driver = { highlightedDriver } session = { session }/>
						<StreamCard />
					</div>
				</div>
			</div>
		</div>
	)
}