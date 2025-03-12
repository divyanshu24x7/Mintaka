import sys
import json
import pickle
from bson.objectid import ObjectId
import os

# Ensure userId is passed
if len(sys.argv) < 2:
    raise ValueError("Missing userId argument")

user_id = sys.argv[1]

# Determine the directory where this script is located
script_dir = os.path.dirname(os.path.abspath(__file__))

# Construct the full path to the model file
model_file = os.path.join(script_dir, "anime_als_model.pkl")
animes_file = os.path.join(script_dir, "anime_data.pkl")

# Load the pre-trained model and data
with open(model_file, "rb") as f:
    als_model = pickle.load(f)

with open(animes_file, "rb") as f:
    animes_df = pickle.load(f)

# Convert input user_id to MongoDB format
user_id = str(ObjectId(user_id))

# Debugging: Check if the user exists in the animes data
if user_id not in animes_df['userId'].unique():
    print(f"Debug: User {user_id} has no anime ratings in the database.")
    raise ValueError(f"User {user_id} not found in the data.")

# Hybrid Similarity Function
def hybrid_similarity(user_id, top_n=10):
    user_id = str(user_id)
    user_index = animes_df[animes_df['userId'] == user_id].iloc[0]['user_index']
    watched_anime_ids = animes_df[animes_df['userId'] == user_id]['animeId'].unique()

    # Explicit prediction scores (mocking the SVD functionality)
    anime_scores = {anime_id: 0 for anime_id in animes_df['animeId'].unique() if anime_id not in watched_anime_ids}

    # Similar users from ALS
    similar_users_indices, similar_users_scores = als_model.similar_users(user_index, N=top_n)
    for user_sim_index, sim_score in zip(similar_users_indices, similar_users_scores):
        user_anime = animes_df[animes_df['user_index'] == user_sim_index]
        for _, row in user_anime.iterrows():
            anime_id = row['animeId']
            if anime_id not in watched_anime_ids:
                if anime_id in anime_scores:
                    anime_scores[anime_id] += 0.3 * row['rating']

    # Get top recommendations
    top_anime_ids = sorted(anime_scores, key=anime_scores.get, reverse=True)[:top_n]
    return list(map(int, top_anime_ids))  # Convert to Python int for JSON serialization

# Generate recommendations
recommendations = hybrid_similarity(user_id=user_id)

# Print only anime IDs as JSON
print(json.dumps(recommendations, indent=2))
