import { useSession } from "next-auth/react";
import { SEO, Navbar, Modal, Alert, AlertArea, Button } from '../../components';
import { useState, useEffect } from 'react';
import { NewEvent } from '../../utils/interfaces';
import { CgMathPlus } from "react-icons/cg";

interface Calendar {
    name: string;
    tags: string[];
    events: {
        [key in number]: NewEvent;
    };
    permissions: CalendarPermission[]
}

type Permission = "CREATE_EVENTS" | "DELETE_EVENTS" | "UPDATE_EVENTS" | "ADMIN";

interface CalendarPermission {
    userID: string;
    permissions: Permission[];
}

export default function Calendar() {
    const { data: session } = useSession()

    const [newCalendar, setNewCalendar] = useState<Calendar>();

    const createNewCalendar = () => {
        setNewCalendar({
            name: prompt("What is the name of your new calendar?"),
            tags: [],
            events: {},
            permissions: [
                {
                    userID: session.userData._id,
                    permissions: [ "ADMIN" ],
                }
            ]
        })
    }

    const addEvent = () => {
        setNewCalendar({
            ...newCalendar,
            events: {
                ...newCalendar.events,
                [Date.now()]: {
                    track: {
                        name: "",
                        paid: false,
                    },
                    cars: [],
                    winner: null,
                    notes: null,
                    timestamp: Date.now(),
                    tags: []
                }
            }
        })
    }

    return (
        <>
			<SEO title = {`Gabir Motors | Dashboard`} />
 
			<Navbar />

			<div className = "min-h-screen absolute overflow-hidden text-white max-w-full w-screen">
                <div className = "content-center min-h-screen background-carbon_fiber w-full text-center">
                    <div className = "grid place-items-center min-h-screen mx-4 my-8">
                        { session && (
                            <>
                                <div className = "bg-dark-card-handle p-16 flex flex-col lg:w-1/2 rounded-lg">
                                    <div className = "flex flex-col gap-8">
                                        <a href="#" onClick = {createNewCalendar}>Create new calendar</a>

                                        { newCalendar && (
                                            <div>
                                                <h1 className = "font-extrabold text-3xl">{ newCalendar.name }</h1>

                                                <div className = "inline-block mr-4 mt-2 bg-[#333333] rounded-full p-3 cursor-pointer" onClick = {addEvent}>
                                                    <CgMathPlus className = "text-white text-2xl" />
                                                </div>

                                                <div className="flex flex-col gap-2">
                                                    { Object.keys(newCalendar.events).map((event_id) => {
                                                        let event = newCalendar.events[event_id];

                                                        return (
                                                            <div className = "bg-[#333333] rounded-lg py-2 px-2 flex flex-row gap-4">
                                                                <div>{ event.timestamp }</div>
                                                                <div>
                                                                    <input className="bg-[#222222] rounded-md py-2 px-4 text-xl" type = "datetime-local" onChange = {(e) => {
                                                                        setNewCalendar({
                                                                            ...newCalendar,
                                                                            events: {
                                                                                ...newCalendar.events,
                                                                                [ event_id ]: {
                                                                                    ...event,
                                                                                    timestamp: new Date(e.target.value).getTime()
                                                                                }
                                                                            }
                                                                        })

                                                                        console.log(new Date(event.timestamp).toISOString().replace(":00.000Z", ""), e.target.value)
                                                                    }} value = {new Date(event.timestamp).toISOString().replace(":00.000Z", "")} />
                                                                </div>
                                                                <div>{ event.timestamp }</div>
                                                            </div>
                                                        )
                                                    }) }
                                                </div>
                                            </div>
                                        ) }
                                    </div>
                                </div>
                            </>
                        ) }
                    </div>
                </div>
			</div>
		</>
    )
}

Calendar.auth = true