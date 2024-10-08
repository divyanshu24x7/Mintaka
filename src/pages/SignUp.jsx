import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async (e) => {
    e.preventDefault(); // Prevents form from reloading

    try {
      const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }), // Send email and password to backend
      });

      const data = await response.json();

      if (response.ok) {
        alert('User registered successfully');
        // You can redirect or show success message
      } else {
        alert(data.message || 'Error during registration');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className='container mx-auto items-center flex flex-col'>
      <h1 className='text-white text-4xl p-12'>Create Account</h1>
      <form className='flex flex-col w-full items-center' onSubmit={handleSignUp}> {/* Handle form submit */}
        <input
          type='text'
          placeholder='Email'
          className='w-[50%] md:w-[30%] p-3 mb-3 border rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:border-red-700'
          value={email}
          onChange={(e) => setEmail(e.target.value)} // Set email state
        />
        <input
          type='password'
          placeholder='Password'
          className='w-[50%] md:w-[30%] p-3 mb-3 border rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:border-red-700'
          value={password}
          onChange={(e) => setPassword(e.target.value)} // Set password state
        />
        <button
          type='submit'
          className='text-white bg-red-800 w-[50%] md:w-[30%] p-3 rounded-md'
        >
          Sign Up
        </button>
      </form>
      <div className='flex my-3'>
        <p className='text-white'>Already have an account? </p>
        <Link to='/Login' className='text-red-800 hover:text-red-700 ml-3'>
          Login
        </Link>
      </div>
    </div>
  );
};

export default SignUp;
