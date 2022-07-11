import { Driver, Session } from "../../utils/interfaces";
import secondsToFormatted from '../../utils/secondsToFormatted';
import { Card } from '../'
import { BsChevronUp, BsChevronDown, BsDash } from 'react-icons/bs';

type Props = {
    driver: Driver | null;
    session: Session;
}

const DriverCard = ({ driver, session }: Props) => {
    if (driver === null || driver === undefined) {
        return (
            <Card title = "Driver Inspector" id = "driver-card">
                <h1 className = "font-bold text-center text-xl">Click on a Driver</h1>
            </Card>
        )
    } else {
        // console.log(driver.raceData.lap)
        return (
            <Card title = "Driver Inspector" id = "driver-card">
                <h1 className = "font-bold text-center text-xl">#{ driver.carNumber } { driver.name }</h1>
                <hr className = "m-4"/>
                <div className = "flex flex-col md:flex-row">
                    <div className = "md:pr-8">
                        <span className = "font-bold">Position: <span className = "font-normal mr-2">{ driver.raceData.position }</span>
                        { driver.qualifyingResult !== null ? (
                            <span className = "text-black dark:text-white font-normal">{ (driver.qualifyingResult.position + 1 < driver.raceData.position) ? (
                                <BsChevronDown className = "text-2xl text-red-600 inline stroke-1" />
                            ) : (
                                driver.qualifyingResult.position + 1 === driver.raceData.position ? (
                                    <BsDash className = "text-2xl text-gray-500 dark:text-gray-400 inline stroke-1" />
                                ) : (
                                    <BsChevronUp className = "text-2xl text-green-500 inline stroke-1" />
                                )
                            ) } { Math.abs(driver.raceData.position - (driver.qualifyingResult.position + 1)) !== 0 ? Math.abs(driver.raceData.position - (driver.qualifyingResult.position + 1)) : "" }</span>
                        ) : "" }
                        </span><br />
                        <span className = "font-bold">Lap: <span className = "font-normal">{ driver.raceData.lap }</span></span><br />
                        <span className = "font-bold">Best Lap Time: <span className = "font-normal">{ secondsToFormatted(driver.lapTimes.best.time) } { driver.lapTimes.best.time === -1 ? "" : <span>(Lap { driver.lapTimes.best.lap })</span> }</span></span><br />
                        <span className = "font-bold">Last Lap Time: <span className = "font-normal">{ secondsToFormatted(driver.lapTimes.last) }</span></span><br />
                        <span className = "font-bold">Quick Repairs Used: <span className = "font-normal">{ driver.raceData.fastRepairsUsed } / { session.session.fastRepairs }</span></span><br />
                    </div>

                    <div className = "md:pr-8">
                        <span className = "font-bold">Gear: <span className = "font-normal">{ driver.carData.gear }</span></span><br />
                        <span className = "font-bold">RPM: <span className = "font-normal">{ driver.carData.rpm.toFixed(0) }</span></span><br />    
                        <span className="italic font-bold">{ driver.raceData.onPitRoad ? "In The Pits" : "" }</span> 
                    </div>

                    {driver.qualifyingResult !== null ? (
                        <div>
                            <span className = "font-bold">Qualified: <span className = "font-normal">{ driver.qualifyingResult.position + 1 }</span></span><br />     
                            <span className = "font-bold">Qualifying Time: <span className = "font-normal">{ secondsToFormatted(driver.qualifyingResult.fastestLap) }</span></span><br />     
                        </div>
                    ) : ""}
                </div>
            </Card>
        )
    } 
}

export default DriverCard