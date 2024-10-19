// UserLib.jsx

import React, { useState, useEffect } from 'react';

const UserLib = ({ userId }) => {
    const [loading, setLoading] = useState(true);
    const [animeRecommendations, setAnimeRecommendations] = useState([]);
    const [userRecommendations, setUserRecommendations] = useState([]);

    useEffect(() => {
        const fetchRecommendations = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Please log in to view your library.');
                return;
            }

            try {
                // Fetch anime recommendations
                const animeResponse = await fetch(`http://localhost:5000/run-recommendation`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}` // Pass the token here for authentication
                    }
                });

                const animeData = await animeResponse.json();
                setAnimeRecommendations(animeData);

                // Fetch user recommendations
                const userResponse = await fetch(`http://localhost:5000/run-user-similarity`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}` // Pass the token here for authentication
                    }
                });
                const userData = await userResponse.json();
                setUserRecommendations(userData);
            } catch (error) {
                console.error("Error fetching recommendations:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendations();
    }, [userId]);

    if (loading) {
        return <div>Loading... Please hang tight while we generate your recommendations!</div>;
    }

    return (
        <div>
            <h2>Anime Recommendations</h2>
            <ul>
                {animeRecommendations.map((anime, index) => (
                    <li key={index}>{anime.name} - {anime.genre.join(', ')}</li>
                ))}
            </ul>

            <h2>User Recommendations</h2>
            <ul>
                {userRecommendations.map((user, index) => (
                    <li key={index}>User Email: {user.email}, Similarity Score: {user.similarityScore}</li>
                ))}
            </ul>
        </div>
    );
};

export default UserLib;
