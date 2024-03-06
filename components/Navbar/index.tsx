import { AiOutlineMenu, AiFillShopping } from 'react-icons/ai';
import { FaDiscord, FaTwitter, FaTwitch } from 'react-icons/fa';
import { HiOutlineStatusOnline } from 'react-icons/hi';
import { VscSourceControl } from 'react-icons/vsc';
import { BsArrowRightShort, BsToggleOff, BsToggleOn } from 'react-icons/bs';
import { motion } from 'framer-motion';
import { Badge, Fall } from '../';
import { useState, useEffect } from 'react';

const NavHighlight = ({ text, link }: { text: string, link: string }) => {
  return (
    <div className = "flex flex-row justify-center mt-2">
      <motion.div 
        whileHover = "hover" initial = "none" 
        className = "text-green-400 text-xl"
      >
        <motion.a variants = {{
            hover: { x: 0 },
            none: { x: "5%" },
          }} href = { link } className = "text-center inline-block font-bold">{ text }</motion.a>
      
        <motion.div 
          variants = {{
            hover: { opacity: 1, rotate: 360, scale: 1.2, transition: { duration: 0.2 } },
            none: { opacity: 0, rotate: 300, scale: 0.8, transition: { duration: 0.2 } },
          }}
          className = "inline-block"
        >
          <BsArrowRightShort className = "inline-block text-3xl" />
        </motion.div>
      </motion.div>
    </div>
  )
}

const Navbar = ({ invertOpenButton=false }) => {
  const [open, setOpen] = useState(false);

  const [showEffects, setShowEffects] = useState(false);

  useEffect(() => {
    let localEffects = localStorage.getItem("show-effects");

    if (localEffects !== null && localEffects === "true") {
        setShowEffects(true);
    }  
  }, [])

  return (
    <>
      <div onClick = {() => { setOpen(false) }} className = {`cursor-pointer transition duration-500 fixed w-screen h-screen bg-black z-40 ${open ? "opacity-60 pointer-events-auto" : "opacity-0 pointer-events-none"}`}></div>
      
      {/* <div style = {{ zIndex: 40 }} className = {`fixed w-screen h-screen pointer-events-none transition duration-300 ${open ? "opacity-100" : "opacity-0"}`}>
        <Fall />
      </div> */}

      <nav id = "nav" className = {`fixed z-40 bg-dark-card-handle h-screen transition duration-300 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div id="innerNav" className = "flex flex-col justify-center h-screen" style = {{ zIndex: 70 }}>
          <div className = "flex flex-col text-white">
            <div className = "flex flex-row justify-center mt-4 mx-16">
              <a href = "/"><img data-m = "bounce-down" data-m-delay = "0.2" className = "w-48" src="/i/assets/teams/GM/main.png" alt="Gabir Motors logo" /></a>
            </div>

            {/* <NavHighlight text = "New Template Tool" link = "/tools/colortemplate" /> */}

            <hr className = "mx-4 mt-4 border-zinc-500" />

            <div className="flex flex-col px-2">
              <div className="flex flex-col gap-3 ml-4 py-2 justify-center">
                <span className = "text-2xl font-"><a href = "/calendar" className = "link">Calendar</a></span>
                <span className = "text-2xl font-"><a href = "/tools/specmapping" className = "link">Spec Mapping</a></span>
                <span className = "text-2xl font-"><a href = "/tools/colortemplate" className = "link">Color Template</a></span>
                <span className = "text-2xl font-"><a href = "/assets"className = "link">Assets</a></span>
                <span className = "text-2xl font-"><a href = "/standings" className = "link">Standings</a></span>
                <span className = "text-2xl font-"><a href = "/tutorials" className = "link">Tutorials</a></span>
                <span className = "text-2xl font-"><a href = "/teams" className = "link">Teams</a></span>
                {/* <span className = "text-2xl font-"><a href = "https://pitwall.gabirmotors.com" target = "_blank" className = "link">The Pitwall</a></span> */}
              </div>
            </div>

            <hr className = "mx-4 border-zinc-500" />

            <div className = "flex flex-row justify-center mx-4 text-black text-2xl gap-2 mt-4 ml-4">
              {[
                { text: "Discord", title: "PA League Discord", url: "https://discord.gabirmotors.com", color: "hover:bg-discord", Icon: FaDiscord },
                { text: "Twitter", title: "Gabir Motors Twitter", url: "https://twitter.com/@GabirMotors", color: "hover:bg-twitter", Icon: FaTwitter },
                { text: "Twitch", title: "PA Twitch", url: "https://twitch.com/PennyArcade", color: "hover:bg-twitch", Icon: FaTwitch },
                { text: "Merch", title: "Gabir Motors Merch", url: "https://store.penny-arcade.com/collections/gabir-motors", color: "hover:bg-green-500", Icon: AiFillShopping },
                { text: "Source", title: "Source Code", url: "https://github.com/LilSpartan/Gabir-Rebuild", color: "hover:bg-github", Icon: VscSourceControl },
                { text: "Status", title: "Status Page", url: "https://stats.uptimerobot.com/p9AxGf9VMk", color: "hover:bg-orange-500", Icon: HiOutlineStatusOnline },
              ].map(icon => (
                <a title = { icon.title } href = { icon.url } target = "_blank">
                  <div className = {`bg-white rounded-full p-2 transition duration-300 ${icon.color} hover:text-white`}>
                    <icon.Icon />

                    {/* <motion.span 
                      initial = {{ 

                       }}
                      className = "tracking-widest font-bold ml-2"
                    >{ icon.text }</motion.span> */}
                  </div>
                </a>
              ))}
            </div>

            <div className = "text-center mx-4 mt-4">
              <a className = "font-semibold link opacity-60" href = "https://gabekrahulik.dev" target='_blank'>Made by Gabe Krahulik</a>
            </div>
          </div>
        </div>
      </nav>

      <div className = "fixed z-40 top-0 flex flex-row">
        <div className = "p-1">
          <AiOutlineMenu className = {`${invertOpenButton ? "text-black" : "text-white"} text-3xl cursor-pointer`} onClick = {() => {
            setOpen(!open);
          }} />
        </div>
      </div>
    </>
  )
}

export default Navbar