import { useState, useEffect } from 'react'
import { FiMinimize2, FiMaximize2 } from 'react-icons/fi';

const Card = (props:any) => {
    const [open, setOpen] = useState(true);

    const minimize = () => { setOpen(false); }
    const maximize = () => { setOpen(true); }

	return (
		<div className = {`mx-4`}>
			<div className = {`transition duration-300 p-4 mt-8 bg-light-card-handle dark:bg-dark-card-handle flex flex-row justify-between ${open ? "rounded-t-lg" : "rounded-lg"} select-none`}>
				<h1 className = "font-bold cursor-default">{ props.title || "Unnamed Window" }</h1>
				<span className = "">
					{open ? (
						<a className = "cursor-pointer p-2" onClick = {minimize}>
							<FiMinimize2 className = "inline"/>
						</a>
					): (
						<a className = "cursor-pointer p-2" onClick = {maximize}>
							<FiMaximize2 className = "inline" />
						</a>
					)}
				</span>
			</div>
			{open ? (
				<div className = {`transition duration-300 drop-shadow-lg backdrop-blur-sm px-8 pb-8 pt-4 rounded-b-lg bg-light-card-body dark:bg-dark-card-body origin-top ${open ? "" : "invisible"}`}>
					{ props.children }
				</div>
			) : ""}
		</div>
	)
}

export default Card