import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import User from './models/User.js';
import Anime from './models/Anime.js';
import General from './models/General.js';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config()

const app = express();
const PORT = process.env.PORT || 5000;
const corsOptions = {
  origin:'http://localhost:3000',
};

mongoose
  .connect('mongodb://localhost:27017/user_auth', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB connection error:', err));


// Middleware
app.use(cors(corsOptions)); // Enable CORS to allow requests from your frontend
app.use(express.json()); // Parse incoming JSON requests

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];

    if (!token) return res.sendStatus(401); // Unauthorized

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403); // Forbidden
        req.user = user; // Save the user information from the token
        next(); // Proceed to the next middleware/route handler
    });
};

app.get('/get-user-anime/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    // Fetch user's saved anime from the database
    const userAnime = await Anime.find({ userId }); // Adjust query according to your schema

    if (!userAnime.length) {
      return res.status(404).json({ message: 'User not found or no anime in the library' });
    }

    // Extract anime IDs or the needed data
    const savedAnimeIds = userAnime.map(anime => anime.animeId); // Adjust based on your schema

    res.json(savedAnimeIds); // Send back the anime IDs
  } catch (error) {
    console.error('Error fetching user anime:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/get-user-anime', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId; // Extract user ID from the token
    const userAnimeList = await Anime.find({ userId }); // Get user's anime list

    // Extract the anime IDs from the retrieved documents
    const animeIds = userAnimeList.map(anime => anime.animeId);
    res.json(animeIds); // Return the anime IDs
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});
app.post('/add-general-anime', authenticateToken, async (req, res) => {
  const animeData = req.body;  // Frontend sends the full anime data

  // console.log(animeData.mal_id);

  try {
      // Check if the anime is already in the general DB
      const existingAnime = await General.findOne({ animeId: animeData.mal_id });
      if (existingAnime) {
          return res.status(400).json({ message: "Anime already in general DB" });
      }

      // Prepare the new entry with the complete data from frontend
      const newGeneralEntry = new General({
          animeId: animeData.mal_id,
          url: animeData.url,
          images: animeData.images,
          trailer: animeData.trailer,
          approved: animeData.approved,
          titles: animeData.titles,
          title: animeData.title,
          title_english: animeData.title_english,
          title_japanese: animeData.title_japanese,
          title_synonyms: animeData.title_synonyms,
          type: animeData.type,
          source: animeData.source,
          episodes: animeData.episodes,
          status: animeData.status,
          airing: animeData.airing,
          aired: animeData.aired,
          duration: animeData.duration,
          rating: animeData.rating,
          score: animeData.score,
          scored_by: animeData.scored_by,
          rank: animeData.rank,
          popularity: animeData.popularity,
          members: animeData.members,
          favorites: animeData.favorites,
          synopsis: animeData.synopsis,
          background: animeData.background,
          season: animeData.season,
          year: animeData.year,
          broadcast: animeData.broadcast,
          producers: animeData.producers,
          licensors: animeData.licensors,
          studios: animeData.studios,
          genres: animeData.genres,
          explicit_genres: animeData.explicit_genres,
          themes: animeData.themes,
          demographics: animeData.demographics
      });

      // Save to the database
      await newGeneralEntry.save();
      res.status(200).json({ message: "Anime added to general DB" });
  } catch (error) {
      console.error("Error on server side", error);
      res.status(500).json({ message: "Server error" });
  }
});


app.post('/add-anime',authenticateToken,async(req,res)=>{
  const {animeId,rating} = req.body
  try{
    const userId = req.user.userId

    const existingAnime = await Anime.findOne({userId,animeId})
    if(existingAnime){
      return res.status(400).json({message:'anime already in your list'})
    }
    const newAnimeEntry = new Anime({
      userId,
      animeId,
      rating
    })

    await newAnimeEntry.save();
    res.status(201).json({message:'anime added in your list'})
  }catch(error){
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
})

// Example of protected route
app.get('/protected-route', authenticateToken, (req, res) => {
    res.json({ message: 'You are authenticated!', user: req.user });
});


// Sample API endpoint
app.get('/api/message', (req, res) => {
  res.json({ message: 'Hello Divyanhu from the Node.js server!' });
});

app.post('/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    user = new User({
      email,
      password: hashedPassword,
    });

    // Save user in MongoDB
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Compare the entered password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Optionally, create a JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const userId = user._id
    res.status(200).json({ message: 'Login successful', token,userId });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
