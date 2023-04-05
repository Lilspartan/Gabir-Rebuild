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