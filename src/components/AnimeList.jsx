import React from 'react';
import { Link } from 'react-router-dom';
import { FaStar } from 'react-icons/fa'; // Import the star icon

const AnimeList = ({ animeList }) => {
    return (
        <div className='flex flex-wrap gap-4 justify-center'>
            {animeList && animeList.length > 0 ? (
                animeList.map((anime, index) => (
                    <div 
                        key={index} 
                        className='w-40 h-80 p-4 text-center relative bg-transparent transition-transform duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg flex flex-col justify-between'
                    >
                        <Link to={`/anime/${anime.mal_id}`} className='flex flex-col h-[70%] justify-between'>
                            <img 
                                className='w-full h-[80%] object-cover transition-opacity duration-300 ease-in-out hover:opacity-90'
                                src={anime.images.jpg.large_image_url} 
                                alt={anime.title} 
                            />
                            <div className='mt-2 flex flex-col justify-between'>
                                <h1 className='text-white text-lg font-semibold truncate'>
                                    {anime.title}
                                </h1>
                            </div>
                        </Link>

                        <div className='mt-2'>
                            <button className='text-white bg-red-800 rounded p-2 w-full'>
                                Add to my list
                            </button>

                            {/* Dropdown for ratings */}
                            <div className='flex items-center mt-2 relative'>
                                <select
                                    className='w-full p-2 rounded bg-gray-800 text-white border border-gray-600 text-sm'
                                >
                                    <option selected="selected" value="0">Select</option><option value="10">(10) Masterpiece</option><option value="9">(9) Great</option><option value="8">(8) Very Good</option><option value="7">(7) Good</option><option value="6">(6) Fine</option><option value="5">(5) Average</option><option value="4">(4) Bad</option><option value="3">(3) Very Bad</option><option value="2">(2) Horrible</option><option value="1">(1) Appalling</option>
                                </select>
                                <FaStar className='text-yellow-500 mr-1 absolute right-3 pointer-events-none' /> {/* Star icon */}
                            </div>
                        </div>
                    </div>
                ))
            ) : null}
        </div>
    );
};

export default AnimeList;
