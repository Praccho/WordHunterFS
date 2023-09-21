import express from "express";
import { MongoClient } from "mongodb";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from 'dotenv';
dotenv.config();
import User from "./User.js";
import bcrypt from "bcrypt";

const app = express();
const port = 8080; // Default port to listen on.
let db;

// Middleware.
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(bodyParser.urlencoded({ extended: false }));

const client = new MongoClient(process.env.ATLAS_URI);

async function connectToMongoDB() {
  try {
    await client.connect();
    console.log('Connected successfully to MongoDB');
    db = client.db('database');
  } catch (err) {
    console.error('Error connecting to mongoDB:', err);
  }
}

// ====================================================================
// Routes
// ====================================================================

app.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    const currentUser = await db.collection('users').findOne({ username });
    
    if (currentUser) {
      return res.status(400).json({ error: 'Username already in use' })
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.collection('users').insertOne({
      username,
      password: hashedPassword,
      gamesPlayed: 0,
      highscore: 0
    });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration failed:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const currentUser = await db.collection('users').findOne({ username });

  if (!currentUser) {
    return res.status(401).json({ error: 'Authentication failed' });
  }

  const passwordValid = await bcrypt.compare(password, currentUser.password);

  if (!passwordValid) {
    return res.status(401).json({ error: 'Authentication failed' });
  }

  res.status(200).json({
    message: 'Login successful',
    username: currentUser.username,
    gamesPlayed: currentUser.gamesPlayed,
    highscore: currentUser.highscore
  })
});

app.post('/update', async (req, res) => {
  try {
    const { username, gamesPlayed, highscore } = req.body;

    await db.collection('users').updateOne(
      { username: username },
      { $set: { gamesPlayed: gamesPlayed, highscore: highscore } }
    );

    res.status(200).json({ message: 'Stats updated successfully' });
  } catch (error) {
    console.error('Update failed:', error);
    res.status(500).json({ error: 'Update failed' });
  }
});


// Start the Express server.
async function start() {
  await connectToMongoDB();
  app.listen(port, () => {
        console.log(`server started at http://localhost:${port}`);
  });
}

start();