import { useState, useEffect } from 'react';
import { Button, Loading, SEO, Navbar, Modal, Alert, AlertArea } from '../components';
import { Standing } from '../utils/interfaces';
import { motion } from 'framer-motion';
import axios from 'axios';
import Chart from 'chart.js/auto'

import {CategoryScale} from 'chart.js'; 
Chart.register(CategoryScale);
import { Line } from 'react-chartjs-2';

const Standings = ()  => {
	const [loading, setLoading] = useState(true);
    const [standings, setStandings] = useState<Standing[]>();
    const [colors, setColors] = useState({});
    const [standingHighlight, setStandingHighlight] = useState<Standing | null>(null);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
		(async () => {
			let standingsRes = await axios.get('https://api.gabirmotors.com/standings');
            let data = standingsRes.data;
            
            setStandings(data);

            let colorsRes = await axios.get('https://i.gabirmotors.com/assets/teams/colors.json');
            let colorsData = colorsRes.data;

            setColors(colorsData);
        })()

		setTimeout(() => {
			setLoading(false);
		}, 500)
	}, [])

    const highlight = (standing: Standing) => {
        setModalOpen(true);
        setStandingHighlight(standing);
    }

    useEffect(() => {
        if (standingHighlight !== null) {
            let data = [];

            for (let i = 0; i < standingHighlight.points.length; i ++) {
                data.push({
                    week: i + 1,
                    points: standingHighlight.points[i],
                })
            }
        }
    }, [standingHighlight])

	return (
		<>
			<SEO 
				title = "Gabir Motors | Standings" 
				description = "See the current standings in the Gabir Motors Cup" 
				url = "standings"
			/>

			<Loading loading = { loading } />

			<Navbar />

            <AlertArea>
                <Alert type = "tip" permaDismiss id = "click-for-more-info"><span className="font-bold">Tip:</span> Click on a driver to see more in-depth information</Alert>
            </AlertArea>
			
            <Modal 
                open = {modalOpen && standingHighlight !== null} 
                setOpen={setModalOpen} 
                closeButton 
                id = "standings-highlight"
            >
                { standingHighlight !== null && <h1 className = "text-2xl"><span className="font-bold">Standings Overview:</span> { standingHighlight.name }</h1> }

                <table className = "hidden md:block mt-8 mb-4">
                    <thead>
                        <tr className = "text-zinc-400 text-sm" style = {{ borderWidth: "1px 0", borderColor: "#666666AA" }}>
                            {standingHighlight !== null && standingHighlight.points.map((point, index) => (
                                <th className = "font-normal px-2 py-1">Week { index + 1 }</th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        <tr>
                            {standingHighlight !== null && standingHighlight.points.map((point, index) => (
                                <td className = "text-center" key = { index }>{ point }</td>
                            ))}
                        </tr>
                    </tbody>
                </table>

                <div className="md:hidden flex flex-col w-2/3 mx-auto mt-4">
                    <div className="flex flex-row justify-between text-lg px-4 font-bold" style = {{ borderWidth: "1px 0", borderColor: "#666666AA" }}>
                        <span>Week</span>
                        <span>Points</span>
                    </div>
                    { standingHighlight !== null && standingHighlight.points.map((point, index) => (
                        <div className="flex flex-row justify-between text-lg px-8" style = {{ borderWidth: "1px 0", borderColor: "#666666AA" }}>
                            <span>{ index + 1 }</span>
                            <span>{ point }</span>
                        </div>
                    )) }
                </div>

                { standingHighlight !== null && (
                    <div className="hidden md:block">
                        <Line
                            datasetIdKey='id'
                            data={{
                                labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6", "Week 7", "Week 8", "Week 9", "Week 10", "Week 11", "Week 12"],
                                datasets: [
                                    {
                                        label: standingHighlight.name,
                                        data: standingHighlight.points.map((point, index) => {
                                            if (point === "-") return null;
                                            else return point;  
                                        }),
                                        backgroundColor: "#FF830066",
                                        borderColor: "#FF8300"
                                    },
                                ],
                            }}
                            options = {{
                                scales: {
                                    y: {
                                        min: 0,
                                        max: 40
                                    }
                                }
                            }}
                        />
                    </div>
                ) }
            </Modal>

			<div className = "min-h-screen absolute overflow-hidden text-white max-w-full w-screen">
                <div className = "flex flex-col content-center min-h-screen background-carbon_fiber w-full text-center">
                    <div><h1 className = "md:text-2xl text-4xl mt-4">Gabir Motors Cup Standings</h1></div>
                    <div className="hidden md:block w-screen">
						<table className = "text-left text-xl mt-6 w-full">
							<thead>
								<tr className = "text-zinc-400 text-sm" style = {{ borderWidth: "1px 0", borderColor: "#666666AA" }}>
									<th className = "px-4 py-4 font-normal">TEAM</th>
									<th className = "font-normal">POS.</th>
									<th className = "font-normal">NAME</th>
									<th className = "font-normal">POINTS</th>
									<th className = "font-normal">WINS</th>
									<th className = "font-normal">PODIUMS</th>
								</tr>
							</thead>
							<tbody>
                                { standings && standings.sort((a, b) => {
                                    let pos1 = a.pos;
                                    let pos2 = b.pos;

                                    if (pos1[0] === "C") pos1 = "500";
                                    if (pos2[0] === "C") pos2 = "500";

                                    return Number(pos1) - Number(pos2);
                                }).map((standing, index) => {
                                    let teamAbbr = "";

                                    switch (standing.team) {
                                        case "A.S.S.": teamAbbr = "ASS"; break;
                                        case "G.L.H.F.": teamAbbr = "GLHF"; break;
                                        case "Team CHOSEN": teamAbbr = "CT"; break;
                                        case "Gabir Motors": teamAbbr = "GM"; break;
                                        case "Jabir Motors": teamAbbr = "JM"; break;
                                        case "Lone Wolf Pack": teamAbbr = "LWP"; break;
                                        case "S.E.N.D.I.T.": teamAbbr = "SENDIT"; break;
                                        case "Future War Cult": teamAbbr = "FWC"; break;
                                        case "Hive Mind Alliance": teamAbbr = "HMA"; break;
                                    }

                                    return (
                                        <motion.tr
                                            key = { index }
                                            initial = {{ opacity: 0, x: "5%", backgroundColor: "#00000000" }}
                                            viewport = {{ once: true, margin: "-10px" }} 
                                            whileInView = {{ opacity: 1, x: 0 }}
                                            whileHover = {{ backgroundColor: "#66666666", transition: { duration: 0.1 } }}
                                            className = "cursor-pointer"
                                            onClick = {() => {
                                                highlight(standing);
                                            }}
                                        >
                                            <td style = {{ borderWidth: "0 0 0 5px", borderColor: colors[teamAbbr] }} className = {`${standing.pos === "C1" && "mt-16"} w-48 py-3`}><img className = "h-8 ml-4" src = {`https://i.gabirmotors.com/assets/teams/${teamAbbr}/main.png`} alt = {standing.team + " logo"} /></td>
                                            <td>{ standing.pos }</td>
                                            <td>{ standing.name }</td>
                                            <td>{ standing.seasonPoints }</td>
                                            <td>{ standing.wins }</td>
                                            <td>{ standing.podiums }</td>
                                        </motion.tr>
                                    )
                                }) }
							</tbody>
						</table>
					</div>

                    <div className="visible md:hidden w-screen mt-16">
                        <div className="flex flex-col">
                            { standings && standings.sort((a, b) => {
                                let pos1 = a.pos;
                                let pos2 = b.pos;

                                if (pos1[0] === "C") pos1 = "500";
                                if (pos2[0] === "C") pos2 = "500";

                                return Number(pos1) - Number(pos2);
                            }).map((standing, index) => (
                                <div className = "flex flex-col p-4" onClick = {() => {
                                    highlight(standing);
                                }} style = {{ borderWidth: "1px 0", borderColor: "#666666AA" }}>
                                    <h2 className = "text-left text-2xl"><span className = "font-bold">{ standing.pos }.</span> { standing.name }</h2>
                                
                                    <div className = "flex flex-row gap-4">
                                        <span className = "font-bold text-lg">Points: <span className="font-normal">{ standing.seasonPoints }</span></span>
                                        <span className = "font-bold text-lg">Wins: <span className="font-normal">{ standing.wins }</span></span>
                                        <span className = "font-bold text-lg">Podiums: <span className="font-normal">{ standing.podiums }</span></span>
                                    </div>
                                </div>
                            )) }
                        </div>
                    </div>
                </div>
			</div>
		</>
	)
}

export default Standings;