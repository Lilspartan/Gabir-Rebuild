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