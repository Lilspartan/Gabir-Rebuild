import { useState, useEffect } from 'react';
import Draggable from 'react-draggable';
import { Driver, Session, Connection, DismissedCard, DriverData } from '../utils/interfaces';
import { DriverCard, Card, ChatCard, StreamCard, ConnectionCard, NotesCard, Button, Loading } from '../components';
import convertToImperial from '../utils/convertToImperial';
import classnames from 'classnames';
import io from 'socket.io-client';
import Head from 'next/head'

let socket;
let connectionTimeout;

export default function Home() {
	const [loading, setLoading] = useState(true);
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
		flags: [
			
		],
		session: {
			number: 0,
			type: "LOADING",
			timeRemaining: 0,
			fastRepairs: 0,
			fastestLap: {
				CarIdx: -1,
				FastestLap: -1,
				FastestTime: -1,
			},
		},
		track: {
		  name: "Unknown Track",
		  city: "Unknown City",
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
	const [flag, setFlag] = useState("");
	const [flagColor, setFlagColor] = useState([
		"#00000000",
		"#00000000"
	]);
	const [dismissedCards, setDismissedCards] = useState<DismissedCard[]>([]);
	const [channel, setChannel] = useState("pennyarcade");
	const [driverData, setDriverData] = useState<DriverData>({
		tiresRemaining: { left: { front: 0, rear: 0 }, right: { front: 0, rear: 0 } },
		fuel: { remaining: 0, percent: 0 }
	});

	const [theme, setTheme] = useState( {
		theme: "dark",
		backgroundImage: "https://i.gabirmotors.com/assets/other/carbon_fiber.jpg",
		backgroundColor: "#000000",
		useMetric: false
	})

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

			setSession(parsed.sessionInfo);
			setDriverData(parsed.driverData);
			
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
		console.log(dismissedCards);
	}, [dismissedCards])
	
	useEffect(() => {
		drivers.forEach((d) => {
			if (d.carIndex === highlightedDriverIndex) {
				return setHighlightedDriver(d);
			}
		})
	}, [drivers])

	useEffect(() => {
		let localTheme = localStorage.getItem("theme");
		if (localTheme !== null) {
			setTheme(JSON.parse(localTheme));
		}

		socketInitializer().then(() => {
			setLoading(false);
		});

		setTimeout(() => {
			if (drivers.length <= 1) setConection("disconnected")
		}, 25000)
	}, [])

	useEffect(() => {
		localStorage.setItem("theme", JSON.stringify(theme));
		document.getElementById("bg").style.backgroundImage = `url(${theme.backgroundImage})`;
		document.getElementById("bg").style.backgroundColor = `${theme.backgroundColor}`;
	}, [theme])

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
		<>
			<Loading loading = { loading } />

			<div id = "bg" className = {`${theme.theme === "dark" ? "dark" : ""} background min-h-screen h-auto`}>
				<div className = "text-black dark:text-white flex flex-col-reverse lg:flex-row justify-center lg:px-16">
					<Head>
						<title>Gabir Motors Pit Wall</title>
						<link rel="icon" href="/small_logo.png" />
						<link rel="stylesheet" href="https://use.typekit.net/mzl0gsb.css" />

						<meta name="title" content="Gabir Motors Pit Wall" />
						<meta name="description" content="Harness your inner Pit Crew using this handy tool to keep up with all the car stats your heart desires in real time!

						Powered by Gabir Motors, the world's premiere pretend Motorsports Company. " />

						<meta property="og:type" content="website" />
						<meta property="og:url" content="https://standings.gabirmotors.com/" />
						<meta property="og:title" content="Gabir Motors Pit Wall" />
						<meta property="og:description" content="Harness your inner Pit Crew using this handy tool to keep up with all the car stats your heart desires in real time!

						Powered by Gabir Motors, the world's premiere pretend Motorsports Company. " />
						<meta property="og:image" content="/header.jpg" />

						<meta property="twitter:card" content="summary_large_image" />
						<meta property="twitter:url" content="https://standings.gabirmotors.com/" />
						<meta property="twitter:title" content="Gabir Motors Pit Wall" />
						<meta property="twitter:description" content="Harness your inner Pit Crew using this handy tool to keep up with all the car stats your heart desires in real time!

						Powered by Gabir Motors, the world's premiere pretend Motorsports Company. " />
						<meta property="twitter:image" content="/header.jpg"></meta>
					</Head>
					<div id="left" className = "lg:w-1/3">
						<ConnectionCard connection = {connection} setDismissedCards = {setDismissedCards} dismissedCards = {dismissedCards}/>
						<Card id = "standings-card" title = {`Race Standings | ${(session.session.type === "PRACTICE" ? "Practicing" : (
								session.session.type === "QUALIFY" ? "Qualifying" : (
									session.session.type === "RACE" ? "Racing" : "Waiting"
								)
							))}`} dismissible = {true} onDismiss = {setDismissedCards} dismissedCards = {dismissedCards}>
							{session.session.type !== "LOADING" ? (
								<>
									<table className = "mb-8">
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
														(d.raceData.onPitRoad ? "text-gray-500 dark:text-gray-400" : "")
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
										<Button block = {true} click = {() => {
											if (displayType === "Interval") setDisplayType("Leader");
											else setDisplayType("Interval");
										}}>Display Mode: { displayType }</Button>
								) : ""}
								</>
							) : (
								<h1 className = "font-bold text-center text-xl">Waiting to Recieve Data</h1>
							)}
						</Card>

						<Card title = "Tires and Fuel" dismissible = {true} onDismiss = {setDismissedCards} dismissedCards = {dismissedCards}>
							{ (driverData !== undefined) ? (
								<>
									<h1 className = "font-bold text-center text-xl">Remaining Tires</h1>
									<div className = "flex flex-col justify-around">
										<div className = "flex flex-row justify-around">
											<div>
												<span className = "font-bold text-xl">Left Front</span><br />
												<span className = "text-center block">{ driverData.tiresRemaining.left.front }</span>
											</div>
											<div>
												<span className = "font-bold text-xl">Right Front</span><br />
												<span className = "text-center block">{ driverData.tiresRemaining.right.front }</span>
											</div>
										</div>	
										<div className = "flex flex-row justify-around">
											<div>
												<span className = "font-bold text-xl">Left Rear</span><br />
												<span className = "text-center block">{ driverData.tiresRemaining.left.rear }</span>
											</div>
											<div>
												<span className = "font-bold text-xl">Right Rear</span><br />
												<span className = "text-center block">{ driverData.tiresRemaining.right.rear }</span>
											</div>
										</div>
									</div>
									<hr className = "mx-4 my-4" />
									<span className = "font-bold">Fuel Remaining: <span className = "font-normal">{ convertToImperial(driverData.fuel.remaining, "L", theme.useMetric)[0].toFixed(3) } {convertToImperial(driverData.fuel.remaining, "L", theme.useMetric)[1]} ({ (driverData.fuel.percent * 100).toFixed(2) }%)</span></span><br />	
								</>
							) : ""}
						</Card>
						
						<NotesCard setDismissedCards = {setDismissedCards} dismissedCards = {dismissedCards}/>

						{dismissedCards.length ? (
							<Card title = "Closed Cards">
								<h1 className = "font-bold text-center text-xl">Click to Reopen</h1>
								{dismissedCards.map(d => (
									<div className = "my-6">
										<Button block = {true} click = {() => { 
											d.reopen(); 
											let _c = [ ...dismissedCards ];
											_c = _c.filter((a) => {
												return a.name !== d.name;
											})	
											setDismissedCards(_c);
										}}>{ d.name }</Button>
									</div>
								))}
							</Card>
						) : (
							""
						)}

						<Card title = "Debug" dismissible = {true} onDismiss = {setDismissedCards} dismissedCards = {dismissedCards}>
							<pre>{ JSON.stringify({flags:session.flags,highlightedDriver}, null, 4) }</pre>
						</Card>
					</div>
					<div id="right" className = "flex flex-col grow-0 lg:w-2/3">
						<div id="innerright" className = "flex flex-col-reverse md:flex-row justify-evenly lg:w-1/1">
							<div className = "lg:w-1/2">
								<ChatCard theme = {theme.theme} channel = {channel} setDismissedCards = {setDismissedCards} dismissedCards = {dismissedCards}/>

								<Card id = "welcome-card" title = "Welcome!" dismissible = {true} onDismiss = {setDismissedCards} dismissedCards = {dismissedCards}>
									<h1 className = "font-bold text-center text-xl">Welcome to the</h1>
									<h1 className = "font-bold text-center text-5xl acumin">GABIR MOTORS PIT WALL</h1>
									<img src="https://i.gabirmotors.com/assets/other/pit_wall.png" alt="Gabir Motors Logo" className = "w-64 m-auto mt-6"/>
								</Card>
							</div>
							
							<div className = "lg:w-1/2">
								<Card title = "Location" dismissible = {true} onDismiss = {setDismissedCards} dismissedCards = {dismissedCards}>
									<h1 className = "font-bold text-center text-xl">{ session.track.name }</h1>
									<h2 className = "text-center text-lg">{ session.track.city }, { session.track.country }</h2>
								</Card>

								<Card title = "Race Info" dismissible = {true} onDismiss = {setDismissedCards} dismissedCards = {dismissedCards}>
									<span className = "font-bold">Time Remaining: <span className = "font-normal">{ new Date(session.session.timeRemaining * 1000).toISOString().substr(11, 8) }</span></span><br />
									<span className = "font-bold">Quick Repairs: <span className = "font-normal">{ session.session.fastRepairs }</span></span><br />
									<span className = "font-bold">Track Length: <span className = "font-normal">{ session.track.length }</span></span><br />
									<span className = "font-bold">Lap: <span className = "font-normal">{ drivers[0].raceData.lap }</span></span><br />
								</Card>

								<Card title = "Weather" dismissible = {true} onDismiss = {setDismissedCards} dismissedCards = {dismissedCards}>
									<span className = "font-bold">Skies: <span className = "font-normal">{ session.weather.skies }</span></span><br />
									<span className = "font-bold">Wind: <span className = "font-normal">{ session.weather.windSpeed }</span></span><br />
									<span className = "font-bold">Track Temperature: <span className = "font-normal">{ session.track.temperature }</span></span><br />
									<span className = "font-bold">Air Temperature: <span className = "font-normal">{ session.weather.temperature }</span></span><br />
								</Card>

								<Draggable handle = ".handle" bounds = ".background" disabled = {width}>
									<div id = "controls" className = "flex flex-col">
										<div className = {`mx-4 handle block p-4 mt-8 bg-light-card-handle dark:bg-dark-card-handle transition duration-300 ${flag !== "" ? "rounded-t-lg" : "rounded-lg"} cursor-move1`}>
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

								<Card title = "Settings" dismissible = {true} onDismiss = {setDismissedCards} dismissedCards = {dismissedCards}>
									<Button block = {true} click = {() => {
										setTheme({ ...theme, theme: (theme.theme === "dark" ? "light" : "dark") })
									}}>Change Theme</Button>

									Chat Channel: <input onChange = {(e) => { setChannel(e.target.value) }} type="text" className = "mt-6 rounded-lg bg-light-card-handle dark:bg-dark-card-handle py-2 px-4 transition duration-200" placeholder='Channel' value = {channel}/><br />
									Background Image: <select onChange = {(e) => {
										setTheme({ ...theme, backgroundImage: e.target.value })
									}} value = {theme.backgroundImage} name="image" id="image" className = "mt-2 rounded-lg bg-light-card-handle dark:bg-dark-card-handle py-2 px-4 transition duration-200">
										<option value="https://gabirmotors.com/img/image.jpg">Mike Racecar</option>
										<option value="https://i.gabirmotors.com/assets/other/carbon_fiber.jpg">Carbon Fiber</option>
										<option value="">none</option>
									</select><br />
									Background Color: <input value = {theme.backgroundColor} type="color" onChange = {(e) => {
										setTheme({ ...theme, backgroundColor: e.target.value })
									}} className = "mt-2 rounded-lg bg-light-card-handle dark:bg-dark-card-handle transition duration-200" />
								</Card>
							</div>
						</div>
						<div>
							<DriverCard driver = { highlightedDriver } session = { session } setDismissedCards = {setDismissedCards} dismissedCards = {dismissedCards}/>
							<StreamCard channel = {channel} setDismissedCards = {setDismissedCards} dismissedCards = {dismissedCards}/>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}