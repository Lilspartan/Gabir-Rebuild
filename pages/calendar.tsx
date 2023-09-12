import { useState, useEffect } from 'react';
import { Button, Loading, SEO, Navbar, Modal } from '../components';
import { Calendar, Event } from '../utils/interfaces';
import { Client } from "gabir-motors";
import { google, outlook, yahoo, ics } from "calendar-link";
import { AiFillCalendar } from 'react-icons/ai';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router'

const client = new Client();

const getTextDate = (timestamp) => {
	var dateObj: string | string[] = new Date(timestamp * 1000).toString();
	dateObj = dateObj.split(' ');
	var newObj: string | string[] = [dateObj[1], dateObj[2], dateObj[3]];
	newObj = newObj.join(' ');
	console.log(dateObj)
	return newObj;
}

const Calendar = ()  => {
	const [loading, setLoading] = useState(true);
    const [calendar, setCalendar] = useState<Calendar>();
	const [modalOpen, setModalOpen] = useState(false);
	const [modalEvent, setModalEvent] = useState<{ event: Event, raceNumber: number } | null>(null);
	const [calendarEvents, setCalendarEvents] = useState({ 'google': null, 'outlook': null, 'yahoo': null, 'ics': null });
	const [highlighted, setHighlighted] = useState(null);

	const router = useRouter()

	useEffect(() => {
		if (router.query.highlight !== undefined) {
			setHighlighted(router.query.highlight)
		}
	}, [ router.query ])

	useEffect(() => {
		(async () => {
			let c = await client.getCalendar();
			setCalendar(c);

			console.log(c)
		})()

		setTimeout(() => {
			setLoading(false);
		}, 500)
	}, [])

	const openCalendarModal = (event: Event, index: number) => {
		setModalEvent({ raceNumber: index, event });
		setModalOpen(true);

		interface CalendarEvent {
			title: string;
			description: string;
			start: Date;
			duration: [number, "hour" | "minute" | "day"]
		}

		const calendarEvent: CalendarEvent = {
			title: `Gabir Motors Cup, Season ${calendar.season} Race ${index + 1}`,
			description: `Track: ${event.track.name}\nCar: ${event.cars[0].name}`,
			start: new Date(event.timestamp * 1000),
			duration: [2, "hour"],
		};

		setCalendarEvents({
			'google': google(calendarEvent),
			'outlook': outlook(calendarEvent),
			'yahoo': yahoo(calendarEvent),
			'ics': ics(calendarEvent),
		})
	}

	return (
		<>
			<SEO 
				title = "Gabir Motors | Calendar" 
				description = "View the schedule for the Gabir Motors Cup" 
				url = "calendar"
			/>

			<Loading loading = { loading } />

			<Navbar />
			
			<Modal closeButton open = {modalOpen && modalEvent !== null} setOpen = {setModalOpen} id = "calendar-event">
				{ modalEvent !== null && <h1 className = "text-2xl"><span className="font-bold">Add Event to Calendar:</span> Gabir Motors Cup, Season { calendar.season } Race { modalEvent.raceNumber + 1 }</h1> }
						
				<div className="flex flex-col p-4 gap-2">
					<a className = "font-bold opacity-50 hover:opacity-100 transition duration-200" href = {calendarEvents['google']} target = "_blank">Add to Google Calendar</a>
					<a className = "font-bold opacity-50 hover:opacity-100 transition duration-200" href = {calendarEvents['outlook']} target = "_blank">Add to Outlook</a>
					<a className = "font-bold opacity-50 hover:opacity-100 transition duration-200" href = {calendarEvents['yahoo']} target = "_blank">Add to Yahoo</a>
					<a className = "font-bold opacity-50 hover:opacity-100 transition duration-200" href = {calendarEvents['ics']} target = "_blank">Download .ics File</a>
				</div>
			</Modal>

			<div className = "min-h-screen absolute overflow-hidden text-white max-w-full w-screen">
                <div className = "flex flex-col content-center min-h-screen background-carbon_fiber w-full text-center">
                    <div><h1 className = "md:text-2xl text-4xl mt-4">Gabir Motors Cup, Season { calendar && calendar.season }</h1></div>
                    <div className="hidden md:block w-screen">
						<table className = "text-left text-xl mt-6 w-full">
							<thead>
								<tr className = "text-zinc-400 text-sm" style = {{ borderWidth: "1px 0", borderColor: "#666666AA" }}>
									<th className = "px-4 py-6 font-normal">DATE</th>
									<th className = "font-normal">TRACK</th>
									<th className = "font-normal">CAR</th>
									<th className = "font-normal">NOTES</th>
								</tr>
							</thead>
							<tbody>
							{ calendar && calendar.events.sort((a, b) => {
								return a.timestamp - b.timestamp; 
							}).map((event, index) => (
								<motion.tr initial = {{ opacity: 0 }} animate = {{ opacity: 1 }} transition = {{ delay: 1.5 + (0.1 * index), duration: 1 }} className={`hover:bg-[#66666655] transition duration-200 ${Number(highlighted) === event.timestamp && "bg-[#66666677]"}`} style = {{ borderWidth: "1px 0", borderColor: "#666666AA" }}>
									<td className = "text-2xl px-4 py-6 font-bold">{ getTextDate(event.timestamp) } { event.hasPassed && <span className = "italic font-bold opacity-50">COMPLETED</span> }</td>
									<td className = "text-2xl">{ event.track.paid && <span className = "text-green-500 font-extrabold">$</span> } { event.track.name }</td>
									<td className = "text-2xl">
										{ event.cars.map((car, index) => (
											<>
												<span className = "">
													{ car.paid && <span className = "text-green-500 font-extrabold mr-2">$</span> }
													<span>{ car.name }{ index < event.cars.length - 1 && "," } </span>
												</span>
											</>
										)) }
									</td>
									<td className = "text-2xl">{ event.notes }</td>
									<td><a className = "cursor-pointer opacity-50 hover:opacity-100 transition duration-200" onClick = {() => {
										openCalendarModal(event, index);
									}}><AiFillCalendar className = "inline mr-4" /></a></td>
								</motion.tr>
							)) }
							</tbody>
						</table>
					</div>
					
					<div className="block md:hidden text-left text-2xl mt-6">
						{ calendar && calendar.events.sort((a, b) => {
							return a.timestamp - b.timestamp; 
						}).map((event, index) => (
							<motion.div initial = {{ opacity: 0 }} animate = {{ opacity: 1 }} transition = {{ delay: 1.5 + (0.1 * index), duration: 2 }} className = {`flex flex-col gap-2 py-6 ${Number(highlighted) === event.timestamp && "bg-[#66666677]"}`} style = {{ borderWidth: "1px 0", borderColor: "#666666AA" }}>
								<span className = "px-4 font-bold">{ event.date } { event.hasPassed && <span className = "italic font-bold opacity-50">COMPLETED</span> }</span>
								<span className="px-4">{ event.track.paid && <span className = "text-green-500 font-extrabold">$</span> } { event.track.name }</span>
								<span className="px-4">
									{ event.cars.map((car, index) => (
										<>
											<span className = "">
												{ car.paid && <span className = "text-green-500 font-extrabold mr-2">$</span> }
												<span>{ car.name }{ index < event.cars.length - 1 && "," } </span>
											</span>
										</>
									)) }
								</span>
								{ event.notes !== null && <span className="px-4"><span className="font-bold">NOTES:</span> { event.notes }</span> }
								<span className = "px-4 mt-2 text-sm"><a className = "cursor-pointer" onClick = {() => {
									openCalendarModal(event, index);
								}}>Add to Calendar <AiFillCalendar className = "inline" /></a></span>
							</motion.div>
						)) }
					</div>
                </div>
			</div>
		</>
	)
}

export default Calendar;