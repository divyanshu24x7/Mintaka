import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';

const AnimeDetail = () => {
  const { id } = useParams(); // Get the anime ID from the URL
  const [anime, setAnime] = useState(null);

  const getAnimeDetails = async () => {
    const res = await fetch(`https://api.jikan.moe/v4/anime/${id}`);
    const resData = await res.json();
    setAnime(resData.data);
  };

  useEffect(() => {
    getAnimeDetails();
  }, [id]);

  if (!anime) {
    return <p className='text-white text-lg'>Loading...</p>;
  }

  return (
    <div className='max-w-[1440px] mx-auto p-4'>
      <div className='flex flex-col md:flex-row items-start max-w-[95%] mx-auto'>
        <div className='w-full md:w-[100px] lg:w-[200px] mb-4'>
          <img
            className='w-full h-auto object-cover rounded-lg'
            src={anime.images.jpg.large_image_url}
            alt={anime.title}
          />
          <div className='text-mintakaText mt-4'>
            <p><strong>Episodes:</strong> {anime.episodes}</p>
            <p><strong>Genres:</strong> {anime.genres.map(genre => genre.name).join(', ')}</p>
            <div className='flex flex-col gap-2'>
              <button className='text-white text-sm bg-red-800 rounded w-full p-2'>
                Add to my list
              </button>
              <div className='flex items-center mt-2 relative w-full'>
                <select
                  className='w-full p-2 rounded bg-gray-800 text-white border border-gray-600 text-sm p-2 h-full'
                >
                  <option selected="selected" value="0">Select</option><option value="10">(10) Masterpiece</option><option value="9">(9) Great</option><option value="8">(8) Very Good</option><option value="7">(7) Good</option><option value="6">(6) Fine</option><option value="5">(5) Average</option><option value="4">(4) Bad</option><option value="3">(3) Very Bad</option><option value="2">(2) Horrible</option><option value="1">(1) Appalling</option>
                </select>
                <FaStar className='text-yellow-500 mr-1 absolute right-3 pointer-events-none' /> {/* Star icon */}
              </div>
            </div>
          </div>
        </div>

        <div className='text-mintakaText text-md flex-1 md:ml-6'>
          <p className='mb-4'>{anime.synopsis}</p>
          {/* Add more details as needed */}
        </div>
      </div>
    </div>
  );
};

export default AnimeDetail;
