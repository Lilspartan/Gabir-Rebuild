import { useState, useEffect } from 'react'
import SVG from './icon';


const LoadingIcon = ({ loading }: {loading:boolean}) => {
    const [fade, setFade] = useState(false);
    const [show, setShow] = useState(true);
    const [done, setDone] = useState(false);

    const fadeOut = () => {
        setFade(true)
        setTimeout(() => {
            setShow(false);
        }, 750)
    }

    useEffect(() => {
        if (loading !== undefined && !loading && done) {
            fadeOut();
            // console.log(loading)
        }
    })

    if (show) {
        return (
            <div className={`
                background-c
                min-h-screen
                h-1/1 
                absolute 
                z-50 
                ${(fade ? "fade-out " : "")}
            `}>  
                <div className={`grid place-items-center h-screen text-center w-screen`}>
                    <SVG className = "w-1/2 h-1/2" onAnimationEnd = {() => { 
                        setDone(true);
                        if (loading === undefined) {
                            fadeOut()
                        } 
                    }} />
                </div>
            </div>
        )
    } else {
        return <></>
    }
}

export default LoadingIcon