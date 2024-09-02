import React from 'react'
import ImageSlider from './ImageSlider'
import slide1 from '../assets/images/img1.jpg'
import slide2 from '../assets/images/img2.png'
import slide3 from '../assets/images/img3.png'

const IMAGES = [slide1,slide2,slide3]
const Hero = () => {
  return (
    <div className='max-w-[1200px] w-full aspect-[10/2] mx-auto my-0 '>
      <ImageSlider imageUrls={IMAGES} />
    </div>
  )
}

export default Hero