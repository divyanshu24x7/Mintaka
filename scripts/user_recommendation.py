import sys
import json
import pickle
import os
# from datetime import datetime, timedelta

# Ensure userId is passed
if len(sys.argv) < 2:
    raise ValueError("Missing userId argument")

user_id = sys.argv[1]


# Determine the directory where this script is located
script_dir = os.path.dirname(os.path.abspath(__file__))

# Construct the full path to the model file
model_file = os.path.join(script_dir, "user_rec_model.pkl")

# Load the pre-trained model and mappings
with open(model_file, "rb") as f:
    data = pickle.load(f)

model = data["model"]
user_map = data["user_map"]
user_ids = data["user_ids"]

# Check if the user exists in the mapping; if not, inform the user and exit.
if user_id not in user_map:
    # next_update = (datetime.now() + timedelta(hours=1)).strftime("%I:%M %p")
    message = {
        "message": f"Your recommendations are being updated hourly. Please add more anime ratings to your profile, and check back in an hour or so."
    }
    print(json.dumps(message, indent=2))
    exit(0)

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
            break  # Stop processing further users if an out-of-bounds index is encountered

    similarity_scores = similarity_scores[1:]  # Skip the first score, as it's the score for the user itself

    return similar_user_ids, similarity_scores

def get_similar_users(user_id, num_similar=10):
    similar_users, similarity_scores = find_similar_users(user_id, model, user_map, user_ids, num_similar)

    # Generate shareable links for similar users
    shareable_links = []
    for sim_user in similar_users:
        shareable_links.append({
            "userId": sim_user,
            "shareLink": f"http://localhost:3000/share/{sim_user}"
        })

    return shareable_links

# Generate and display results
similar_users = get_similar_users(user_id=user_id)
print(json.dumps(similar_users, indent=2))
