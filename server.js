import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import User from './models/User.js';
import Anime from './models/Anime.js';
import General from './models/General.js';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import cron from 'node-cron';  // Import node-cron for scheduling

// Import child_process to run scripts
import { exec } from 'child_process';

dotenv.config()

const app = express();
const PORT = process.env.PORT || 5000;
const corsOptions = {
  origin: 'http://localhost:3000',
};

mongoose
  .connect('mongodb://localhost:27017/mintaka', {
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

// Training Script Runner Function
function runTrainingScripts() {
  console.log("Running training scripts...");
  exec('python scripts/anime_recommendation_train.py', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error running anime training script: ${error}`);
    } else {
      console.log(`Anime training script output: ${stdout}`);
    }
  });
  exec('python scripts/user_recommendation_train.py', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error running user training script: ${error}`);
    } else {
      console.log(`User training script output: ${stdout}`);
    }
  });
}

// Run training scripts immediately when the server starts
runTrainingScripts();

// Schedule training scripts to run at the start of every hour
cron.schedule('0 * * * *', () => {
  console.log("Scheduled training script run triggered at", new Date().toLocaleTimeString());
  runTrainingScripts();
});


// Endpoint to fetch user's anime list
app.get('/get-user-anime', authenticateToken, async (req, res) => {
  try {
    const userAnime = await Anime.find({ userId: req.user.userId });
    const animeIds = userAnime.map(entry => entry.animeId);
    const animeDetails = await General.find({ animeId: { $in: animeIds } });

    if (!animeDetails.length) {
      return res.status(404).json({ message: 'No anime found' });
    }

    res.json(animeDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Endpoint to fetch anime details by IDs
app.post('/anime-details', async (req, res) => {
  const { animeIds } = req.body;

  try {
      const animeDetails = await General.find({ animeId: { $in: animeIds } });
      if (!animeDetails.length) {
          return res.status(404).json({ message: 'No anime details found' });
      }

      res.json(animeDetails);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
  }
});


// Endpoint to fetch a user's shared anime list without authentication
app.get('/share/:userId', async (req, res) => {
  const { userId } = req.params; // Extract userId from the URL

  try {
    // Find all anime entries for the given userId in the Anime collection
    const userAnime = await Anime.find({ userId });
    if (!userAnime.length) {
      return res.status(404).json({ message: 'No anime found for this user' });
    }

    // Extract anime IDs from the userAnime list
    const animeIds = userAnime.map(entry => entry.animeId);

    // Fetch details for those anime from the General collection
    const animeDetails = await General.find({ animeId: { $in: animeIds } });
    if (!animeDetails.length) {
      return res.status(404).json({ message: 'No anime details found' });
    }

    // Return the anime details to the client
    res.json(animeDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


// Endpoint to add anime to General collection
app.post('/add-general-anime', authenticateToken, async (req, res) => {
  const animeData = req.body;

  try {
    const existingAnime = await General.findOne({ animeId: animeData.mal_id });
    if (existingAnime) {
      return res.status(400).json({ message: 'Anime already in general DB' });
    }

    const newGeneralEntry = new General({ ...animeData, animeId: animeData.mal_id });
    await newGeneralEntry.save();
    res.status(200).json({ message: 'Anime added to general DB' });
  } catch (error) {
    console.error('Error on server side', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Endpoint to add anime to user's list
app.post('/add-anime', authenticateToken, async (req, res) => {
  const { animeId, rating } = req.body;
  try {
    const userId = req.user.userId;
    const existingAnime = await Anime.findOne({ userId, animeId });
    if (existingAnime) {
      return res.status(400).json({ message: 'Anime already in your list' });
    }

    const newAnimeEntry = new Anime({ userId, animeId, rating });
    await newAnimeEntry.save();
    res.status(201).json({ message: 'Anime added in your list' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// const { exec } = require('child_process');

app.post('/run-recommendation', authenticateToken, (req, res) => {
    const { userId } = req.user;

    exec(`python scripts/anime_recommendation.py ${userId}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing script: ${error}`);
            return res.status(500).json({ message: 'Error running recommendation script' });
        }

        try {
            const recommendations = JSON.parse(stdout);
            res.json({ message: 'Recommendations generated successfully', data: recommendations });
        } catch (parseError) {
            console.error(`Error parsing JSON: ${parseError}`);
            res.status(500).json({ message: 'Error parsing recommendation output' });
        }
    });
});

app.post('/run-user-similarity', authenticateToken, (req, res) => {
    const { userId } = req.user;

    exec(`python scripts/user_recommendation.py ${userId}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing script: ${error}`);
            return res.status(500).json({ message: 'Error running user similarity script' });
        }

        try {
            const similarUsers = JSON.parse(stdout);
            res.json({ message: 'Similar users found successfully', data: similarUsers });
        } catch (parseError) {
            console.error(`Error parsing JSON: ${parseError}`);
            res.status(500).json({ message: 'Error parsing user similarity output' });
        }
    });
});

app.post('/run-scripts', authenticateToken, (req, res) => {
  const { userId } = req.user;

  const animeScript = `python scripts/anime_recommendation.py ${userId}`;
  const userScript = `python scripts/user_recommendation.py ${userId}`;

  // Execute both scripts in parallel
  Promise.all([
      new Promise((resolve, reject) => {
          exec(animeScript, (error, stdout) => {
              if (error) {
                  reject(`Anime script error: ${error}`);
              } else {
                  try {
                      resolve(JSON.parse(stdout));
                  } catch (parseError) {
                      reject(`Error parsing anime script output: ${parseError}`);
                  }
              }
          });
      }),
      new Promise((resolve, reject) => {
          exec(userScript, (error, stdout) => {
              if (error) {
                  reject(`User script error: ${error}`);
              } else {
                  try {
                      resolve(JSON.parse(stdout));
                  } catch (parseError) {
                      reject(`Error parsing user script output: ${parseError}`);
                  }
              }
          });
      })
  ])
      .then(([animeRecommendations, userRecommendations]) => {
          res.json({
              message: 'Scripts executed successfully',
              data: {
                  animeRecommendations,
                  userRecommendations
              }
          });
      })
      .catch(error => {
          console.error(error);
          res.status(500).json({ message: 'Error running scripts', error });
      });
});


// Authentication routes
app.post('/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({ email, password: hashedPassword });
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
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: 'Login successful', token, userId: user._id });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
