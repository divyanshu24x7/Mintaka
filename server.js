import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import User from './models/User.js';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

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
    const token = jwt.sign({ userId: user._id }, 'your_jwt_secret', { expiresIn: '1h' });

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
