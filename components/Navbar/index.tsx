import { useState, useEffect } from 'react'
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';
import Link from "next/link";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div onClick = {() => { setOpen(false) }} className = {`cursor-pointer transition duration-500 fixed w-screen h-screen bg-black z-40 ${open ? "opacity-60 pointer-events-auto" : "opacity-0 pointer-events-none"}`}></div>

      <nav id = "nav" className = {`fixed z-40 bg-dark-card-handle h-screen transition duration-500 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className = "pt-1 pl-1"><AiOutlineClose onClick = {() => { setOpen(false) }} className = "cursor-pointer text-3xl text-white"/></div>
        <div className = "flex flex-col text-white">
          <div className = "flex flex-row justify-center">
            <img data-m = "bounce-down" data-m-delay = "0.2" className = "w-32" src="https://i.gabirmotors.com/assets/teams/GM/main.png" alt="Gabir Motors logo with the text GABIR MOTORS written at the bottom" />
          </div>

          <div className="flex flex-col px-8 py-4">
            <div className="flex flex-col gap-2 px-8 py-2 justify-center">
              <span className = "text-4xl font-bold acumin"><Link href = "/calendar"><span className = "link cursor-pointer">Calendar</span></Link></span>
              <span className = "text-4xl font-bold acumin"><Link href = "/tools/specmapping"><span className = "link cursor-pointer">Spec Mapping</span></Link></span>
              <span className = "text-4xl font-bold acumin"><Link href = "/assets"><span className = "link cursor-pointer">Assets</span></Link></span>
              <span className = "text-4xl font-bold acumin"><Link href = "/teams"><span className = "link cursor-pointer">Teams</span></Link></span>
              <span className = "text-4xl font-bold acumin"><Link href = "/tools/specmapping"><span className = "link cursor-pointer">Tutorials</span></Link></span>
              <span className = "text-4xl font-bold acumin"><a href = "https://pitwall.gabirmotors.com" target = "_blank"><span className = "link cursor-pointer">The Pitwall</span></a></span>
            </div>
            <div className="flex flex-row gap-8 px-8 py-2 justify-center">

            </div>
          </div>
        </div>
      </nav>

      <div className = "fixed z-[35] top-0 flex flex-row">
        <div className = "p-1">
          <AiOutlineMenu className = "text-white text-3xl cursor-pointer" onClick = {() => {
            setOpen(true);
          }} />
        </div>
      </div>
    </>
  )
}

export default Navbar