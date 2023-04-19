import { useState, useEffect } from 'react';
import { Button, Loading, SEO, Navbar, Alert } from '../components';
import { Event, Calendar } from '../utils/interfaces';
import { Client } from "gabir-motors";
import { motion } from 'framer-motion';
import { BiLinkExternal } from 'react-icons/bi';
import Link from "next/link";

const client = new Client();

export default function Channels() {
	const [loading, setLoading] = useState(true);
	const [next, setNext] = useState<Event>();
	const [timeLeft, setTimeLeft] = useState<null | { days:number;hours:number;minutes:number;seconds:number }>(null);
	const [nOpen, setNOpen] = useState(false);
	const [calendar, setCalendar] = useState<Calendar>();

	const calculateTimeRemaining = (countdownTo) => {
		const difference = +new Date(countdownTo * 1000) - +new Date();

		let timeLeft = null;

		if (difference > 0) {
			timeLeft = {
				days: Math.floor(difference / (1000 * 60 * 60 * 24)),
				hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
				minutes: Math.floor((difference / 1000 / 60) % 60),
				seconds: Math.floor((difference / 1000) % 60)
			};
		}

		return timeLeft;
	}

	useEffect(() => {
		(async () => {
			let calendar = await client.getCalendar();
			setCalendar(calendar);
			let nextEvent = calendar.getNext();
			console.log(calendar)
			setNext({ ...nextEvent, timestamp: nextEvent.timestamp });
		})()

		setTimeout(() => {
			setLoading(false);
		}, 500)
	}, [])

	useEffect(() => {
		const timer = setInterval(() => {
			if (next !== undefined) setTimeLeft(calculateTimeRemaining(next.timestamp));
		}, 1000);

		return () => clearInterval(timer);
	}, [next])

	return (
		<>
			<SEO 
				title = "Gabir Motors | Home" 
			/>

			<Loading loading = { loading } />

			<Navbar />

			{/* TODO: convert "AlertSection" to a component */}
			<div className = "pointer-events-none fixed z-40 w-screen flex flex-row justify-center">
				<div className = "flex flex-col gap-2 mt-2 justify-start lg:w-2/3">
					<Alert type = "warning" id = "beta-warning" permaDismiss>This is a <strong>beta</strong> version of the Gabir Motors site, you may notice some features are missing. If there is something missing that you need, return to the <a href = "https://gabirmotors.com">main site</a></Alert>
				</div>
			</div>

			{ nOpen && (
				<div onClick = {() => { setNOpen(false); }} className = "fixed bg-black bg-opacity-50 cursor-pointer z-40 text-white top-0 left-0 w-screen h-screen grid place-items-center" id = "northern-harbor-offer">
					<div className = "bg-dark-card-handle p-4 rounded-md lg:w-1/3">
						<img className = "mx-auto mb-4" src="https://i.gabirmotors.com/assets/other/northern_harbor.png" alt="Northern Harbor Logo" />

						<h2 className = "acumin text-3xl">Get <strong>20%</strong> your next order at Northern Harbor!</h2>

						<p className = "font-semibold">Use code <code className = "bg-zinc-700 font-mono p-0.5 rounded-md">NOTLAST</code> at checkout for 20% off any of Northern Harbor's beef based seafood products.</p>
						<blockquote className = "opacity-70 italic mx-2">
							Northern Harbor is the world's premier provider of meat-based fish substitutes. With mouth-watering favorites like our Bone-In Fysh Wyngz, our succulent Fishey Mignon, and our new You'll Swear It's Beef line of Shramp and Crobb crostini, we've got something for every person who wants to ask for fish but actually get beef.
							<cite className = "block ml-4">- Northern Harbor</cite>
						</blockquote>
					</div>
				</div>
			) }

			<div className = "min-h-screen absolute overflow-hidden text-white max-w-full">
				<section id="hero" className = "min-h-screen background-mike_racecar bg-center">
					{timeLeft !== null ? (
						<>
							<motion.h1 transition={{ delay: 0.9, duration: 1 }} initial = {{ y: "-15%", opacity: 0 }} animate = {{ y: 0, opacity: 1 }} className = "text-center top-4 absolute w-full acumin text-5xl"><Link href = {`/calendar?highlight=${next.timestamp}`}>NEXT RACE IN</Link></motion.h1>
							<div className = "absolute flex flex-row w-full justify-center lg:gap-16 gap-4 lg:text-8xl text-5xl acumin text-center top-16">
								<motion.div transition={{ delay: 1, duration: 1 }} initial = {{ y: "-15%", opacity: 0 }} animate = {{ y: 0, opacity: 1 }} id="days">{ timeLeft.days } <span className = "lg:text-3xl text-2xl block text-center">DAYS</span></motion.div>
								<motion.div transition={{ delay: 1.1, duration: 1 }} initial = {{ y: "-15%", opacity: 0 }} animate = {{ y: 0, opacity: 1 }} id="hours">{ timeLeft.hours } <span className = "lg:text-3xl text-2xl block text-center">HOURS</span></motion.div>
								<motion.div transition={{ delay: 1.2, duration: 1 }} initial = {{ y: "-15%", opacity: 0 }} animate = {{ y: 0, opacity: 1 }} id="minutes">{ timeLeft.minutes } <span className = "lg:text-3xl text-2xl block text-center">MINUTES</span></motion.div>
								<motion.div transition={{ delay: 1.3, duration: 1 }} initial = {{ y: "-15%", opacity: 0 }} animate = {{ y: 0, opacity: 1 }} id="seconds">{ timeLeft.seconds } <span className = "lg:text-3xl text-2xl block text-center">SECONDS</span></motion.div>
							</div>
						</>
					) : ""}
					<div className = "grid place-items-center h-screen text-center w-screen">
						<div className = "mt-16">
							<motion.img onClick = {() => { setNOpen(true); }} transition={{ delay: 2, duration: 1 }} initial = {{ y: "15%", opacity: 0 }} animate = {{ y: 0, opacity: 1 }} className = "md:w-1/2 mx-auto" src="/logo_with_text.png" alt="Gabir Motors logo with the text GABIR MOTORS written at the bottom" />
							<motion.div transition={{ delay: 2.2, duration: 1 }} initial = {{ y: "15%", opacity: 0 }} animate = {{ y: 0, opacity: 1 }} className = "flex flex-row gap-8 justify-center">
								<Button link = "#join-the-discord">Learn More</Button>
							</motion.div>
						</div>
					</div>

					<div id = "upcoming-events" className = "z-30 w-full py-8 flex lg:flex-row flex-col-reverse justify-evenly gap-4 lg:mx-8 mx-4">
						<div className = "place-self-center lg:w-1/2">
							{ calendar && calendar.events.map((event, index) => {
								if (!event.hasPassed) {
									return (
										<Link href = {`/calendar?highlight=${event.timestamp}`}>
											<motion.div 
												viewport = {{ once: true, amount: "all", margin: "-10px" }} 
												initial = {{ opacity: 0, y: "-15%" }} whileInView = {{ opacity: 1, y: 0 }} transition = {{ duration: 0.5 }}
												className = "transition duration-200 hover:backdrop-blur-none cursor-pointer px-8 py-4 rounded-lg flex flex-row justify-between gap-2 mx-auto bg-dark-card-body backdrop-blur-md my-2"
											>
												<span><span className = "font-bold">{ event.date }</span> - { event.track.name }</span>
												<div><BiLinkExternal className = "text-xl my-auto"/></div>
											</motion.div>
										</Link>
									)
								}	
							}) }
						</div>

						<div className = "place-self-center lg:w-1/2 lg:mx-0 mx-4 mb-8 lg:mb-0">
							<motion.h1 
							viewport = {{ once: true, amount: "all", margin: "-10px" }} 
							initial = {{ opacity: 0, y: "-15%" }} whileInView = {{ opacity: 1, y: 0 }} transition = {{ duration: 0.5 }}
							className = "text-5xl font-bold text-center">
								Upcoming Events
							</motion.h1>
						</div>
					</div>

					<div id = "join-the-discord" className = "z-30 w-full py-8 flex lg:flex-row flex-col justify-evenly gap-4 mt-16">
						<div className = "place-self-center lg:w-1/2 lg:mx-0 mx-4 mb-8 lg:mb-0">
							<motion.h1 
							viewport = {{ once: true, amount: "all", margin: "-10px" }} 
							initial = {{ opacity: 0, y: "-15%" }} whileInView = {{ opacity: 1, y: 0 }} transition = {{ duration: 0.5 }}
							className = "text-5xl font-bold text-center">
								Join the <br />
								<div className = "inline-block mt-2"><img className = "aspect-auto" src="https://i.gabirmotors.com/assets/league/pa_league_horizontal.png" alt="The PA League Logo" /></div>
								<br />on Discord
							</motion.h1>
						</div>

						<div className = "place-self-center">
							<iframe src="https://discord.com/widget?id=715683569959174215&theme=dark" width="350" height="500" allowTransparency="true" frameborder="0" sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"></iframe>
						</div>
					</div>

					<div id = "meet-the-team" className = "z-30 w-full py-8 flex flex-col justify-evenly gap-4 mt-8">
						<div className = "place-self-center">
							<motion.h1 
							viewport = {{ once: true, amount: "all", margin: "-10px" }} 
							initial = {{ opacity: 0, y: "-15%" }} whileInView = {{ opacity: 1, y: 0 }} transition = {{ duration: 0.5 }}
							className = "text-5xl font-bold text-center">Meet the Gabir Motors Team</motion.h1>
						</div>

						<div className = "place-self-center">
							<div className="flex flex-col gap-8 px-8 py-16">
								{ [ 
									{ name: "Mike Racecar", bio: "His momma was a V6 and his daddy is the track. Metaphorically speaking. But he was born in the backseat of a stock car, that much we know for certain, because that car is now in a museum - the Mike Racecar Museum. In 2007, he fell asleep during a race and still won. He can't read nothing but the road, and the only number he can count to is \"1st.\"", quote: "The tallest flowers get cut, don't try to be good at anything.", image: "https://i.gabirmotors.com/assets/characters/Mike_Racecar.png" },
									{ name: "Carson Bolt", bio: "It's said the man eats rubber and drinks gasoline, just like the cars he loves so well. A driver himself until an accident at the KFC Lunch buffet twenty years ago, he's since become a second father to many - and a first father to some. Topped up on his signature \"Goose Juice,\" the recipe for which is best left unsaid, he rules the race from his roost in the spotter tower - giving Mr. Racecar the edge he needs.", quote: "Sometimes your worst nights, are your best nights.", image: "https://i.gabirmotors.com/assets/characters/Carson_Bolt.png" },
									{ name: "Kara", bio: "Kara is many things. Wife to one, Mother to some and loved by all, she is the prettiest spotter in racing! Trust me, when you're riding one of these 3,200 pound steel beasts out of turn four at Daytona and you don't even know your own name anymore much less what the hell is going on outside your 200 MPH coffin, well, she's that calm voice in your ear like an angel of God calling you home to the finish line.", quote: "What?! You're insane!", image: "https://i.gabirmotors.com/assets/characters/Kara.png" },
									{ name: "Gabe \"The Younger\"", bio: "Gabe The Younger leapt fully-formed from the trunk of a moving 1969 Pontiac GTO and he's been going fast ever since. Catch the heir to the Gabir Motors family business in front of - and, crucially - behind the scenes, making websites like this one and spotting live on streams.", quote: "I don't promise anything.", image: "https://i.gabirmotors.com/assets/characters/Gabe.png" },
								].map((team_member, index) => (
									<motion.div 
										viewport = {{ once: true, amount: "all", margin: "-10px" }} 
										initial = {{ opacity: 0, y: "-15%" }} whileInView = {{ opacity: 1, y: 0 }} transition = {{ duration: 0.5 }}>
										<div className = "p-4 rounded-lg flex flex-col gap-2 mx-auto lg:w-2/3 bg-dark-card-body backdrop-blur-md">
											<div className="flex lg:flex-row flex-col justify-around">
												<img src={ team_member.image } alt="" className = "shadow-2xl background-carbon_fiber my-auto mx-auto object-cover h-32 aspect-square object-top rounded-lg" />
												<div className = "px-4">
													<h2 className = "acumin text-4xl font-semibold text-center tracking-wide">{ team_member.name }</h2>

													<p className = "text-sm font-semibold">{ team_member.bio }</p>
												</div>
											</div>

											<div>
												<div className = "italic text-xl text-center">"{ team_member.quote }"</div>
											</div>
										</div>
									</motion.div>
								)) }
							</div>
						</div>
					</div>
				</section>
			</div>
		</>
	)
}