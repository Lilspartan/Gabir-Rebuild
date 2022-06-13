import { MouseEventHandler } from 'react';

export interface RaceData {
	position:         number;
	onPitRoad:        boolean;
	class:            number;
	f2Time:           number;
	lap:              number;
	lapsCompleted:    number;
	fastRepairsUsed:  number;
}

export interface CarData {
	trackSurface:  TrackSurface;
	steer:         number;
	rpm:           number;
	gear:          number;
}

export interface Driver {
	carIndex:   number;
	name:       string;
	userID:     number;
	carNumber:  string;
	classID:    number;
	isPaceCar:  boolean;
	raceData:   RaceData;
	carData:    CarData;
	lapTimes:   LapTimes;
	flags:      Flag[];
}

export interface LapTimes {
	last:     number;
	best: {
		time:   number;
		lap:    number;
	}
}

export interface Session {
    flags: Flag[],
    session: {
        number: number,
        type: SessionType,
        timeRemaining: number,
				fastRepairs: number | string,
				fastestLap: FastestLap | null
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

export interface FastestLap {
	CarIdx: number;
	FastestLap: number;
	FastestTime: number;
}

export type SessionType = 
	"PRACTICE" |
	"QUALIFY" |
	"RACE" |
	"LOADING"

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

export type Connection = 
	"disconnected" |
	"connected" |
	"connecting"

export interface DriverData {
	tiresRemaining: {
		left: {
			front: number,
			rear: number,
		},
		right: {
			front: number,
			rear: number,
		}
	},
	fuel: {
		remaining: number,
		max: number,
	}
}

export interface DismissedCard {
	id: string;
	reopen: MouseEventHandler;
	name: string;
}