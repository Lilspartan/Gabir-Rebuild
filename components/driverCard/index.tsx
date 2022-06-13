import { useState, useEffect } from 'react'
import { Driver, Session } from "../../utils/interfaces";
import secondsToFormatted from '../../utils/secondsToFormatted';
import { Card } from '../'

type Props = {
    driver: Driver | null;
    session: Session;
}

const DriverCard = ({ driver, session }: Props) => {
    if (driver === null || driver === undefined) {
        return (
            <Card title = "Driver Inspector">
                <h1 className = "font-bold text-center text-xl">Click on a Driver</h1>
            </Card>
        )
    } else {
        // console.log(driver.raceData.lap)
        return (
            <Card title = "Driver Inspector">
                <h1 className = "font-bold text-center text-xl">#{ driver.carNumber } { driver.name }</h1>
                <hr className = "m-4"/>
                <div className = "flex flex-col md:flex-row">
                    <div className = "md:pr-8">
                        <span className = "font-bold">position: <span className = "font-normal">{ driver.raceData.position }</span></span><br />
                        <span className = "font-bold">Lap: <span className = "font-normal">{ driver.raceData.lap }</span></span><br />
                        <span className = "font-bold">Best Lap Time: <span className = "font-normal">{ secondsToFormatted(driver.lapTimes.best.time) } (Lap { driver.lapTimes.best.lap })</span></span><br />
                        <span className = "font-bold">Last Lap Time: <span className = "font-normal">{ secondsToFormatted(driver.lapTimes.last) }</span></span><br />
                        <span className = "font-bold">Fast Repairs Used: <span className = "font-normal">{ driver.raceData.fastRepairsUsed } / { session.session.fastRepairs }</span></span><br />
                    </div>

                    <div>
                        <span className = "font-bold">Gear: <span className = "font-normal">{ driver.carData.gear }</span></span><br />
                        <span className = "font-bold">RPM: <span className = "font-normal">{ driver.carData.rpm.toFixed(0) }</span></span><br />     
                    </div>
                </div>
            </Card>
        )
    } 
}

export default DriverCard