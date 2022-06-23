import { useState, useEffect } from 'react';
import Draggable from 'react-draggable';
import { Driver, Session, Connection, DismissedCard, DriverData } from '../utils/interfaces';
import { DriverCard, Card, ChatCard, StreamCard, ConnectionCard, NotesCard, Button, Loading } from '../components';
import convertToImperial from '../utils/convertToImperial';
import classnames from 'classnames';
import io from 'socket.io-client';
import Head from 'next/head'
import trackmaps from '../public/trackmaps.json';
import SVGComponent from '../components/Loading/icon'

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
				lapPercent: 0,
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

			<div id = "bg" className = {`${theme.theme === "dark" ? "dark" : ""} background min-h-screen h-auto text-black dark:text-white`}>
				<nav id="header" className = " p-4 bg-light-card dark:bg-dark-card flex flex-row">
                    <span id = "logo">
                        <SVGComponent className = "w-32" />
                    </span>

                    <span id="connection">
                        <span className = "font-bold text-center text-xl inline px-8">
                            {connection === "disconnected" ? (
                                <span className = "text-red-600">Disconnected</span> 
                            ): (connection === "connected" ? (
                                <span className = "text-green-500">Connected</span> 
                            ) : (
                                <span className = "text-yellow-600">Connecting</span> 
                            ))}
                        </span>
                    </span>
                </nav>
			</div>
		</>
	)
}