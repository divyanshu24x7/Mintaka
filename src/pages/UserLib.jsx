import React, { useEffect, useState } from 'react';

const Library = () => {
    const [animeRecommendations, setAnimeRecommendations] = useState([]);
    const [userRecommendations, setUserRecommendations] = useState([]);
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchRecommendations = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Please log in to view your library.');
                setLoading(false);
                return;
            }

            try {
                const response = await fetch('http://localhost:5000/run-scripts', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch recommendations');
                }

                const result = await response.json();
                setAnimeRecommendations(result.data.animeRecommendations);
                setUserRecommendations(result.data.userRecommendations);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchRecommendations();
    }, []);

    if (loading) {
        return <div className="text-white text-center">Loading recommendations...</div>;
    }

    if (error) {
        return <div className="text-red-500 text-center">{error}</div>;
    }

    return (
        <div className="container mx-auto relative p-6">
            <h1 className="text-white text-2xl mb-4">Recommendations</h1>

            <div>
                <h2 className="text-white text-xl mb-2">Anime Recommendations</h2>
                <div className="flex flex-wrap gap-4 justify-center">
                    {animeRecommendations.map(anime => (
                        <div key={anime.animeId} className="w-40 h-80 p-4 bg-transparent">
                            <h1 className="text-white text-lg">{anime.name}</h1>
                            <p className="text-gray-400">{anime.genre.join(', ')}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-8">
                <h2 className="text-white text-xl mb-2">Similar Users</h2>
                <ul>
                    {userRecommendations.map(user => (
                        <li key={user.userId} className="text-gray-400">
                            {user.email}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Library;
