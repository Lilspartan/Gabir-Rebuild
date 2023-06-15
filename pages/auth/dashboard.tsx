import { useState, useEffect } from 'react';
import { Loading, SEO, Navbar, Alert, AlertArea } from '../../components';
import { Client } from "gabir-motors";
import { Team, Driver, IracingAPIData } from '../../utils/interfaces';
import { useRouter } from 'next/router';
import { useSession, signIn, signOut } from "next-auth/react";
import { motion } from 'framer-motion';
import { BsArrowLeftShort, BsArrowRightShort } from 'react-icons/bs';

const client = new Client();

const Teams = ()  => {
	const [loading, setLoading] = useState(false);
    const [iracingData, setIracingData] = useState<IracingAPIData>();    
    const [accountId, setAccountId] = useState("557730");

    const { data: session, status, update } = useSession({
        required: true,
    });

	useEffect(() => {
		setTimeout(() => {
			setLoading(false);
		}, 500)
	}, [])

    // const refreshApiData = async () => {
    //     let res = await fetch('/api/iracing_data/' + accountId);
    //     let data = await res.json();

    //     if (data) {
    //         setIracingData(data);
    //     }
    // }

    const dissmissAccountAlert = async (id) => {
        await fetch('/api/user/alerts/dismiss/' + id);
        update();
    }

    const updateName = async () => {
        let newName = prompt("Enter your new name");
        if (newName) {
            await fetch('/api/user/update/name/' + newName);
            update();
        }
    }

	return (
		<>
			<SEO title = {`Gabir Motors | Dashboard`} />

			<Loading loading = { loading } />
 
			<Navbar />

            <AlertArea>
                { session && session.userData.alerts.map((alert, i) => (
                    <Alert onClose = {() => {
                        dissmissAccountAlert(alert.id);
                    }} type = { alert.type } id = { alert.id } title = { alert.title } permaDismiss = { false }>{ alert.text }</Alert>
                )) }
            </AlertArea>

			<div className = "min-h-screen absolute overflow-hidden text-white max-w-full w-screen">
                <div className = "content-center min-h-screen background-carbon_fiber w-full text-center">
                    <div className = "grid place-items-center min-h-screen mx-4 my-8">
                        { session && (
                            <>
                                <div className = "bg-dark-card-handle p-16 flex flex-col lg:w-1/2 rounded-lg">
                                    <div className = "mb-6"> 
                                        <img src={session.userData.icon} className = "rounded-full mx-auto w-36" />
                                    </div>

                                    <h1 className = "font-bold text-2xl">Welcome back { session.userData.name }</h1>

                                    <div className = "flex flex-col lg:flex-row mt-16 gap-8">
                                        <div className = "text-left">
                                            <CoolLink text = "Change Name" click = {updateName} />
                                            <CoolLink text = "iRacing Linking" click = {() => { window.location.href = "/auth/accountLinking" }} />
                                            <CoolLink text = "Sign Out" click = {() => { signOut() }} />
                                        </div>

                                        <div className="flex-grow py-2 bg-[#333333] rounded-lg grid place-items-center font-extrabold text-2xl">
                                            More Coming Soon...
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) }
                    </div>
                </div>
			</div>
		</>
	)
}

const CoolLink = ({ click , text, reverse = false}, { click: Function, text: string, reverse: boolean }) => {
    return (
        <motion.div 
            whileHover = "hover" initial = "none" 
            className = "text-xl"
        >
            { reverse && (
                <motion.div 
                variants = {{
                    hover: { opacity: 1, rotate: 360, scale: 1.2, transition: { duration: 0.2 } },
                    none: { opacity: 0, rotate: 300, scale: 0.8, transition: { duration: 0.2 } },
                }}
                className = "inline-block"
                >
                    <BsArrowLeftShort className = "inline-block text-3xl" />
                </motion.div>
            ) }
            
            { reverse ? (
                <motion.a variants = {{
                    hover: { x: "5%" },
                    none: { x: "0%" },
                }} href = "#" onClick = {click} className = "text-center inline-block font-bold">{ text }</motion.a>
            ) : (
                <motion.a variants = {{
                    hover: { x: "-5%" },
                    none: { x: "0%" },
                }} href = "#" onClick = {click} className = "text-center inline-block font-bold">{ text }</motion.a>
            ) }
        
            { !reverse && (
                <motion.div 
                variants = {{
                    hover: { opacity: 1, rotate: 360, scale: 1.2, transition: { duration: 0.2 } },
                    none: { opacity: 0, rotate: 300, scale: 0.8, transition: { duration: 0.2 } },
                }}
                className = "inline-block"
                >
                    <BsArrowRightShort className = "inline-block text-3xl" />
                </motion.div>
            ) }
        </motion.div>
    )
}

export default Teams;