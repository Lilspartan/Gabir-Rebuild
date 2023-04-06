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
	name:      string;
	username:  string | null;
	team?:     Team;
	car_number: string;
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