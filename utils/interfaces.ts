export interface RaceData {
	position: number;
	onPitRoad: boolean;
	class: number;
	f2Time: number;
	lap: number;
	lapsCompleted: number;
}

export interface Driver {
	carIndex?: number;
	name: string;
	userID: number;
	carNumber: string;
	classID: number;
	isPaceCar: boolean;
	raceData: RaceData;
}

export interface Session {
    flags: Flag[],
    session: {
        number: number,
        type: "PRACTICE" | "QUALIFY" | "RACE",
        timeRemaining: number,
		fastRepairs: number | string,
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
	string