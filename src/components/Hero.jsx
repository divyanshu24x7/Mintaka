import React, { useEffect,useState } from 'react';
import ImageSlider from './ImageSlider';
import slide1 from '../assets/images/img1.jpg';
import slide2 from '../assets/images/img2.png';
import slide3 from '../assets/images/img3.png';
import { FaSearch } from 'react-icons/fa'; // Import search icon
import AnimeList from './AnimeList';

const IMAGES = [slide1, slide2, slide3];

const Hero = () => {
  const [search,setSearch] = useState('')
  const [animeData,setAnimeData] = useState()
  const getData = async () => {
    const res = await fetch(`https://api.jikan.moe/v4/anime?q=${search}&limit=6`)
    const resData = await res.json()
    setAnimeData(resData.data)
  }
  useEffect(()=>{
    if (search.trim() !== '') {
      getData();
    } else {
      setAnimeData([]); // Clear the data when search is empty
    }
  },[search])

  return (
    <>
      <div className="max-w-[1440px] w-full md:aspect-[10/2.5] aspect-[10/4] mx-auto my-0 relative">
      {/* Image Slider */}
      <ImageSlider imageUrls={IMAGES} />

      {/* Positioned Input */}
      <div className="absolute left-1/2 top-3/1 transform -translate-x-1/2 -translate-y-1/2 w-full p-2">
        <div className="relative w-[60%] mx-auto">
          <input 
            type="text" 
            className="w-full md:h-14 rounded-md pl-12 pr-4 py-2 shadow-md border border-gray-300 focus:ring focus:ring-red-700 outline-none block"
            placeholder="Search anime..." 
          onChange={(e)=>{
            setSearch(e.target.value)
          }}/>
          <FaSearch 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            size={20} // Adjust size as needed
          />
        </div>
      </div>
    </div>
    <div className="container">
        <div className='p-6 mx-auto'>
          <AnimeList animeList={animeData}/>
        </div>
      </div>
    </>
  );
};

export default Hero;
