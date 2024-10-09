import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // React Router's hook to navigate

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent form from refreshing the page

    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }), // Send email and password to backend
      });

      const data = await response.json();

      if (response.ok) {
        // Login successful
        alert('Login successful!');
        localStorage.setItem('loggedIn',true)
        localStorage.setItem('userEmail',email)
        // Navigate to a new page, e.g., dashboard or home
        navigate('/Library'); 
        // Reload the page
        window.location.reload(); 
        
      } else {
        // Handle login failure (e.g., show error message)
        alert(data.message || 'Invalid email or password');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error during login');
    }
  };

  return (
    <div className='container mx-auto items-center flex flex-col'>
      <h1 className='text-white text-4xl p-12'>Welcome back</h1>
      <form className='flex flex-col w-full items-center' onSubmit={handleLogin}> {/* Form submission */}
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
          type='submit' // Button submits the form
          className='text-white bg-red-800 w-[50%] md:w-[30%] p-3 rounded-md'
        >
          Log In
        </button>
      </form>
      <div className='flex my-3'>
        <p className='text-white'>Don't have an account? </p>
        <Link to='/SignUp' className='text-red-800 hover:text-red-700 ml-3'>
          Sign Up
        </Link>
      </div>
    </div>
  );
};

export default Login;
