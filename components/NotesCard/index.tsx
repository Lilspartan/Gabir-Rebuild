import { useState, useEffect } from 'react';
import { Card } from '..';

const NotesCard = (props) => {
	const [notes, setNotes] = useState((typeof window !== "undefined" && localStorage.getItem("notepad-contents") !== null) ? localStorage.getItem("notepad-contents") : "");
	
	return (
		<Card title = "Notepad"  dismissible = {true} onDismiss = {props.setDismissedCards} dismissedCards = {props.dismissedCards}>
			<textarea placeholder = "Take some notes..." rows = {10} onChange = {(e) => {
				setNotes(e.target.value);
				localStorage.setItem("notepad-contents", e.target.value);
			}} className = "bg-light-card-body dark:bg-dark-card-body border-0 w-full p-4 resize-y rounded-lg">{ notes }</textarea>
		</Card>
	)
}

export default NotesCard;