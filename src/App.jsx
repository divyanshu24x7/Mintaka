import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import ImageSlider from './components/ImageSlider'
const App = () => {

  return (
    <>
      <Navbar />
      <Hero />
    </>
    
  )
}

export default App