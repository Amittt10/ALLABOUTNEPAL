import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// CORS setup - allow localhost ports 5173 and 5174
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `CORS policy: Origin ${origin} not allowed`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
}));

app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Multer setup for uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './uploads';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });

// MongoDB Setup
const uri = process.env.MONGO_URI;
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

// Middleware: Authenticate JWT token
const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // save decoded user info
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Middleware: Authorize Admin only
const authorizeAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden: Admins only' });
  }
  next();
};

// ==========================
// AUTH ROUTES
// ==========================

// Register (normal users)
app.post('/api/register', async (req, res) => {
  const email = req.body.email.toLowerCase();
  const { password } = req.body;

  try {
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already registered' });

    const passwordHash = await bcrypt.hash(password, 10);
    await usersCollection.insertOne({ email, password: passwordHash, role: 'user' });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login (user or admin)
app.post('/api/login', async (req, res) => {
  const email = req.body.email.toLowerCase();
  const { password } = req.body;

  try {
    // Check if admin login
    if (email === process.env.ADMIN_EMAIL) {
      if (password === process.env.ADMIN_PASSWORD) {
        const token = jwt.sign({ email, role: 'admin' }, JWT_SECRET, { expiresIn: '1h' });
        return res.json({ token, user: { email, role: 'admin' } });
      } else {
        return res.status(401).json({ message: 'Invalid admin credentials' });
      }
    }

    // Normal user login
    const user = await usersCollection.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id, email: user.email, role: 'user' }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { email: user.email, id: user._id, role: 'user' } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// ==========================
// PROFILE ROUTES
// ==========================

// Get profile (protected)
app.get('/api/profile', authenticateJWT, async (req, res) => {
  try {
    if (req.user.role === 'admin') {
      // Admin profile (minimal example)
      return res.json({ email: req.user.email, role: 'admin' });
    }

    const user = await usersCollection.findOne(
      { _id: new ObjectId(req.user.userId) },
      { projection: { password: 0 } }
    );
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error('Profile error:', err);
    res.status(500).json({ message: 'Failed to fetch profile' });
  }
});

// Update profile (name and photo) for users only
app.post('/api/profile/update', authenticateJWT, upload.single('photo'), async (req, res) => {
  if (req.user.role !== 'user') return res.status(403).json({ message: 'Only users can update profile' });

  try {
    const updateFields = {};
    if (req.body.name) updateFields.name = req.body.name;
    if (req.file) updateFields.photo = req.file.path;

    await usersCollection.updateOne(
      { _id: new ObjectId(req.user.userId) },
      { $set: updateFields }
    );

    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ message: 'Profile update failed' });
  }
});

// ==========================
// PUBLIC ROUTES
// ==========================

// Get heritage sites (public)
app.get('/api/heritage', async (req, res) => {
  try {
    const heritage = await heritageCollection.find().toArray();
    res.json(heritage);
  } catch (err) {
    console.error('Fetch heritage error:', err);
    res.status(500).json({ message: 'Failed to fetch heritage sites' });
  }
});

// Get festivals (public)
app.get('/api/festivals', async (req, res) => {
  try {
    const festivals = await festivalCollection.find().toArray();
    res.json(festivals);
  } catch (err) {
    console.error('Fetch festivals error:', err);
    res.status(500).json({ message: 'Failed to fetch festivals' });
  }
});

// ==========================
// ADMIN HERITAGE CRUD (protected and admin-only)
// ==========================

app.get('/api/admin/heritage', authenticateJWT, authorizeAdmin, async (req, res) => {
  try {
    const heritage = await heritageCollection.find().toArray();
    res.json(heritage);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch heritage sites' });
  }
});

app.post('/api/admin/heritage', authenticateJWT, authorizeAdmin, async (req, res) => {
  const { name, description } = req.body;
  if (!name) return res.status(400).json({ message: 'Name is required' });

  try {
    const result = await heritageCollection.insertOne({ name, description });
    res.status(201).json(result.ops ? result.ops[0] : { _id: result.insertedId, name, description });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add heritage site' });
  }
});

app.put('/api/admin/heritage/:id', authenticateJWT, authorizeAdmin, async (req, res) => {
  const id = req.params.id;
  const { name, description } = req.body;

  try {
    const result = await heritageCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { name, description } },
      { returnDocument: 'after' }
    );
    if (!result.value) return res.status(404).json({ message: 'Heritage site not found' });
    res.json(result.value);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update heritage site' });
  }
});

app.delete('/api/admin/heritage/:id', authenticateJWT, authorizeAdmin, async (req, res) => {
  const id = req.params.id;
  try {
    const result = await heritageCollection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) return res.status(404).json({ message: 'Heritage site not found' });
    res.json({ message: 'Heritage site deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete heritage site' });
  }
});

// ==========================
// NEW ROUTES YOU REQUESTED
// ==========================

// Token verification route (verify token and get user info)
app.get('/api/verify', authenticateJWT, async (req, res) => {
  try {
    if (req.user.role === 'admin') {
      return res.json({ email: req.user.email, role: 'admin' });
    }
    const user = await usersCollection.findOne(
      { _id: new ObjectId(req.user.userId) },
      { projection: { password: 0 } }
    );
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error('Verify error:', err);
    res.status(500).json({ message: 'Verification failed' });
  }
});

// Admin stats route (protected & admin only)
app.get('/api/admin/stats', authenticateJWT, authorizeAdmin, async (req, res) => {
  try {
    const userCount = await usersCollection.countDocuments();
    const heritageCount = await heritageCollection.countDocuments();
    const festivalCount = await festivalCollection.countDocuments();

    res.json({ userCount, heritageCount, festivalCount });
  } catch (err) {
    console.error('Stats error:', err);
    res.status(500).json({ message: 'Failed to fetch stats' });
  }
});
