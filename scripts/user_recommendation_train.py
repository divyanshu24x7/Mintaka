import pickle
import pandas as pd
from pymongo import MongoClient
from implicit.als import AlternatingLeastSquares
from scipy.sparse import coo_matrix

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
    ratings_data_filtered = ratings_data[ratings_data['rating'] > 0].copy()

    user_ids = ratings_data_filtered['userId'].unique()
    anime_ids = ratings_data_filtered['animeId'].unique()

    user_map = {user_id: idx for idx, user_id in enumerate(user_ids)}
    anime_map = {anime_id: idx for idx, anime_id in enumerate(anime_ids)}

    rows = ratings_data_filtered['userId'].map(user_map)
    cols = ratings_data_filtered['animeId'].map(anime_map)
    values = ratings_data_filtered['rating']

    ratings_matrix = coo_matrix((values, (rows, cols)), shape=(len(user_ids), len(anime_ids)))

    # Train ALS Model
    model = AlternatingLeastSquares(factors=20, regularization=0.1)
    model.fit(ratings_matrix.T.tocsr())  # Use CSR format for ALS model

    return model, user_map, user_ids

model, user_map, user_ids = build_user_similarity_model(ratings_data)

# Save the model and mappings
with open("user_rec_model.pkl", "wb") as f:
    pickle.dump({
        "model": model,
        "user_map": user_map,
        "user_ids": user_ids
    }, f)

print("User recommendation model training complete. Model and mappings saved.")
