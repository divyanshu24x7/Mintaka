import React from 'react'
import {Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Navbar from './components/Navbar'
import About from './pages/About'
import Library from './pages/Library'
import AnimeDetail from './pages/AnimeDetail'
const App = () => {

  return (
    <>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/About' element={<About/>}/>
        <Route path='/Library' element={<Library/>}/>
        <Route path='/anime/:id' element={<AnimeDetail />} />
      </Routes>

    </>
    
  )
}

export default App