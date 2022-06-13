import { useState, useEffect } from 'react';
import { Card } from '..';

const NotesCard = () => {
	const [notes, setNotes] = useState((typeof window !== "undefined" && localStorage.getItem("notepad-contents") !== null) ? localStorage.getItem("notepad-contents") : "");

	console.log(typeof window !== "undefined" && localStorage.getItem("notepad-contents") !== null);
	
	return (
		<Card title = "Notepad">
			<textarea placeholder = "Take some notes..." rows = {10} onChange = {(e) => {
				setNotes(e.target.value);
				localStorage.setItem("notepad-contents", e.target.value);
			}} className = "bg-[#222222] border-0 w-full p-4 resize-y">{ notes }</textarea>
		</Card>
	)
}

export default NotesCard;