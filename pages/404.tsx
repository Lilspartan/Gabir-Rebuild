import { Button, Loading, SEO , CalendarRow, Navbar, Modal } from '../components';

const Page404 = ()  => {
	return (
		<>
			<SEO 
				title = "Gabir Motors | 404" 
				description = "View the schedule for the Gabir Motors Cup" 
				url = "calendar"
			/>

			<Navbar />
			
			<div className = "min-h-screen absolute overflow-hidden text-white max-w-full w-screen">
                <div className = "grid place-items-center min-h-screen background-carbon_fiber w-full text-center">
                    <div className = "w-1/2">
                        <img src="https://gabirmotors.com/2.png" alt="" className = "rounded-lg mx-auto" />

                        <h2 className = "text-7xl font-extrabold mt-4">404</h2>
                        <h3 className = "text-4xl">They say you cut the course!</h3>

                        <div className = "mt-8 text-2xl">
                            <span>Here are some links to help you get where you want to be</span>
                            <div className="flex flex-row justify-evenly">
                                <a href="/tools/specmapping" className="link">Spec Mapping</a>
                                <a href="/calendar" className="link">Calendar</a>
                                <a href="/tutorials" className="link">Tutorials</a>
                                <a href="/assets" className="link">Assets</a>
                            </div>
                        </div>
                    </div>
                </div>
			</div>
		</>
	)
}

export default Page404;