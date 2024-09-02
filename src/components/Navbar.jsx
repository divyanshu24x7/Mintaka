import React from 'react'
import logo from '../assets/images/mintaka.png'
const Navbar = () => {
  return (
    <nav className="relative container mx-auto p-6 bg-black">
        <div className="justify-center flex items-center md:justify-between">
            <div className="pt-2 order-1">
                <img className="h-10 w-auto" src={logo} alt="mintaka" />
            </div>
            <div className="hidden md:flex flex space-x-6 ml-auto pr-10 order-2">
                <a className="text-white" href="">Home</a>
                <a className="text-white" href="">About</a>
                <a className="text-white" href="">Library</a>
                <a className="text-white" href="">UserLib</a>
            </div>
            <a href="" className="p-3 px-6 pt-2 text-white bg-red-800 baseline rounded-full hover:bg-red-700 order-2 md:order-3">
                Sign In
            </a>
        </div>
    </nav>
  )
}

export default Navbar