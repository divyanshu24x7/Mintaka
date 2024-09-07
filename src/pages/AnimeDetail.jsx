import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

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
