import { useState, useEffect } from 'react';
import { Button, Loading, SEO , CalendarRow} from '../components';
import classnames from 'classnames';
import { Calendar } from '../utils/interfaces';
import { Client } from "gabir-motors";

const client = new Client();

const Calendar = ()  => {
	const [loading, setLoading] = useState(true);
    const [calendar, setCalendar] = useState<Calendar>();

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

	return (
		<>
			<SEO title = "Gabir Motors | Calendar" />

			<Loading loading = { loading } />

			<div className = "min-h-screen absolute overflow-hidden text-white max-w-full w-screen">
                <div className = "flex flex-col content-center min-h-screen background-carbon_fiber w-full text-center">
                    <div><h1 className = "text-2xl mt-4">Gabir Motors Cup, Season { calendar && calendar.season }</h1></div>
                    <table>
						<thead>
							<tr>
								<th>Date</th>
								<th>Track</th>
								<th>Car</th>
								<th>Notes</th>
							</tr>
						</thead>
						<tbody>
						{ calendar && calendar.events.map((event, index) => (
							<CalendarRow key = {index} event = {event} />
						)) }
						</tbody>
					</table>
                </div>
			</div>
		</>
	)
}

export default Calendar;