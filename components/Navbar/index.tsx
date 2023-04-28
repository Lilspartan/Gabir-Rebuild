import { useState } from 'react'
import { AiOutlineMenu, AiFillShopping } from 'react-icons/ai';
import { FaDiscord, FaTwitter, FaTwitch } from 'react-icons/fa';
import { VscSourceControl } from 'react-icons/vsc';

const Navbar = ({ invertOpenButton=false }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div onClick = {() => { setOpen(false) }} className = {`cursor-pointer transition duration-500 fixed w-screen h-screen bg-black z-40 ${open ? "opacity-60 pointer-events-auto" : "opacity-0 pointer-events-none"}`}></div>

      <nav id = "nav" className = {`fixed z-40 bg-dark-card-handle h-screen transition duration-300 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div id="innerNav" className = "flex flex-col justify-center h-screen">
          <div className = "flex flex-col text-white">
            <div className = "flex flex-row justify-center mt-4 mx-16">
              <a href = "/"><img data-m = "bounce-down" data-m-delay = "0.2" className = "w-48" src="https://i.gabirmotors.com/assets/teams/GM/main.png" alt="Gabir Motors logo" /></a>
            </div>

            {/* <div className = "flex flex-row ml-4 my-2">
              <span className = "text-red-500">Watch Live</span>
              <div className = "mt-2 ml-1">
                <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-red-500 opacity-75"></span>
                <span className="absolute inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </div>
            </div> */}
            <hr className = "mx-4 mt-4 border-zinc-500" />

            <div className="flex flex-col px-2">
              <div className="flex flex-col gap-3 ml-4 py-2 justify-center">
                <span className = "text-2xl font-"><a href = "/calendar" className = "link">Calendar</a></span>
                <span className = "text-2xl font-"><a href = "/tools/specmapping" className = "link">Spec Mapping</a></span>
                <span className = "text-2xl font-"><a href = "/assets"className = "link">Assets</a></span>
                <span className = "text-2xl font-"><a href = "/standings" className = "link">Standings</a></span>
                <span className = "text-2xl font-"><a href = "/tutorials" className = "link">Tutorials</a></span>
                <span className = "text-2xl font-"><a href = "/teams" className = "link">Teams</a></span>
                <span className = "text-2xl font-"><a href = "https://pitwall.gabirmotors.com" target = "_blank" className = "link">The Pitwall</a></span>
              </div>
            </div>

            <hr className = "mx-4 border-zinc-500" />

            <div className = "flex flex-row justify-center mx-4 text-black text-2xl gap-2 mt-4 ml-4">
              <a href = "https://discord.gabirmotors.com" target = "_blank"><div className = "bg-white rounded-full p-2 transition duration-300 hover:bg-discord hover:text-white"><FaDiscord /></div></a>
              <a href = "https://twitter.com/@GabirMotors" target = "_blank"><div className = "bg-white rounded-full p-2 transition duration-300 hover:bg-twitter hover:text-white"><FaTwitter /></div></a>
              <a href = "https://twitch.com/PennyArcade" target = "_blank"><div className = "bg-white rounded-full p-2 transition duration-300 hover:bg-twitch hover:text-white"><FaTwitch /></div></a>
              <a href = "https://store.penny-arcade.com/collections/gabir-motors" target = "_blank"><div className = "bg-white rounded-full p-2 transition duration-300 hover:bg-green-500 hover:text-white"><AiFillShopping /></div></a>
              <a href = "https://github.com/LilSpartan/Gabir-Rebuild" target = "_blank"><div className = "bg-white rounded-full p-2 transition duration-300 hover:bg-github hover:text-white"><VscSourceControl /></div></a>
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