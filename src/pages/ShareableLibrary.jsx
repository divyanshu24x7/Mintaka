import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const ShareableLibrary = () => {
  const { userId } = useParams(); // Assuming the URL will have /share/:userId
  const [animeList, setAnimeList] = useState([]);
  const [error, setError] = useState('');

  const fetchAnimeDataInBatches = async (animeIds, batchSize = 5) => {
    const totalBatches = Math.ceil(animeIds.length / batchSize);
    const animeData = [];

    for (let i = 0; i < totalBatches; i++) {
      const batchIds = animeIds.slice(i * batchSize, (i + 1) * batchSize);
      const batchData = await fetchAnimeData(batchIds);
      animeData.push(...batchData); // Merge batch data into the main array
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second before the next batch
    }

    return animeData;
  };

  const fetchAnimeData = async (animeIds) => {
    const animePromises = animeIds.map(async (id) => {
      const response = await fetch(`https://api.jikan.moe/v4/anime/${id}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch anime with ID: ${id}`);
      }
      return await response.json(); // Return the anime data
    });

    return Promise.all(animePromises); // Wait for all promises to resolve
  };

  useEffect(() => {
    const fetchUserAnime = async () => {
      try {
        const response = await fetch(`http://localhost:5000/get-user-anime/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user anime');
        }
        const savedAnimeIds = await response.json(); // Assuming the response contains anime IDs

        // Fetch anime data in batches
        const animeData = await fetchAnimeDataInBatches(savedAnimeIds);
        setAnimeList(animeData);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUserAnime();
  }, [userId]);

  return (
    <div className='container mx-auto relative p-6'>
      <h1 className='text-white text-2xl mb-4'>User Library</h1>
      {error && <p className='text-red-500'>{error}</p>}
      <div className='mt-4 flex flex-wrap gap-4 justify-center'>
        {animeList.length > 0 ? (
          animeList.map(anime => (
            <div key={anime.data.mal_id} className='w-40 h-80 p-4 text-center relative bg-transparent transition-transform duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg'>
              <img
                className='w-full h-[80%] object-cover transition-opacity duration-300 ease-in-out hover:opacity-90'
                src={anime.data.images.jpg.large_image_url}
                alt={anime.data.title}
              />
              <h1 className='text-white text-lg font-semibold'>{anime.data.title}</h1>
            </div>
          ))
        ) : (
          <p className='text-gray-400'>No anime found in this library.</p>
        )}
      </div>
    </div>
  );
};

export default ShareableLibrary;
