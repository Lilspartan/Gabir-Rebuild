import { useState, useEffect } from 'react'
import Draggable from 'react-draggable'
import { VscEmptyWindow } from 'react-icons/vsc';
import { FiMinimize2, FiMaximize2 } from 'react-icons/fi';
import { BsPinAngle, BsPinAngleFill } from 'react-icons/bs';

const Card = (props:any) => {
    const [open, setOpen] = useState(true);
    const [pinned, setPinned] = useState(true);

    let windowObjectReference;
    let windowFeatures = "left=100,top=100,width=400,height=600";
    let width = typeof window !== "undefined" && window.innerWidth <= 900;

    const popout = () => {
        windowObjectReference = window.open(props.popout, props.title, windowFeatures);
    }

    const minimize = () => { setOpen(false); }
    const maximize = () => { setOpen(true); }
    const pin = () => { setPinned(true); }
    const unpin = () => { setPinned(false); }
    
    return (
        <Draggable 
            handle = ".handle"
            bounds = {".background"}    
            disabled = {width || !pinned}
            grid = {[5, 5]}
        >
            <div className = "mx-4">
                <div className = {`${pinned ? "cursor-move" : ""} handle p-4 mt-8 bg-[#222222ff] flex flex-row justify-between ${open ? "rounded-t-lg" : "rounded-lg"}`}>
                    <h1 className = "font-bold cursor-default">{ props.title || "Unnamed Window" }</h1>
                    <span className = "">
                        {props.popout ? (
                            <a className = "cursor-pointer p-2" onClick = {popout}>
                                <VscEmptyWindow className = "inline" />
                            </a>
                        ): ( "" )}
                        {!width ? (
                            pinned ? (
                                <a className = "cursor-pointer p-2" onClick = {unpin}>
                                    <BsPinAngle className = "inline"/>
                                </a>
                            ): (
                                <a className = "cursor-pointer p-2" onClick = {pin}>
                                    <BsPinAngleFill className = "inline" />
                                </a>
                            )
                        ) : ""}
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
                {open && (
                    <div className = {`px-10 pb-8 pt-4 rounded-b-lg bg-[#222222aa] ${open ? "" : "invisible"}`}>
                        { props.children }
                    </div>
                )}
            </div>
        </Draggable>
    )
}

export default Card