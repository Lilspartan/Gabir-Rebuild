import React from 'react'
import Draggable from 'react-draggable'
import { VscEmptyWindow } from 'react-icons/vsc';

const Card = (props:any) => {
    let windowObjectReference;
    let windowFeatures = "left=100,top=100,width=400,height=600";

    const popout = () => {
    windowObjectReference = window.open(props.popout, props.title, windowFeatures);
    }

    return (
        <div className = "mx-4">
            <div className = "handle p-4 mt-8 bg-[#222222ff] rounded-t-lg flex flex-row justify-between">
                <h1 className = "font-bold cursor-default">{ props.title || "Unnamed Window" }</h1>
                <span className = "">
                    {props.popout ? (
                        <a className = "cursor-pointer" onClick = {popout}>
                           <VscEmptyWindow />
                        </a>
                    ): ( "" )}
                </span>
            </div>
            <div className = "px-10 pb-8 pt-4 rounded-b-lg bg-[#222222aa]">
                { props.children }
            </div>
        </div>
    )
}

export default Card