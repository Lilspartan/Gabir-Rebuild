import { useState, useEffect } from 'react';
import { Loading, SEO, Navbar, Alert, AlertArea, Button } from '../../components';
import { Client } from "gabir-motors";
import { Team, Driver, IracingAPIData } from '../../utils/interfaces';
import { useRouter } from 'next/router';
import { useSession, signIn, signOut } from "next-auth/react";
import { motion } from 'framer-motion';
import { BsArrowRightShort, BsArrowLeftShort } from 'react-icons/bs';

import timeSince from '../../utils/timeSince';

const client = new Client();

/*
    STEPS:

    1. Enter Account ID
    2. Confirm Profile
    3. Check for public email
    4. Instructions for setting email
    5. Wait for update
    6. Complete
    */
   
   const AccountLinking = ()  => {
        const [iracingData, setIracingData] = useState<IracingAPIData>();    
        const [accountId, setAccountId] = useState<string>();
        
        const [step, setStep] = useState(1);
        
        const { data: session, status, update } = useSession();
        
        useEffect(() => {
            if (session && session.userData.iracing_account_id !== "-1") {
                setStep(6);
            }
        }, [ session ])

        const refreshApiData = async () => {
            let res = await fetch('/api/iracing_data/' + accountId);
            let data = await res.json();
            
            if (data) {
                setIracingData(data);
            }
    }

	return (
        <>
			<SEO title = {`Gabir Motors | iRacing Account Linking`} />

			<Navbar />

            <AlertArea>
                { session && session.userData.alerts.map((alert, i) => (
                    <Alert type = { alert.type } id = { alert.id } title = { alert.title } permaDismiss = { false }>{ alert.text }</Alert>
                )) }
            </AlertArea>

			<div className = "min-h-screen absolute overflow-hidden text-white max-w-full w-screen">
                <div className = "content-center min-h-screen background-carbon_fiber w-full text-center">
                    <div className = "grid place-items-center min-h-screen lg:mx-4 lg:my-8">
                        { session && (
                            <>
                                <div className = "bg-dark-card-handle p-4 rounded-lg lg:p-16 flex flex-col w-screen lg:w-1/2">
                                    <div id = "steps" className = "flex flex-row justify-center lg:justify-between gap-4 lg:gap-0">
                                        { new Array(6).fill("h").map((item, index) => {
                                            return (
                                                <>
                                                    <div className = {`${step - 1 >= index ? (step - 1 === index ? "bg-white text-black" : "bg-[#ffffff] text-black") : "bg-[#333333] text-white"} w-10 h-10 lg:w-16 lg:h-16 rounded-full flex justify-center items-center`}>
                                                        <p className = "text-xl lg:text-2xl font-bold select-none">{ index + 1 }</p>
                                                    </div>

                                                    { index < 5 && (
                                                        <div className = "flex-grow flex-col hidden lg:flex justify-center mx-2">
                                                            <hr className = "border-zinc-500 w-full"/>
                                                        </div>
                                                    ) }
                                                </>
                                            )
                                        }) }
                                    </div>
                                    
                                    <div className = "mt-8">
                                        <LinkingBody step = { step } setStep = { setStep } />
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

const LinkingBody = ({ step, setStep }: { step: number, setStep: Function }) => {
    const [accountId, setAccountId] = useState("");
    const [accountData, setAccountData] = useState<IracingAPIData>();

    switch (step) {
        case 1: return <Step1 setStep = { setStep } setID = { setAccountId } />;
        case 2: return <Step2 setStep = { setStep } ID = { accountId } setAccountData = { setAccountData } />;
        case 3: return <Step3 setStep = { setStep } ID = { accountId } iracingData = { accountData } />;
        case 4: return <Step4 setStep = { setStep } ID = { accountId } />;
        case 5: return <Step5 setStep = { setStep } ID = { accountId } iracingData = { accountData } />;
        case 6: return <Step6 setStep = { setStep } />;
        default: <h1>Error finding that step</h1>
    }
}

const Step1 = ({ setStep, setID }: { setStep: Function, setID: Function }) => {
    const [accountId, setAccountId] = useState(""); 
    const { data: session, update } = useSession();
    
    return (
        <div className = "text-left">
            <h2 className = "text-3xl mb-4"><span className = "font-bold">Step 1:</span> Enter your Account ID</h2>

            <input 
                className="bg-[#333333] rounded-md py-2 px-4 text-xl" 
                type="number" 
                id = "account_id" 
                placeholder="iRacing Account ID" 
                value={accountId} 
                onChange={(e) => { setAccountId(String(e.target.value)) }} 
                />

            <div className = "flex flex-row justify-end mt-16">
                { accountId.length ? (
                    <StepButton click = {() => {
                        setStep(2);
                        setID(accountId);
                    }} text = "Next Step" />
                ) : "" }
            </div>
        </div>
    )
}

const Step2 = ({ setStep, ID, setAccountData }: { setStep: Function, ID: string, setAccountData: Function }) => {
    const { data: session, update } = useSession();
    const [iracingData, setIracingData] = useState<IracingAPIData>();

    useEffect(() => {
        if (ID) {
            (async () => {
                let res = await fetch('/api/iracing_data/' + ID);
                let data = await res.json();
                
                if (data) {
                    setIracingData(data);
                }
            })()
        }
    }, [ ID ])

    return (
        <div className = "text-left">
            <h2 className = "text-3xl mb-4"><span className = "font-bold">Step 2:</span> Confirm iRacing Profile</h2>

            { iracingData ? (
                <div>
                    <h3 className = "text-xl">Are you <span className = "font-bold">{ iracingData.memberInfo.displayName }</span>?</h3>
                </div>
            ) : ( 
                <span>Loading iRacing Profile...</span>
            ) }

            <div>

            </div>

            <div className = "flex flex-row justify-between mt-16">
                { iracingData && (
                    <>
                        <StepButton click = {() => {
                            setStep(1);
                        }} text = "No" reverse />
                        <StepButton click = {() => {
                            setStep(3);
                            setAccountData(iracingData);
                        }} text = "Yes" />
                    </>
                ) }
            </div>
        </div>
    )
}

const Step3 = ({ setStep, ID, iracingData }: { setStep: Function, ID: string, iracingData: IracingAPIData }) => {
    const { data: session, update } = useSession();
    const [emailState, setEmailState] = useState<"none" | "nomatch" | "match">("none");

    useEffect(() => {
        let profileEmail = iracingData.profile.filter((item) => { return item.name === "EMAIL" })[0];

        if (profileEmail.value === "undefined") {
            setEmailState("none");
        } else if (profileEmail.value === session.user.email) {
            setEmailState("match");
        } else {
            setEmailState("nomatch");
        }
    }, [ iracingData ])

    return (
        <div className = "text-left">
            <h2 className = "text-3xl mb-4"><span className = "font-bold">Step 3:</span> Check Profile</h2>

            { iracingData && (
                <div>
                    { emailState === "match" && (
                        <span>Your account has been Successfully verified!</span>
                    ) }

                    { (emailState === "nomatch" || emailState === "none") && (
                        <span>Your account could not be automatically verified, continue to the next step to verify.</span>
                    ) }
                </div>
            ) }

            <div className = "flex flex-row justify-between mt-16">
                <StepButton click = {() => {
                    setStep(2);
                }} text = "Previous Step" reverse />
                { emailState === "match" ? (
                    <StepButton click = {() => {
                        setStep(5);
                    }} text = "Next Step" />
                    ) : (
                    <StepButton click = {() => {
                        setStep(4);
                    }} text = "Next Step" />
                    ) }
            </div>
        </div>
    )
}

const Step4 = ({ setStep, ID }: { setStep: Function, ID: string }) => {
    const { data: session, update } = useSession();
    const [iracingData, setIracingData] = useState<IracingAPIData>();
    const [verified, setVerified] = useState(false);
    const [foundEmail, setFoundEmail] = useState("");
    const [lastCheck, setLastCheck] = useState(Date.now());

    let checkInterval = setInterval(() => {}, Infinity);

    useEffect(() => {
        if (ID && !verified) {
            (async () => {
                setLastCheck(Date.now());
                await updateMemberInfo(ID);

                if (session.user.email === foundEmail) {
                    setVerified(true);
                    clearInterval(checkInterval);
                }
            })()
            clearInterval(checkInterval);

            checkInterval = setInterval(async () => {
                setLastCheck(Date.now());
                await updateMemberInfo(ID);

                if (session.user.email === foundEmail) {
                    setVerified(true);
                    clearInterval(checkInterval);
                }
            }, 60000)
        }
    }, [ ID ])

    const updateMemberInfo = async (id) => {
        let res = await fetch('/api/iracing_data/' + ID);
        let data = await res.json();

        if (data) {
            setIracingData(data);

            let profileEmail = data.profile.filter((item) => { return item.name === "EMAIL" })[0];
            setFoundEmail(profileEmail.value);
        }
    }

    return (
        <div className = "text-left">
            <h2 className = "text-3xl mb-4"><span className = "font-bold">Step 4:</span> Verify Ownership of iRacing Profile</h2>

            <div>
                <p>In order to verify ownership of your profile, please add the email used for your Gabir Motors account <span className = "font-bold">({ session.user.email })</span> to your iRacing profile under the "email" section in your profile information.</p>
                <br />
                <p>After you do so, it may take a few minutes to update, so keep this page open and check back periodically to check on the verification status</p>
            
                <div className = "mt-8">
                    <span><span className = "font-bold">Email found on profile: </span> { foundEmail }</span><br />
                    Last Checked { new Date(lastCheck).toLocaleTimeString() }
                </div>
            </div>

            <div className = "flex flex-row justify-between mt-16">
                <StepButton click = {() => {
                    setStep(3);
                }} text = "Previous Step" reverse />
                { verified && (
                    <StepButton click = {() => {
                        setStep(5);
                    }} text = "Next Step" />
                ) }
            </div>
        </div>
    )
}

const Step5 = ({ setStep, ID, iracingData }: { setStep: Function, ID: string, iracingData: IracingAPIData }) => {
    const { data: session, update } = useSession();

    const [linked, setLinked] = useState(false);

    const linkAccounts = async () => {
        await fetch('/api/user/link/' + ID);
        await update();

        setStep(6)

        console.log(session.userData.iracing_account_id);
    }

    return (
        <div className = "text-left">
            <h2 className = "text-3xl mb-4"><span className = "font-bold">Step 5:</span> Link Accounts</h2>

            <div>
                <Button block click = {linkAccounts}>Click to Link Accounts</Button>
            </div>

            <div className = "flex flex-row justify-between mt-16">
                <StepButton click = {() => {
                    setStep(3);
                }} text = "Previous Step" reverse />
                { linked && (
                    <StepButton click = {() => {
                        setStep(6);
                    }} text = "Next Step" />
                ) }
            </div>
        </div>
    )
}

const Step6 = ({ setStep }: { setStep: Function }) => {
    const { data: session, update } = useSession();
    const [iracingData, setIracingData] = useState<IracingAPIData>();

    useEffect(() => {
        if (session) {
            (async () => {
                let res = await fetch('/api/iracing_data/' + session.userData.iracing_account_id);
                let data = await res.json();
                
                if (data) {
                    setIracingData(data);
                }
            })()
        }
    }, [ session ])

    const unlinkAccounts = async () => {
        await fetch('/api/user/link/-1');
        await update();
        setStep(1)
    }

    return (
        <div className = "text-left">
            <h2 className = "text-3xl mb-4"><span className = "font-bold">Step 6:</span> Linking Complete</h2>

            { iracingData && (
                <>
                    <div className = "mb-4">Your Gabir Motors account is now linked to the iRacing account { iracingData.memberInfo.displayName }</div>

                    <Button block click = {unlinkAccounts}>Unlink Accounts</Button>
                </>
            ) }

            <div className = "flex flex-row justify-end mt-16">
                <StepButton click = {() => {
                    window.location.href = "/auth/dashboard"
                }} text = "Back to Dashboard" />
            </div>
        </div>
    )
}


const StepButton = ({ click , text="Next Step", reverse = false}, { click: Function, text: string, reverse: boolean }) => {
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

export default AccountLinking;