import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb';

// Constants
const app = express();
const PORT = 3000;
const JWT_SECRET = 'your_jwt_secret'; // In production, use .env

// Middleware
app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use('/uploads', express.static('uploads')); // Serve uploaded profile photos

// Multer setup for file uploads (profile pictures)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = './uploads';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });

// MongoDB Setup
const uri = "mongodb+srv://majhiamit4045:Amit4045@cluster0.l1jzczl.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true }
});

let usersCollection;
let heritageCollection;
let festivalCollection;

async function startServer() {
  try {
    await client.connect();
    console.log("✅ Connected to MongoDB Atlas");

    const db = client.db('auth_demo');
    usersCollection = db.collection('users');
    heritageCollection = db.collection('heritage_sites');
    festivalCollection = db.collection('festivals');

    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
  }
}
startServer();

// ==========================
// ✅ AUTH ROUTES
// ==========================

// Register
app.post('/api/register', async (req, res) => {
  const email = req.body.email.toLowerCase();
  const { password } = req.body;

  try {
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already registered' });

    const passwordHash = await bcrypt.hash(password, 10);
    await usersCollection.insertOne({ email, password: passwordHash });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  const email = req.body.email.toLowerCase();
  const { password } = req.body;

  try {
    const user = await usersCollection.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// ==========================
// ✅ PROFILE ROUTES
// ==========================

// Get user profile (protected)
app.get('/api/profile', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await usersCollection.findOne(
      { _id: new ObjectId(decoded.userId) },
      { projection: { password: 0 } }
    );

    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error('Token error:', err);
    res.status(401).json({ message: 'Invalid token' });
  }
});

// Update user profile (name and photo)
app.post('/api/profile/update', upload.single('photo'), async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const updateFields = {};

    if (req.body.name) updateFields.name = req.body.name;
    if (req.file) updateFields.photo = req.file.path;

    await usersCollection.updateOne(
      { _id: new ObjectId(decoded.userId) },
      { $set: updateFields }
    );

    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ message: 'Profile update failed' });
  }
});

// ==========================
// ✅ PUBLIC CONTENT ROUTES
// ==========================

// Heritage sites
app.get('/api/heritage', async (req, res) => {
  try {
    const results = await heritageCollection.find().toArray();
    res.json(results);
  } catch (err) {
    console.error('Error fetching heritage:', err);
    res.status(500).json({ message: 'Failed to fetch heritage sites' });
  }
});

// Festivals
app.get('/api/festivals', async (req, res) => {
  try {
    const results = await festivalCollection.find().toArray();
    res.json(results);
  } catch (err) {
    console.error('Error fetching festivals:', err);
    res.status(500).json({ message: 'Failed to fetch festivals' });
  }
});

// ==========================
// ✅ PROTECTED ROUTES EXAMPLE
// ==========================

const protectedHandler = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await usersCollection.findOne({ _id: new ObjectId(decoded.userId) });
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'Protected content visible', user: { email: user.email } });
  } catch (err) {
    console.error('Protected route error:', err);
    res.status(401).json({ message: 'Invalid token' });
  }
};

app.get('/api/cultural-heritage', protectedHandler);
app.get('/api/festivals-protected', protectedHandler);
app.get('/api/quiz', protectedHandler);
