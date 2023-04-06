import { useState, useEffect } from 'react';
import { Button, Loading, SEO, Navbar, Alert } from '../components';
import classnames from 'classnames';
import { Event } from '../utils/interfaces';
import { Client } from "gabir-motors";

const client = new Client();

export default function Channels() {
	const [loading, setLoading] = useState(true);
	const [next, setNext] = useState<Event>();
	const [timeLeft, setTimeLeft] = useState<null | { days:number;hours:number;minutes:number;seconds:number }>(null);

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
			<SEO />

			<Loading loading = { loading } />

			<Navbar />

			{/* TODO: convert "AlertSection" to a component */}
			<div className = "pointer-events-none fixed z-40 w-screen flex flex-row justify-center">
				<div className = "flex flex-col gap-2 mt-2 justify-start">
					<Alert type = "warning" id = "beta-warning" permaDismiss>This is a <strong>beta</strong> version of the Gabir Motors site, you may notice some features are missing. If there is something missing that you need, return to the <a href = "https://gabirmotors.com" className = "font-bold">main site</a></Alert>
				</div>
			</div>

			<div className = "min-h-screen absolute overflow-hidden text-white max-w-full">
				<section id="hero" className = "min-h-screen background-mike_racecar bg-center">
					{timeLeft !== null ? (
						<>
							<h1 data-m = "bounce-down" data-m-delay = "0.9" className = "text-center top-4 absolute w-full acumin text-5xl">NEXT RACE IN</h1>
							<div className = "absolute flex flex-row w-full justify-center lg:gap-16 gap-4 lg:text-8xl text-5xl acumin text-center top-16">
								<div data-m = "bounce-down" data-m-delay = "1" id="days">{ timeLeft.days } <span className = "lg:text-3xl text-2xl block text-center">DAYS</span></div>
								<div data-m = "bounce-down" data-m-delay = "1.1" id="hours">{ timeLeft.hours } <span className = "lg:text-3xl text-2xl block text-center">HOURS</span></div>
								<div data-m = "bounce-down" data-m-delay = "1.2" id="minutes">{ timeLeft.minutes } <span className = "lg:text-3xl text-2xl block text-center">MINUTES</span></div>
								<div data-m = "bounce-down" data-m-delay = "1.3" id="seconds">{ timeLeft.seconds } <span className = "lg:text-3xl text-2xl block text-center">SECONDS</span></div>
							</div>
						</>
					) : ""}
					<div className = "grid place-items-center h-screen text-center w-screen">
						<div className = "mt-16">
							<img data-m = "bounce-up" data-m-delay = "2" className = "md:w-1/2 mx-auto" src="/logo_with_text.png" alt="Gabir Motors logo with the text GABIR MOTORS written at the bottom" />
							<div data-m = "bounce-up" data-m-delay = "2.2" className = "flex flex-row gap-8 justify-center">
								<Button>Learn More</Button>
							</div>
						</div>
					</div>
				</section>
				<section className = "grid place-items-center w-screen h-screen">
					<h1>h</h1>
				</section>
			</div>
		</>
	)
}