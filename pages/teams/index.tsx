import { useState, useEffect } from 'react';
import { Button, Loading, SEO} from '../../components';
import classnames from 'classnames';
import { Client } from "gabir-motors";
import { Team, Driver } from '../../utils/interfaces';

const client = new Client();

const Teams = ()  => {
	const [loading, setLoading] = useState(true);
    const [teams, setTeams] = useState<Team[] | null>(null);

	useEffect(() => {
		(async () => {
			let t = await client.getTeam();
			setTeams(t);
			console.log(t)
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
                <div className = "content-center min-h-screen background-carbon_fiber w-full text-center">
                    <div className = "grid lg:grid-cols-2 grid-cols-1 gap-8 content-center min-h-screen lg:w-4/5 mx-auto my-8">
                        { teams !== null && teams.map(team => (
                            <div className = "w-1/2 mx-auto my-auto hover:-translate-y-2 hover:scale-105 cursor-pointer transition diration-500">
                                <img src={`https://i.gabirmotors.com/assets/teams/${team.abbr}/main.png`} alt={`${team.name} Logo`} />
                            </div>
                        )) }
                    </div>
                </div>
			</div>
		</>
	)
}

export default Teams;