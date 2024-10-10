import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Library = () => {
  const [animeList, setAnimeList] = useState([]);
  const [error, setError] = useState('');
  const [shareableLink, setShareableLink] = useState('');

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
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to view your library.');
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/get-user-anime', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user anime');
        }

        const savedAnimeIds = await response.json(); // Assuming your response contains an array of anime IDs

        // Fetch anime data in batches
        const animeData = await fetchAnimeDataInBatches(savedAnimeIds);
        setAnimeList(animeData);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUserAnime();
  }, []);

  // Function to generate the shareable link
  const generateShareableLink = () => {
    const userId = localStorage.getItem('userId'); // Make sure you have userId stored in localStorage
    if (userId) {
      const link = `${window.location.origin}/share/${userId}`; // Adjust this URL based on your routing
      setShareableLink(link);
    }
  };

  return (
    <div className='container mx-auto relative p-6'>
      <h1 className='text-white text-2xl mb-4'>User Library</h1>
      {error && <p className='text-red-500'>{error}</p>}
      
      <div className='flex justify-between items-center mb-4'>
        <input
          type='text'
          placeholder='Search'
          className='w-[30%] p-3 border rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:border-red-700'
        />
        
        <button 
          className='text-white bg-blue-500 p-2 rounded hover:bg-blue-600'
          onClick={generateShareableLink}
        >
          Generate Shareable Link
        </button>
      </div>
      
      {shareableLink && (
        <div className='mb-4'>
          <p className='text-green-500'>Shareable Link: {shareableLink}</p>
        </div>
      )}

      <div className='mt-4 flex flex-wrap gap-4 justify-center'>
        {animeList.length > 0 ? (
          animeList.map(anime => (
            <div key={anime.data.mal_id}
              className='w-40 h-80 p-4 text-center relative bg-transparent transition-transform duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg'>
              <Link key={anime.data.mal_id} to={`/anime/${anime.mal_id}`} className='flex flex-col justify-between h-[70%]'>
                <img
                  className='w-full h-[80%] object-cover transition-opacity duration-300 ease-in-out hover:opacity-90'
                  src={anime.data.images.jpg.large_image_url}
                  alt={anime.title}
                />
                <div className='mt-2 flex flex-col justify-between'>
                  <h1 className='text-white text-lg font-semibold'>
                    {anime.data.title}
                  </h1>
                </div>
              </Link>
            </div>
          ))
        ) : (
          <p className='text-gray-400'>No anime found in your library.</p>
        )}
      </div>
    </div>
  );
};

export default Library;
