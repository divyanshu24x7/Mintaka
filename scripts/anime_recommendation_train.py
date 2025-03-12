import pickle
from pymongo import MongoClient
import pandas as pd
import implicit
import scipy.sparse as sparse

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

# Create user-item matrix for implicit feedback
animes_df['user_index'] = pd.factorize(animes_df['userId'])[0]
animes_df['anime_index'] = pd.factorize(animes_df['animeId'])[0]
user_item_matrix = sparse.csr_matrix((animes_df['rating'], (animes_df['user_index'], animes_df['anime_index'])))

# Train ALS Model
als_model = implicit.als.AlternatingLeastSquares(factors=50, regularization=0.1)
als_model.fit(user_item_matrix)

# Save the model and data
with open("anime_als_model.pkl", "wb") as f:
    pickle.dump(als_model, f)

with open("anime_data.pkl", "wb") as f:
    pickle.dump(animes_df, f)

print("Training complete. Model and data saved.")
