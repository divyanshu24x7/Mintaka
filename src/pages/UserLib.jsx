import React, { useEffect, useState } from "react";

const Library = () => {
  const [animeRecommendations, setAnimeRecommendations] = useState([]);
  const [userRecommendations, setUserRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch anime details by IDs
  const fetchAnimeDetails = async (animeIds) => {
    try {
      const response = await fetch("http://localhost:5000/anime-details", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ animeIds }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch anime details");
      }

      return await response.json(); // Return anime details
    } catch (err) {
      console.error(err);
      setError("Error fetching anime details.");
      return [];
    }
  };

  useEffect(() => {
    const fetchRecommendations = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please log in to view your library.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("http://localhost:5000/run-scripts", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch recommendations");
        }

        const result = await response.json();
        const animeRec = result.data.animeRecommendations;

        // Check if the recommendation is a message instead of an array
        if (animeRec && animeRec.message) {
          setError(animeRec.message);
        } else if (Array.isArray(animeRec)) {
          const animeDetails = await fetchAnimeDetails(animeRec);
          setAnimeRecommendations(animeDetails);
        } else {
          setError("Unexpected recommendation format.");
        }

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
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center">
          <div className="loader border-t-4 border-blue-500 rounded-full w-16 h-16 mb-4 animate-spin"></div>
          <p className="text-white text-lg">Fetching recommendations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6">Your Recommendations</h1>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Anime Recommendations</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {animeRecommendations.map((anime) => (
            <a
              key={anime.animeId}
              href={`http://localhost:3000/anime/${anime.animeId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-800 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow block"
            >
              <img
                src={anime.images?.jpg?.image_url || "placeholder.jpg"}
                alt={anime.title || "Anime"}
                className="w-full h-40 object-cover rounded-lg mb-4"
              />
              <h3 className="text-lg font-semibold">
                {anime.title || "Unknown Title"}
              </h3>
              <p className="text-sm text-gray-400 mt-2">
                {anime.genres?.map((genre) => genre.name).join(", ") ||
                  "Unknown Genre"}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {anime.synopsis
                  ? anime.synopsis.slice(0, 100) + "..."
                  : "No synopsis available."}
              </p>
            </a>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Users with Similar Taste</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {userRecommendations.map((user, index) => (
            <div
              key={index}
              className="bg-gray-800 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center space-x-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    User: {user.userId}
                  </h3>
                </div>
              </div>
              <div className="mt-4">
                <a
                  href={user.shareLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  View User Library
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Library;
