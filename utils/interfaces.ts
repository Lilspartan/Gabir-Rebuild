export interface Calendar {
	season: string;
	name:   string;
	events: Event[];
	getNext(): Event | null;
}

export interface Event {
	track:      Content;
	cars:       Content[];
	winner: {
		name:     string | null;
		number:   string | null;
	};
	notes:      string | null;
	theme:      string | null;
	date:       string;
	timestamp:  number;
	tags:       string[];
	hasPassed:  boolean;
}

export interface Content {
	name: string;
	paid: string;
}

export interface Driver {
	name:        string;
	username:    string | null;
	team?:       Team;
	car_number:  string;
	links?:    	 ProfileLink[];
	account_id?: string;  
}

export interface ProfileLink {
	type: string;
	text: string;
}

export interface Team {
	name:               string;
	abbr:               string;
	social_media_links: Link[];
	logo:               string;
	team_leader:        string;
	drivers:            Driver[];
}

export interface Link {
	type: string;
	link:  string;
}

export interface File {
    path: string;
    name: string;
    size: number;
    extension: string;
    type: "file";
}

export interface Folder {
    path: string;
    name: string;
    children:(File | Folder)[];
    size: Number;
    type: "directory";
}

export interface Standing {
	points:       Array<"-" | number>;
	pos:          string;
	name:         string;
	team:         StandingTeam;
	totalPoints:  number;
	seasonPoints: number;
	podiums:      number;
	wins:         number;
	accountId:    number;
}

type StandingTeam = "Hive Mind Alliance" | "Jabir Motors" | "Lone Wolf Pack" | "G.L.H.F." | "Future War Cult" | "S.E.N.D.I.T." | "Team CHOSEN" | "A.S.S." | "Gabir Motors"

export interface ArticleMetaData {
	title:     string;
	subtitle:  string;
	edited:    string;
	date:      string;
	authorID:  number;
	headerImg: string | null;
	headerAlt: string | null;
	tags:      string[];
	slug?:     string;
	hidden:    boolean;
}

export interface Preferences {
	theme: "dark" | "light";
	solidBackground: boolean;
}

export type DownforceValue = 
	"UNKNOWN" | 
	"MINIMUM" | 
	"LOW" | 
	"LOW or MEDIUM" | 
	"MEDIUM" | 
	"MEDIUM or HIGH" |
	"HIGH" |
	"MAXIMUM"

export type DownforceCar = "F3" | "GT3" | "LMP2"

export interface DownforceGuide {
	[key: string]: {
		[key in DownforceCar]: DownforceValue;
	}
}

export interface PitwallData {
	name:          string;
	fuelIsPublic:  boolean;
	password:      string;
	missedPings:   number;
	fastestLap:    FastestLap[];
	fastestDriver: P_Driver;
	drivers:       P_Driver[];
	session:       PitwallDataSession;
	driverData:    DriverData;
}

export interface DriverData {
	tiresRemaining: TiresRemaining;
	fuel:           Fuel;
	carIndex:       number;
	driver:         P_Driver;
	laps:           Lap[];
}

export interface P_Driver {
	carIndex:         number;
	name:             string;
	userID:           number;
	carNumber:        string;
	isPaceCar:        boolean;
	raceData:         RaceData;
	carData:          CarData;
	lapTimes:         LapTimes;
	flags:            Flag[];
	qualifyingResult: QualifyingResult;
	class:            Class;
	teamName:         string;
	license:          License;
	isSpectator:      boolean;
	isAI:             boolean;
	estTimeIntoLap:   number;
}

export interface CarData {
	trackSurface: TrackSurface;
	steer:        number;
	rpm:          number;
	gear:         number;
}

export type TrackSurface =
	"OnTrack" |
	"OffTrack" |
	"AproachingPits" | 
	"InPitStall" |
	"NotInWorld" |
	string

