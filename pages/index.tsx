import { useState, useEffect } from 'react';
import { Button, Loading, SEO, Navbar, Modal } from '../components';
import { Event } from '../utils/interfaces';
import { Client } from "gabir-motors";
import { motion } from 'framer-motion';
import { BiLinkExternal } from 'react-icons/bi';
import Link from 'next/link';

const client = new Client();

interface DiscordWidget {
	totalMemberCount:  number;
	onlineMemberCount: number;
	icon:              string;
	name:              string;
	timestamp:         number;
}

let firstIndex = 0;

export default function Channels() {
	// Show the loading screen?
	const [loading, setLoading] = useState(true);

	// JSON object that contains the next race
	const [next, setNext] = useState<Event>();

	// time amounts for the countdown timer
	const [timeLeft, setTimeLeft] = useState<null | { days:number;hours:number;minutes:number;seconds:number }>(null);

	// Norther Harbor easter egg modal open?
	const [nOpen, setNOpen] = useState(false);

	// Is this the user's first visit to the new site? used to show a "changes" modal
	const [firstVisit, setFirstVisit] = useState(false);


	// calculates the times to show in the countdown at the top of the page
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
			// Get the next race
			let calendar = await client.getCalendar();
			let nextEvent = calendar.getNext();

			if (nextEvent) {
				setNext({ ...nextEvent, timestamp: nextEvent.timestamp });
			}
		})()

		// toggle loading screen
		setTimeout(() => {
			setLoading(false);
		}, 500)

		// check localstorage to see if the user has visited the page before
		let visited = localStorage.getItem("visited");
		if (visited === null) setFirstVisit(true);
	}, [])

	useEffect(() => {
		// Update the countdown timer
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

			{/* Modal with information about changes with the rebuild */}
			<Modal open = {firstVisit} setOpen = {setFirstVisit} closeButton onClose = {() => {
				localStorage.setItem("visited", "true");
			}} id = "new-website">
				<h1 className = "font-bold text-3xl">Welcome to the new Gabir Motors Site!</h1>
				<p>A few things have changed, here's a list of some changes you'll find:</p>
				<ul className = "pl-4 mt-4">
					<li>- A new <a href = "/calendar" className="link">calendar page</a> that lets you add events to your calendar app of choice</li>
					<li>- A working <a href = "/standings" className="link">standings page</a> to see how the drivers are doing throughout the season</li>
					<li>- An <a href = "/assets" className="link">assets page</a> that lets people with slow internet connections turn off gallery mode</li>
					<li>- A new <a href = "/tutorials" className="link">tutorials page</a> with useful tips to get better at racing</li>
					<li>- A redesigned home page that shows off some of what the site has to offer</li>
				</ul>
			</Modal>

			{/* Northern Harbor easter egg (you just spoiled the surprise!) */}
			<Modal open = {nOpen} setOpen = {setNOpen} id = "northern-harbor">
				<img className = "mx-auto mb-4" src="https://i.gabirmotors.com/assets/other/northern_harbor.png" alt="Northern Harbor Logo" />

				<h2 className = "acumin text-3xl text-center">Get <strong>20%</strong> your next order at Northern Harbor!</h2>

				<p className = "font-semibold text-center mb-4">Use code <code className = "bg-zinc-700 font-mono p-0.5 rounded-md">NOTLAST</code> at checkout for 20% off any of Northern Harbor's beef based seafood products.</p>
				<blockquote className = "opacity-70 italic mx-2">
					Northern Harbor is the world's premier provider of meat-based fish substitutes. With mouth-watering favorites like our Bone-In Fysh Wyngz, our succulent Fishey Mignon, and our new You'll Swear It's Beef line of Shramp and Crobb crostini, we've got something for every person who wants to ask for fish but actually get beef.
					<cite className = "block ml-4">- Northern Harbor</cite>
				</blockquote>
			</Modal>

			<div className = "min-h-screen absolute overflow-hidden text-white max-w-full">
				<section id="hero" className = "min-h-screen background-mike_racecar bg-center">
					{timeLeft !== null ? (
						<>
							<motion.h1 transition={{ delay: 0.9, duration: 1 }} initial = {{ y: "-15%", opacity: 0 }} animate = {{ y: 0, opacity: 1 }} className = "text-center top-4 absolute w-full acumin text-5xl"><a href = {`/calendar?highlight=${next.timestamp}`}>NEXT RACE IN</a></motion.h1>
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
							<motion.img onClick = {() => { setNOpen(true); }} transition={{ delay: 2, duration: 1 }} initial = {{ y: "15%", opacity: 0 }} animate = {{ y: 0, opacity: 1 }} className = "md:w-1/2 mx-auto" src="/logo_with_text.webp" alt="Gabir Motors logo with the text GABIR MOTORS written at the bottom" />
							<motion.div transition={{ delay: 2.5, duration: 1 }} initial = {{ scale: 1.1, y: "-15%", opacity: 0 }} animate = {{ scale: 1, y: 0, opacity: 1 }} className = "flex flex-row gap-8 justify-center">
								<Button link = "#pages">Learn More</Button>
							</motion.div>
						</div>
					</div>

					<div id = "pages"></div>

					{ 
						[ 
							{ title: "The Gabir Motors Spec Map Previsualization Tool", link: "/tools/specmapping", imageSide: "left", image: "/pages/spec_mapping.jpg", id: "spec-mapping", visitText: "VISUALIZE YOUR SPEC MAPS" },
							{ title: "The PA League Discord", link: "https://discord.gabirmotors.com", imageSide: "right", image: "/screenshot1.jpg", id: "discord", visitText: "JOIN THE DISCORD" },
							{ title: "The Gabir Motors Cup Calendar", link: "/calendar", imageSide: "left", image: "/pages/calendar.jpg", id: "calendar", visitText: "CHECK THE CALENDAR" },
							{ title: "The Gabir Motors Cup Standings", link: "/standings", imageSide: "right", image: "/pages/standings.jpg", id: "standings", visitText: "SEE THE STANDINGS" },
							{ title: "Joining the PA League", link: "/tutorials/joining-the-league", imageSide: "left", image: "/pages/joining_the_league.jpg", id: "joining-the-league", visitText: "JOIN THE LEAGUE" },
							{ title: "The Assets Page", link: "/assets", imageSide: "right", image: "/pages/assets.jpg", id: "assets", visitText: "AQUIRE SOME ASSETS" },
							
						].map((page, index) => <PageShowoff page = {page} />)
					}

					<footer className = "sticky bottom-0 w-screen flex flex-row justify-center mt-16">
						<span className = "p-4 text-lg font-bold">Gabir Motors &bull; { (new Date()).getFullYear() }</span>
					</footer>
				</section>
			</div>
		</>
	)
}

const PageShowoff = ({ page }) => {
	return (
		<>
			{/* Desktop Version */}
			<section id = {page.id} className = "py-16 hidden lg:block">
				<motion.div 
					className="flex flex-row justify-evenly"
					viewport = {{ once: true, margin: "-15%" }} 
					initial = "hidden" 
					whileInView = "shown"
				>
					{ page.imageSide === "right" && (
						<motion.h2 
							variants = {{
								hidden: { x: "66%" },
								shown: { x: 0 }
							}}
							transition = {{ duration: 0.7, ease: 'easeInOut' }}
							className = "self-center text-5xl font-extrabold w-1/3 text-center z-10"
						>{ page.title }</motion.h2>
					) }
					<Link href = {page.link}>
						{/* Container for whole image setup */}
						<motion.div 
							variants = {{
								hidden: { x: page.imageSide === "left" ? "66%" : "-66%" },
								shown: { x: 0 }
							}}
							transition = {{ duration: 0.7, ease: 'easeInOut' }}
							className = "w-1/3 rounded-lg z-20 overflow-hidden cursor-pointer"
						>
							{/* Background image, scales up on hover */}
							<motion.div 
								style = {{
									backgroundImage: `url('${page.image}')`,
									backgroundPosition: "center",
									backgroundSize: "cover"
								}}
								initial = {{ scale: 1 }}
								whileHover = {{ scale: 1.1 }}
								whileTap = {{ scale: 1 }}
								transition = {{ duration: 0.3, ease: 'easeInOut' }}
								className = "w-full h-full"
							>
								{/* Overlay that pops up on hover */}
								<motion.div 
									initial = {{ backgroundColor: "#00000000", opacity: 0, scale: 1.2 }}
									whileHover = {{ backgroundColor: "#00000099", opacity: 1, scale: 1 }}
									transition = {{ duration: 0.3, ease: 'easeInOut' }}
									className = "w-full h-full grid place-items-center font-extrabold text-3xl"
								>
									<span className = "text-center">{ page.visitText } <BiLinkExternal className = "inline mb-1" /></span>
								</motion.div>

								{/* Hidden image to force the div to the correct size */}
								<img src = {page.image} className = "opacity-0 pointer-events-none" alt = {`Preview of the ${page.id.replaceAll('-', ' ')} page`}/>
							</motion.div>
						</motion.div>
					</Link>
					{ page.imageSide === "left" && (
						<motion.h2 
							variants = {{
								hidden: { x: "-66%" },
								shown: { x: 0 }
							}}
							transition = {{ duration: 0.7, ease: 'easeInOut' }}
							className = "self-center text-5xl font-extrabold w-1/3 text-center z-10"
						>{ page.title }</motion.h2>
					) }
				</motion.div>
			</section> 
		
			{/* Mobile Version */}
			<section id = {page.id} className = "py-16 block lg:hidden">
				<motion.div 
					className="flex flex-col mx-4"
					viewport = {{ once: true, margin: "-15%" }} 
					initial = "hidden" 
					whileInView = "shown"
				>
					<motion.h2 
						variants = {{
							hidden: { y: "150%" },
							shown: { y: 0 }
						}}
						transition = {{ duration: 0.7, ease: 'easeInOut' }}
						className = "self-center text-3xl mb-4 font-extrabold w-full text-center z-10"
					>{ page.title }</motion.h2>
					<Link href = {page.link}>
						{/* Container for whole image setup */}
						<motion.div 
							variants = {{
								hidden: { y: "-50%" },
								shown: { y: 0 }
							}}
							transition = {{ duration: 0.7, ease: 'easeInOut' }}
							className = "rounded-lg z-20 overflow-hidden cursor-pointer"
						>
							{/* Background image, scales up on hover */}
							<motion.div 
								style = {{
									backgroundImage: `url('${page.image}')`,
									backgroundPosition: "center",
									backgroundSize: "cover"
								}}
								initial = {{ scale: 1 }}
								whileTap = {{ scale: 1.1 }}
								transition = {{ duration: 0.3, ease: 'easeInOut' }}
								className = "w-full h-full"
							>
								{/* Overlay that pops up on hover */}
								<motion.div 
									initial = {{ backgroundColor: "#00000000", opacity: 0, scale: 1.2 }}
									whileTap = {{ backgroundColor: "#00000099", opacity: 1, scale: 1 }}
									transition = {{ duration: 0.3, ease: 'easeInOut' }}
									className = "w-full h-full grid place-items-center font-extrabold text-3xl"
								>
									<span className = "text-center">{ page.visitText } <BiLinkExternal className = "inline mb-1" /></span>
								</motion.div>

								{/* Hidden image to force the div to the correct size */}
								<img src = {page.image} className = "opacity-0 pointer-events-none"/>
							</motion.div>
						</motion.div>
					</Link>
				</motion.div>
			</section> 
		</>
	)
}