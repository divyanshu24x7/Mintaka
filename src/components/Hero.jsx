import React from 'react'
import ImageSlider from './ImageSlider'
import slide1 from '../assets/images/img1.jpg'
import slide2 from '../assets/images/img2.png'
import slide3 from '../assets/images/img3.png'

const IMAGES = [slide1,slide2,slide3]
const Hero = () => {
  return (
    <div className='max-w-[1440px] w-full aspect-[10/2] mx-auto my-0 relative'>
        <ImageSlider imageUrls={IMAGES} />
        <div className="absolute left-1/2 top-3/1 transform -translate-x-1/2 -translate-y-1/2 w-full p-2">
        <input 
          type="text" 
          className="w-[60%] h-14 mx-auto p-2 shadow-md border border-gray-300 focus:ring focus:ring-blue-500 outline-none block"
          placeholder="Search name..." 
        />
      </div>
    </div>
  )
}

export default Hero