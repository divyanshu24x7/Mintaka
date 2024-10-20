import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

const SharableLibrary = () => {
  const { userId } = useParams(); // Get userId from URL params
  const [animeList, setAnimeList] = useState([]);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState(''); // State for search input
  const [filteredAnimeList, setFilteredAnimeList] = useState([]); // State for filtered anime

  // Fetch the user's anime list from the backend using userId
  useEffect(() => {
    const fetchSharedAnime = async () => {
      try {
        const response = await fetch(`http://localhost:5000/share/${userId}`);

        if (!response.ok) {
          throw new Error('Failed to fetch shared anime');
        }

        const sharedAnimeList = await response.json(); // Fetch anime data from MongoDB
        setAnimeList(sharedAnimeList);
        setFilteredAnimeList(sharedAnimeList); // Initially, filtered list is the same as the full list
      } catch (err) {
        setError(err.message);
      }
    };

    fetchSharedAnime();
  }, [userId]);

  // Handle the search input change
  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    // Filter the anime list based on the search query
    const filteredList = animeList.filter(anime =>
      anime.title.toLowerCase().includes(query)
    );
    setFilteredAnimeList(filteredList);
  };

  return (
    <div className='container mx-auto relative p-6'>
      <h1 className='text-white text-2xl mb-4'>Shared Anime Library</h1>
      {error && <p className='text-red-500'>{error}</p>}

      <div className='flex justify-between items-center mb-4'>
        <input
          type='text'
          value={searchQuery}  // Bind input value to state
          onChange={handleSearchChange}  // Call the handler on change
          placeholder='Search'
          className='w-[30%] p-3 border rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:border-red-700'
        />
      </div>

      <div className='mt-4 flex flex-wrap gap-4 justify-center'>
        {filteredAnimeList.length > 0 ? (
          filteredAnimeList.map(anime => (
            <div key={anime.animeId}
              className='w-40 h-80 p-4 text-center relative bg-transparent transition-transform duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg'>
              <Link to={`/anime/${anime.animeId}`} className='flex flex-col justify-between h-[70%]'>
                <img
                  className='w-full h-[80%] object-cover transition-opacity duration-300 ease-in-out hover:opacity-90'
                  src={anime.images.jpg.large_image_url}  // Assuming image is stored in MongoDB
                  alt={anime.title}
                />
                <div className='mt-2 flex flex-col justify-between'>
                  <h1 className='text-white text-lg font-semibold'>
                    {anime.title}
                  </h1>
                </div>
              </Link>
            </div>
          ))
        ) : (
          <p className='text-gray-400'>No anime found in this library.</p>
        )}
      </div>
    </div>
  );
};

export default SharableLibrary;
