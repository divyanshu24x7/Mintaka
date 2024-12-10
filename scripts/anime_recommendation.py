import sys
import json
from pymongo import MongoClient
import pandas as pd
import implicit
import scipy.sparse as sparse
from bson.objectid import ObjectId

# Ensure userId is passed
if len(sys.argv) < 2:
    raise ValueError("Missing userId argument")

user_id = sys.argv[1]

# Connect to MongoDB
client = MongoClient("mongodb://localhost:27017/")
db = client["mintaka"]

# Fetch user-specific anime ratings ('animes' collection)
animes_data = list(db.animes.find({}, {"userId": 1, "animeId": 1, "rating": 1}))
animes_df = pd.DataFrame(animes_data)

# Fetch general anime data including genres ('generals' collection)
generals_data = list(db.generals.find({}, {"animeId": 1, "name": 1, "genre": 1, "rating": 1}))
generals_df = pd.DataFrame(generals_data)

# Ensure consistent format for userId
animes_df['userId'] = animes_df['userId'].astype(str)
user_id = str(ObjectId(user_id))  # Convert input user_id to match MongoDB format

# Debugging: Check if the user exists in the animes data
if user_id not in animes_df['userId'].unique():
    print(f"Debug: User {user_id} has no anime ratings in the database.")
    raise ValueError(f"User {user_id} not found in the data.")

# Create user-item matrix for implicit feedback
animes_df['user_index'] = pd.factorize(animes_df['userId'])[0]
animes_df['anime_index'] = pd.factorize(animes_df['animeId'])[0]
user_item_matrix = sparse.csr_matrix((animes_df['rating'], (animes_df['user_index'], animes_df['anime_index'])))

# Train ALS Model
als_model = implicit.als.AlternatingLeastSquares(factors=50, regularization=0.1)
als_model.fit(user_item_matrix)

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
    recommendations = generals_df[generals_df['animeId'].isin(top_anime_ids)][['animeId', 'name', 'genre']]

    return recommendations.to_dict(orient='records')

# Generate recommendations
recommendations = hybrid_similarity(user_id=user_id)

# Return the results as JSON
print(json.dumps(recommendations, indent=2))
