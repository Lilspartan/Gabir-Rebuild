import { useState, useEffect } from 'react';
import { Loading, SEO, Navbar } from '../../components';
import { Client } from "gabir-motors";
import { Team, Driver } from '../../utils/interfaces';
import { useRouter } from 'next/router'

const client = new Client();

const Teams = ()  => {
	const [loading, setLoading] = useState(true);
    const [team, setTeam] = useState<Team | null>(null);

    const router = useRouter()
    const { team: teamAbbr } = router.query

	useEffect(() => {
		(async () => {
			let t = await client.getTeam(teamAbbr);
			setTeam(t);
			console.log(t)
		})()

		setTimeout(() => {
			setLoading(false);
		}, 500)
	}, [])

	return (
		<>
			<SEO title = {`Gabir Motors | Team Overview`} />

			<Loading loading = { loading } />
 
			<Navbar />

			<div className = "min-h-screen absolute overflow-hidden text-white max-w-full w-screen">
                <div className = "content-center min-h-screen background-carbon_fiber w-full text-center">
                    <div className = "grid place-items-center min-h-screen mx-4 my-8">
                        { team !== null && (
                            <>
                                <div className = "bg-dark-card-handle p-16 flex flex-col lg:w-1/3">
                                    <div className = "mb-6"> 
                                        <img className = "mx-auto" src={`https://i.gabirmotors.com/assets/teams/${team.abbr}/main.png`} alt={`${team.name} Logo`} />
                                    </div>
                                    
                                    <div className="flex flex-col">
                                        <h2 className = "text-4xl font-bold">{ team.name }</h2>
                                        <h3>Team Leader: { team.team_leader }</h3>

                                        <table className = "text-left mt-4 border-separate">
                                            <tr className = "opacity-60 text-sm font-thin">
                                                <th>Name</th>
                                                <th>Number</th>
                                            </tr>

                                            <tbody>
                                                { team.drivers.map((driver, i) => (
                                                    <tr key = { i }>
                                                        <td className = "mt-2">{ driver.name }</td>
                                                        <td>{ driver.car_number !== "-1" ? driver.car_number : "N/A" }</td>
                                                    </tr>
                                                )) }
                                            </tbody>
                                        </table>
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

export default Teams;