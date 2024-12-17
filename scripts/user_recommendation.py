import sys
import json
from pymongo import MongoClient
import pandas as pd
from implicit.als import AlternatingLeastSquares
from scipy.sparse import coo_matrix

# Ensure userId is passed
if len(sys.argv) < 2:
    raise ValueError("Missing userId argument")

user_id = sys.argv[1]

# Connect to MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client['mintaka']

# Load data
ratings_data = pd.DataFrame(list(db.animes.find()))
users_data = pd.DataFrame(list(db.users.find()))

# Ensure consistent formats
ratings_data['userId'] = ratings_data['userId'].astype(str)
ratings_data['animeId'] = ratings_data['animeId'].astype(str)
users_data['_id'] = users_data['_id'].astype(str)

def build_user_similarity_model(ratings_data):
    # Filter for valid ratings
    ratings_data = ratings_data[ratings_data['rating'] > 0].copy()

    user_ids = ratings_data['userId'].unique()
    anime_ids = ratings_data['animeId'].unique()

    user_map = {user_id: idx for idx, user_id in enumerate(user_ids)}
    anime_map = {anime_id: idx for idx, anime_id in enumerate(anime_ids)}

    rows = ratings_data['userId'].map(user_map)
    cols = ratings_data['animeId'].map(anime_map)
    values = ratings_data['rating']

    ratings_matrix = coo_matrix((values, (rows, cols)), shape=(len(user_ids), len(anime_ids)))

    # Train ALS Model
    model = AlternatingLeastSquares(factors=20, regularization=0.1)
    model.fit(ratings_matrix.T.tocsr())  # Use CSR format for ALS model

    return model, user_map, user_ids

def find_similar_users(user_id, model, user_map, user_ids, num_similar=10):
    # Ensure user exists
    if user_id not in user_map:
        return [], []

    user_idx = user_map[user_id]
    similar_users, similarity_scores = model.similar_users(user_idx, num_similar + 1)

    # Check the length of similar_users to prevent accessing out-of-bounds indices
    similar_user_ids = []
    for user_idx in similar_users[1:]:
        # Ensure the index is within bounds
        if user_idx < len(user_ids):
            similar_user_ids.append(user_ids[user_idx])
        else:
            # Handle the case where an out-of-bounds index is encountered
            #print(f"Warning: User index {user_idx} is out of bounds for user_ids.")
            break  # Stop processing further users if an out-of-bounds index is encountered

    similarity_scores = similarity_scores[1:]  # Skip the first score, as it's the score for the user itself

    return similar_user_ids, similarity_scores

def get_similar_users(user_id, num_similar=10):
    model, user_map, user_ids = build_user_similarity_model(ratings_data)
    similar_users, similarity_scores = find_similar_users(user_id, model, user_map, user_ids, num_similar)

    # Generate shareable links for similar users
    shareable_links = []
    for sim_user in similar_users:
        # Generate shareable library link
        shareable_links.append({
            "userId": sim_user,
            "shareLink": f"http://localhost:3000/share/{sim_user}"
        })

    return shareable_links

# Generate and display results
similar_users = get_similar_users(user_id=user_id)
print(json.dumps(similar_users, indent=2))
