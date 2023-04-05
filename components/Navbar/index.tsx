import React from 'react'
import { AiOutlineClose } from 'react-icons/ai';
import Link from "next/link";

const Navbar = () => {
  return (
    <nav id = "nav" className = "absolute z-40 bg-dark-card-handle w-screen">
      <div className = "flex flex-col text-white">
        <div className = "flex flex-row justify-center">
          <img data-m = "bounce-down" data-m-delay = "0.2" className = "h-24" src="/logo_with_text.png" alt="Gabir Motors logo with the text GABIR MOTORS written at the bottom" />
        </div>

        <div className="flex flex-row px-8 py-8">
          <div className="flex flex-col gap-1 border-r-2 px-8 border-zinc-700 py-2">
            <span className = "text-center link text-2xl"><Link href = "/calendar">Calendar</Link></span>
            <span className = "text-center link text-2xl"><Link href = "/tools/specmapping">Spec Mapping</Link></span>
            <span className = "text-center link text-2xl"><Link href = "/assets">Assets</Link></span>
            <span className = "text-center link text-2xl"><Link href = "/teams">Teams</Link></span>
            <span className = "text-center link text-2xl"><Link href = "/tools/specmapping">Tutorials</Link></span>
          </div>
          <div className="flex flex-col gap-1 border-r-2 px-8 border-zinc-700 py-2">
            <span className = "text-center link text-2xl"><Link href = "/gabirdle">Gabirdle</Link></span>
            <span className = "text-center link text-2xl"><Link href = "/tools/specmapping">The Pitwall</Link></span>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar