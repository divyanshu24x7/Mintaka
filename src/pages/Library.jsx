import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Library = () => {
  const [animeList, setAnimeList] = useState([]);
  const [error, setError] = useState('');
  const [shareableLink, setShareableLink] = useState('');
  const [searchQuery, setSearchQuery] = useState('');  // State for search input
  const [filteredAnimeList, setFilteredAnimeList] = useState([]);  // State for filtered anime

  // Fetch the user's saved anime list from the backend
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

        const userAnimeList = await response.json(); // Fetch anime data directly from the server
        setAnimeList(userAnimeList);
        setFilteredAnimeList(userAnimeList);  // Initially, filtered list is the same as the full list
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
      <h1 className='text-white text-2xl mb-4'>User Library</h1>
      {error && <p className='text-red-500'>{error}</p>}
      <div className='flex justify-between items-center mb-4'>
        <input
          type='text'
          value={searchQuery}  // Bind input value to state
          onChange={handleSearchChange}  // Call the handler on change
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
        {filteredAnimeList.length > 0 ? (
          filteredAnimeList.map(anime => (
            <div key={anime.animeId}
              className='w-40 h-80 p-4 text-center relative bg-transparent transition-transform duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg'>
              <Link to={`/anime/${anime.animeId}`} className='flex flex-col justify-between h-[70%]'>
                <img
                  className='w-full h-[80%] object-cover transition-opacity duration-300 ease-in-out hover:opacity-90'
                  src={anime.images.jpg.large_image_url}  // Using image from MongoDB
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
          <p className='text-gray-400'>No anime found in your library.</p>
        )}
      </div>
    </div>
  );
};

export default Library;
