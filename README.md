# Mintaka

Mintaka is an anime recommendation and community platform designed to connect users based on their anime preferences. By analyzing user tastes and comparing anime lists, Mintaka helps users discover others with similar interests and find recommendations tailored to their unique preferences.

## Features

- **Search Anime**: Explore anime using the [Jikan API](https://jikan.moe/).
- **User Libraries**: Create and manage personalized anime lists.
- **Public Libraries**: View and compare other users' lists.
- **Recommendations**: Find users with similar tastes and get personalized anime recommendations.
- **Cosine Similarity Algorithm**: A scalable recommendation engine built on user and anime data.

## Technologies Used

### Frontend
- ReactJS: For building the user interface.
- CSS/Tailwind: For responsive and modern design.

### Backend
- Node.js: Backend framework for server-side logic.
- Express.js: Routing and API management.
- MongoDB: Database for storing user, anime, and recommendation data.

### APIs
- **[Jikan API](https://jikan.moe/)**: Fetch anime data directly from MyAnimeList.

## Database Schema

### `users` Table
- `_id`: Unique identifier.
- `username`: User's display name.
- `email`: User's email address.
- `password`: User's hashed password.

### `generals` Table
- `_id`: Unique identifier.
- `animeId`: Corresponding MyAnimeList anime ID.
- `name`: Name of the anime.
- `genre`: List of genres.
- `rating`: Average rating of the anime.

### `anime` Table
- `_id`: Unique identifier.
- `userId`: References a user in the `users` table.
- `animeId`: References an anime in the `generals` table.
- `rating`: User's rating for the anime.

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) installed.
- [MongoDB](https://www.mongodb.com/) running locally or on the cloud.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/mintaka.git
   cd mintaka
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the backend server:
   ```bash
   node server.js
   ```

4. Start the React frontend:
   ```bash
   npm run dev
   ```

5. Access Mintaka at [http://localhost:3000](http://localhost:3000).

## Roadmap

- [ ] Improve recommendation engine with hybrid models (e.g., Surprise and Implicit).
- [ ] Add real-time notifications for new matches and recommendations.
- [ ] Implement user authentication using OAuth or JWT.
- [ ] Enhance UI/UX with animations and dark amoled theme.

## Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a new branch (`feature/your-feature`).
3. Commit your changes.
4. Open a pull request.

## License

This project is licensed under the GNU General Public License v2.0 License. See the [LICENSE](LICENSE) file for details.

## Authors

- **Karan Pratap Shaw** ([GitHub](https://github.com/iCaran))
- **Divyanshu Kumar**

## Acknowledgments

- The [Jikan API](https://jikan.moe/) for anime data.
- Open-source tools and libraries used in the project.

---

Feel free to explore, contribute, and make Mintaka even better!
```
