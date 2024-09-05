import React from 'react'
import logo from '../assets/images/mintaka.png'
import { useState } from 'react'


const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false); // To toggle the menu

    const toggleMenu = () => {
        setIsOpen(!isOpen); // Toggle the state between true/false
    };
  return (
    <nav className="relative w-full p-6 m-0 bg-mintakaGray">
        <div className="justify-center flex items-center justify-between">
            <div className="pt-2 order-1">
                <img className="h-10 w-auto" src={logo} alt="mintaka" />
            </div>
            <div className="hidden md:flex flex space-x-6 ml-auto pr-10 order-2">
                <a className="text-white" href="">Home</a>
                <a className="text-white" href="">About</a>
                <a className="text-white" href="">Library</a>
                <a className="text-white" href="">UserLib</a>
            </div>
            <div className="md:hidden">
                <button onClick={toggleMenu} className="focus:outline-none">
                    {/* Hamburger Icon (3 bars) */}
                    <span className="block w-6 h-1 bg-white mb-1"></span>
                    <span className="block w-6 h-1 bg-white mb-1"></span>
                    <span className="block w-6 h-1 bg-white"></span>
                </button>
            </div>
            <a href="" className="p-3 px-6 pt-2 text-white bg-red-800 baseline rounded-full hover:bg-red-700 order-2 md:order-3">
                Sign In
            </a>
        </div>
        {/* Mobile Sidebar Menu */}
        <div
        className={`fixed top-16 left-0 w-36 bg-black bg-opacity-80 z-50 flex flex-col items-start p-6 transition-transform duration-500 ease-in-out ${
          isOpen ? 'translate-y-0 opacity-100 h-auto' : '-translate-y-6 opacity-0 h-0'
        }`}
        style={{
          height: isOpen ? 'auto' : 0, // Ensure height is animated
          overflow: 'hidden', // Hide overflow to prevent content spill
        }}
      >
        <button
          onClick={toggleMenu}
          className="text-white text-2xl mb-4"
        >
          &times; {/* Close icon */}
        </button>
        <a className="text-white text-lg py-2" href="#home">Home</a>
        <a className="text-white text-lg py-2" href="#about">About</a>
        <a className="text-white text-lg py-2" href="#library">Library</a>
        <a className="text-white text-lg py-2" href="#userlib">UserLib</a>
      </div>
    </nav>
  )
}

export default Navbar