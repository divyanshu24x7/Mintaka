import React from 'react'
import {Link} from 'react-router-dom'
const Login = () => {
  return (
    <div className='container mx-auto items-center flex flex-col'>
        <h1 className='text-white text-4xl p-12'>Welcome back</h1>
        <input
          type='text'
          placeholder='Email'
          className='w-[50%] md:w-[30%] p-3 mb-3 border rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:border-red-700'
        />
        <input
          type='text'
          placeholder='Password'
          className='w-[50%] md:w-[30%] p-3 mb-3 border rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:border-red-700'
        />
        <button className='text-white bg-red-800 w-[50%] md:w-[30%] p-3 rounded-md'>
            Sign Up
        </button>
        <div className='flex my-3'>
            <p className='text-white'>Don't have an account? </p>
            <Link to='/SignUp' className='text-red-800 hover:text-red-700 ml-3'> Sign Up</Link>

        </div>
    </div>
  )
}

export default Login
