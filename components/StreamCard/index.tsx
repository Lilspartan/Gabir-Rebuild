import { useState, useEffect } from 'react'
import Draggable from 'react-draggable'
import { MdOutlineClear } from 'react-icons/md';

const StreamCard = (props) => {
    const [location, setLocation] = useState("pitwall.gabirmotors.com");

    useEffect(() => {
        setLocation(window.location.hostname);
    }, [])

    return (
        <Draggable 
            handle = ".handle"
            bounds = {"#bg"}    
            grid = {[1, 1]}
        >
            <div className = {`mx-4 z-40 absolute text-white dark:text-white shadow-2xl`}>
                <div className = {`handle transition duration-300 p-4 mt-8 bg-light-card-handle dark:bg-dark-card-handle flex flex-row justify-between rounded-t-lg select-none`}>
                    <h1 className = "font-bold cursor-default">Twitch Stream</h1>
                    <span className = "">
                        <a className = "cursor-pointer p-2" onClick = {() => {
                            props.closeWindow(false)
                        }}>
                            <MdOutlineClear className = "inline text-xl"/>
                        </a>
                    </span>
                </div>
                <iframe src={`https://player.twitch.tv/?channel=${props.channel}&parent=${location}`} className = "rounded-b-lg" allowFullScreen = {true} frameBorder="0" scrolling="no" height="270" width="480"></iframe>
            </div>
        </Draggable>
    )    
}

export default StreamCard;