export interface Class {
	car:   string;
	color: string;
	id:    number;
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
	"Servicible" |
	"StartSet" |
	"StartGo" |
	"Disqualify" |
	"Furled" |
	"Black" |
	string

export interface LapTimes {
	last: number;
	best: Best;
}

export interface Best {
	time: number;
	lap:  number;
}

export interface License {
	iRating:         number;
	licenseLevel:    number;
	licenseSubLevel: number;
	licenseName:     string;
	licenseColor:    string | null;
}

export interface QualifyingResult {
	position:      number;
	classPosition: number;
	fastestLap:    number;
	fastestTime:   number;
}

export interface RaceData {
	position:        number;
	onPitRoad:       boolean;
	class:           number;
	f2Time:          number;
	lap:             number;
	lapsCompleted:   number;
	fastRepairsUsed: number;
	lapPercent:      number;
}

export interface Fuel {
	remaining: number;
	percent:   number;
}

export interface Lap {
	lapNumber:         number;
	fuelAtStartPct:    number;
	fuelAtStartLiters: number;
	lapTime:           number;
	fuelUsedLiters:    number;
	fuelUsedPct:       number;
	sessionType:       string;
}

export interface TiresRemaining {
	left:  Left;
	right: Left;
}

export interface Left {
	front: number;
	rear:  number;
}

export interface FastestLap {
	CarIdx:      number;
	FastestLap:  number;
	FastestTime: number;
}

export interface PitwallDataSession {
	flags:           string[];
	isPALeagueRace:  boolean;
	focusedCarIndex: number;
	session:         SessionSession;
	track:           Track;
	weather:         Weather;
}

export interface SessionSession {
	number:        number;
	type:          string;
	timeRemaining: number;
	fastRepairs:   number;
	fastestLap:    FastestLap[];
}

export interface Track {
	name:        string;
	id:          number;
	city:        string;
	country:     string;
	temperature: string;
	length:      string;
}

export interface Weather {
	windSpeed:   string;
	temperature: string;
	skies:       string;
}

// Generated by https://quicktype.io

export interface IracingAPIData {
	recentAwards:   RecentAward[];
	activity:       null;
	imageUrl:       string;
	profile:        Profile[];
	memberInfo:     MemberInfo;
	fieldDefs:      FieldDef[];
	licenseHistory: License[];
	isGenericImage: boolean;
	followCounts:   FollowCounts;
	success:        boolean;
	disabled:       boolean;
	recentEvents:   RecentEvent[];
	custId:         number;
}

export interface FieldDef {
	fieldId:       number;
	name:          string;
	value:         null;
	editable:      boolean;
	label:         string;
	section:       Section;
	rowOrder:      number;
	column:        number;
	numberOfLines: number;
}

export enum Section {
	Bio = "Bio",
	Favorites = "Favorites",
	Header = "Header",
	Personal = "Personal",
}

export interface FollowCounts {
	followers: number;
	follows:   number;
}

export interface License {
	categoryId:     number;
	category:       string;
	licenseLevel:   number;
	safetyRating:   number;
	cpi:            number;
	irating:        number;
	ttRating:       number;
	color:          string;
	groupName:      string;
	groupId:        number;
	mprNumRaces?:   number;
	proPromotable?: boolean;
	mprNumTts?:     number;
}

export interface MemberInfo {
	custId:      number;
	displayName: string;
	helmet:      Helmet;
	lastLogin:   string;
	memberSince: string;
	clubId:      number;
	clubName:    string;
	ai:          boolean;
	licenses:    License[];
}

export interface Helmet {
	pattern:    number;
	color1:     string;
	color2:     string;
	color3:     string;
	faceType:   number;
	helmetType: number;
}

export interface Profile {
	fieldId?: number;
	name:     string;
	value:    string;
	editable: boolean;
	label?:   string;
}

export interface RecentAward {
	memberAwardId:      number;
	custId:             number;
	awardId:            number;
	awardDate:          string;
	subsessionId?:      number;
	description:        string;
	awardedDescription: string;
	viewed:             boolean;
	name:               string;
	groupName:          string;
	iconUrlSmall:       string;
	iconUrlLarge:       string;
	iconUrlUnawarded:   string;
	weight:             number;
	awardCount:         number;
	awardOrder:         number;
	achievement:        boolean;
}

export interface RecentEvent {
	eventType:        string;
	subsessionId:     number;
	startTime:        string;
	eventId:          number;
	eventName:        string;
	simsessionType:   number;
	startingPosition: number;
	finishPosition:   number;
	bestLapTime:      number;
	percentRank:      number;
	carId:            number;
	carName:          string;
	logoUrl:          null | string;
	track:            Track;
}

export interface Track {
	trackId:    number;
	trackName:  string;
	configName: string;
}
