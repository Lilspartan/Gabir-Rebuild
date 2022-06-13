export interface RaceData {
	position: number;
	onPitRoad: boolean;
	class: number;
	f2Time: number;
	lap: number;
	lapsCompleted: number;
	fastRepairsUsed: number;
}

export interface CarData {
	trackSurface: TrackSurface;
	steer: number;
	rpm: number;
	gear: number;
}

export interface Driver {
	carIndex: number;
	name: string;
	userID: number;
	carNumber: string;
	classID: number;
	isPaceCar: boolean;
	raceData: RaceData;
	carData: CarData;
	lapTimes: {
		last: number;
		best: {
			time: number;
			lap: number;
		}
	};
	flags: Flag[];
}

export interface Session {
    flags: Flag[],
    session: {
        number: number,
        type: "PRACTICE" | "QUALIFY" | "RACE",
        timeRemaining: number,
		fastRepairs: number | string,
		fastestLap: {
			CarIdx: number,
			FastestLap: number,
			FastestTime: number
		} | null
    },
	track: {
		name: string,
		city: string,
		country: string,  
		temperature: string,
		length: string;
	  },
	  weather: {
		  windSpeed: string,
		  temperature: string,
		  skies: string
	  }
}

export type Flag = 
	"OneLapToGreen" | 
	"StartReady" |
	"Caution" |
	"StartHidden" |
	"Checkered" | 
	"Green" |
	"GreenHeld" |
	"CautionWaving" |
	"White" |
	string

export type TrackSurface =
	"OnTrack" |
	"AproachingPits" | 
	"InPitStall" |
	"NotInWorld" |
	string