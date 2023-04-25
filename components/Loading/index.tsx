import { useState, useEffect } from 'react'
import SVG from './icon';
let targetElement = null;

const LoadingIcon = ({ loading }: {loading:boolean}) => {
    const [fade, setFade] = useState(false);
    const [show, setShow] = useState(true);
    const [done, setDone] = useState(false);
    const [showLogo, setShowLogo] = useState(false);

    const fadeOut = () => {
        setFade(true)
        setTimeout(() => {
            setShow(false);
        }, 750)
    }

    useEffect(() => {
        setTimeout(() => {
            setDone(true);
        }, 2000)

        targetElement = document.querySelector('body');
        setTimeout(() => {
            setShowLogo(true);
        }, 500)
    }, [])

    useEffect(() => {
        if (loading !== undefined && !loading && done) {
            fadeOut();
            // console.log(loading)
        }
    }, [loading, done])

    if (show) {
        return (
            <div className={`background-carbon_fiber min-h-screen h-full fixed top-0 right-0 z-50 overflow-hidden ${(fade ? "fade-out" : "")}
            `}>  
                <div className={`grid place-items-center h-screen text-center w-screen`}>
                    {showLogo ? (
                        <SVG className = "w-screen mb-16 md:mb-0 p-16 md:w-1/2 h-1/2" />
                    ) : ""}
                </div>
            </div>
        )
    } else {
        return <></>
    }
}

export default LoadingIcon