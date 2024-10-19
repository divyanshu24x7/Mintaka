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
client = MongoClient('mongodb://localhost:27017/mintaka')
db = client['mintaka']

ratings_data = pd.DataFrame(list(db.animes.find()))
users_data = pd.DataFrame(list(db.users.find()))

def build_user_similarity_model(ratings_data, users_data):
    ratings_data = ratings_data[ratings_data['rating'] > 0]
    ratings_data['userId'] = ratings_data['userId'].astype(str)
    ratings_data['animeId'] = ratings_data['animeId'].astype(str)

    user_ids = ratings_data['userId'].unique()
    anime_ids = ratings_data['animeId'].unique()

    user_map = {user_id: idx for idx, user_id in enumerate(user_ids)}
    anime_map = {anime_id: idx for idx, anime_id in enumerate(anime_ids)}

    rows = ratings_data['userId'].map(user_map)
    cols = ratings_data['animeId'].map(anime_map)

    values = ratings_data['rating']
    ratings_matrix = coo_matrix((values, (rows, cols)), shape=(len(user_ids), len(anime_ids)))

    model = AlternatingLeastSquares(factors=20, regularization=0.1)
    model.fit(ratings_matrix.T)

    return model, user_map, user_ids

def find_similar_users(user_id, model, user_map, user_ids, num_similar=10):
    if user_id not in user_map:
        return [], []
    user_idx = user_map[user_id]
    similar_users, similarity_scores = model.similar_users(user_idx, num_similar + 1)

    similar_user_ids = [user_ids[user_idx] for user_idx in similar_users[1:]]
    similarity_scores = similarity_scores[1:]

    return similar_user_ids, similarity_scores

def get_similar_users(user_id, num_similar=10):
    model, user_map, user_ids = build_user_similarity_model(ratings_data, users_data)
    similar_users, similarity_scores = find_similar_users(user_id, model, user_map, user_ids, num_similar)

    similar_user_emails = [
        {"userId": sim_user, "email": users_data[users_data['_id'] == sim_user]['email'].values[0]}
        for sim_user in similar_users
    ]

    return similar_user_emails

similar_users = get_similar_users(user_id=user_id)
print(json.dumps(similar_users))
