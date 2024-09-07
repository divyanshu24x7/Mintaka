import React from 'react';
import { Link } from 'react-router-dom';

const AnimeList = ({ animeList }) => {
    return (
        <div className='flex flex-wrap gap-4 justify-center'>
            {animeList && animeList.length > 0 ? (
                animeList.map((anime, index) => (
                    <div 
                        key={index} 
                        className='w-40 h-52 p-4 text-center relative bg-transparent transition-transform duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg'
                    >
                        <Link to={`/anime/${anime.mal_id}`}
                              key={anime.mal_id} // Use a unique identifier from the API
                        >
                            <img 
                                className='w-full h-[80%] object-cover transition-opacity duration-300 ease-in-out hover:opacity-90'
                                src={anime.images.jpg.large_image_url} 
                                alt={anime.title} 
                            />
                            <div className='mt-2'>
                                <h1 className='text-white text-lg font-semibold'>{anime.title}</h1>
                            </div>
                        </Link>
                    </div>
                ))
            ) : null
        }
        </div>
    );
};

export default AnimeList;
