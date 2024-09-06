import React from 'react'
import logo from '../assets/images/mintaka.png'
import { useState } from 'react'
import { Link } from 'react-router-dom';


const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false); // To toggle the menu

    const toggleMenu = () => {
        setIsOpen(!isOpen); // Toggle the state between true/false
    };
  return (
    <nav className='w-full p-6 m-0'>
      <div className="flex justify-between items-center">
        <div className="pt-2 order-2 md:order-1">
          <img className="h-10 w-auto pl-12 md:pl-0" src={logo} alt="mintaka" />
        </div>
        <div className="hidden md:flex space-x-6 ml-auto pr-10 md:order-2">
          <Link className="text-white" to="">Home</Link>
          <Link className="text-white" to="/About">About</Link>
          <Link className="text-white" to="">Library</Link>
          <Link className="text-white" to="">UserLib</Link>
        </div>
        <Link to="" className="p-3 px-6 pt-2 text-white bg-red-800 baseline rounded-full hover:bg-red-700 order-3">
          Sign In
        </Link>
        <div className="md:hidden order-1 relative">
                <button onClick={toggleMenu} className="focus:outline-none">
                    <span className="block w-6 h-1 bg-white mb-1"></span>
                    <span className="block w-6 h-1 bg-white mb-1"></span>
                    <span className="block w-6 h-1 bg-white"></span>
                </button>
                {/*drop down menu*/}
                <div className={`dropdown-menu-wrap z-50 ${isOpen?'open-menu':''}`}>
                    <div className='flex flex-col items-left'>
                      <Link className="text-white h-16 bg-menuGray   py-5 pl-2 hover:font-bold relative underLineAni" to="">Home</Link>
                      <Link className="text-white h-16 bg-menuGray2   py-5 pl-2 hover:font-bold relative underLineAni" to="">About</Link>
                      <Link className="text-white h-16 bg-menuGray   py-5 pl-2 hover:font-bold relative underLineAni" to="">Library</Link>
                      <Link className="text-white h-16 bg-menuGray2  py-5 pl-2 hover:font-bold relative underLineAni" to="">UserLib</Link>
                    </div>
                </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar