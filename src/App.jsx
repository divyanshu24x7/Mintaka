import React from 'react'
import {Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Navbar from './components/Navbar'
import About from './pages/About'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import Library from './pages/Library'
import AnimeDetail from './pages/AnimeDetail'
import Dashboard from './pages/Dashboard'
import ShareableLibrary from './pages/ShareableLibrary'
const App = () => {

  return (
    <>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/About' element={<About/>}/>
        <Route path='/Library' element={<Library/>}/>
        <Route path='/anime/:id' element={<AnimeDetail />} />
        <Route path='/login' element={<Login />} />
        <Route path='/SignUp' element={<SignUp />} />
        <Route path="/share/:userId" element={<ShareableLibrary />} />
      </Routes>

    </>
    
  )
}

export default App