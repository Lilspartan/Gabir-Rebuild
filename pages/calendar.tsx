import { useState, useEffect } from 'react';
import { Button, Loading, SEO , CalendarRow, Navbar } from '../components';
import classnames from 'classnames';
import { Calendar, Event } from '../utils/interfaces';
import { Client } from "gabir-motors";
import { google, outlook, yahoo, ics } from "calendar-link";

const client = new Client();

const Calendar = ()  => {
	const [loading, setLoading] = useState(true);
    const [calendar, setCalendar] = useState<Calendar>();
	const [modalOpen, setModalOpen] = useState(false);
	const [modalEvent, setModalEvent] = useState<{ event: Event, raceNumber: number } | null>(null);
	const [calendarEvents, setCalendarEvents] = useState({ 'google': null, 'outlook': null, 'yahoo': null, 'ics': null });

	useEffect(() => {
		(async () => {
			let c = await client.getCalendar();
			setCalendar(c);
		})()

		setTimeout(() => {
			setLoading(false);
		}, 500)
	}, [])

	const openCalendarModal = (event: Event, index: number) => {
		setModalEvent({ raceNumber: index, event });
		setModalOpen(true);

		const calendarEvent = {
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
			<SEO title = "Gabir Motors | Calendar" />

			<Loading loading = { loading } />

			<Navbar />

			{ modalOpen && modalEvent !== null ? (
                <>
                    <div onClick = {() => { setModalOpen(false); setModalEvent(null); }} className="grid place-items-center fixed w-screen h-screen bg-black bg-opacity-50 top-0 left-0 z-40"></div>

					<div className="grid place-items-center fixed w-screen h-screen pointer-events-none top-0 left-0 z-50 text-white">
						<div className = "fixed z-50 p-6 rounded-lg bg-dark-card-handle pointer-events-auto" id = "calendarprompt">
							<h1 className = "text-2xl"><span className="font-bold">Add Event to Calendar:</span> Gabir Motors Cup, Season { calendar.season } Race { modalEvent.raceNumber + 1 }</h1>
						
							<div className="flex flex-col p-4 gap-2">
								<a className = "font-bold opacity-50 hover:opacity-100 transition duration-200" href = {calendarEvents['google']} target = "_blank">Add to Google Calendar</a>
								<a className = "font-bold opacity-50 hover:opacity-100 transition duration-200" href = {calendarEvents['outlook']} target = "_blank">Add to Outlook</a>
								<a className = "font-bold opacity-50 hover:opacity-100 transition duration-200" href = {calendarEvents['yahoo']} target = "_blank">Add to Yahoo</a>
								<a className = "font-bold opacity-50 hover:opacity-100 transition duration-200" href = {calendarEvents['ics']} target = "_blank">Download .ics File</a>
							</div>
						</div>
					</div>
                </>
            ) : "" }
 

			<div className = "min-h-screen absolute overflow-hidden text-white max-w-full w-screen">
                <div className = "flex flex-col content-center min-h-screen background-carbon_fiber w-full text-center">
                    <div><h1 className = "text-2xl mt-4">Gabir Motors Cup, Season { calendar && calendar.season }</h1></div>
                    <table className = "text-left text-xl mt-6">
						<thead>
							<tr style = {{ borderWidth: "1px 0", borderColor: "#666666AA" }}>
								<th className = "p-4">Date</th>
								<th>Track</th>
								<th>Car</th>
								<th>Notes</th>
							</tr>
						</thead>
						<tbody>
						{ calendar && calendar.events.map((event, index) => (
							<CalendarRow index = {index} event = {event} openModal = {openCalendarModal} />
						)) }
						</tbody>
					</table>
                </div>
			</div>
		</>
	)
}

export default Calendar;