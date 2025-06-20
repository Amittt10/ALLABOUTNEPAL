// ==========================
// SERVER.JS
// ==========================

import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// CORS setup
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

// Multer setup
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

// MongoDB setup
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

// Middleware: Authenticate JWT
const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Middleware: Authorize Admin
const authorizeAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden: Admins only' });
  }
  next();
};

// Nodemailer setup
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // Use true if port is 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendVerificationEmail = async (to, url) => {
  await transporter.sendMail({
    from: `"Heritage App" <${process.env.SMTP_USER}>`,
    to,
    subject: 'Verify Your Email',
    html: `
      <h2>Email Verification</h2>
      <p>Click the link below to verify your email:</p>
      <a href="${url}">${url}</a>
    `,
  });
};


// ==========================
// AUTH ROUTES
// ==========================

//Register
app.post('/api/register', async (req, res) => {
  const { fullname, username, email, password } = req.body;
  const emailLower = email.toLowerCase();

  try {
    const existingUser = await usersCollection.findOne({ email: emailLower });
    if (existingUser) return res.status(400).json({ message: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString('hex');

    const newUser = {
      fullname,
      username,
      email: emailLower,
      password: hashedPassword,
      verified: false,
      verificationToken,
      role: 'user',
    };

    await usersCollection.insertOne(newUser);

    // Send verification email
    const verifyURL = `http://localhost:5173/verify?token=${verificationToken}&email=${emailLower}`;
    await sendVerificationEmail(emailLower, verifyURL);

    res.status(201).json({ message: 'Signup successful. Please check your email to verify your account.' });
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
    if (email === process.env.ADMIN_EMAIL) {
      if (password === process.env.ADMIN_PASSWORD) {
        const token = jwt.sign({ email, role: 'admin' }, JWT_SECRET, { expiresIn: '1h' });
        return res.json({ token, user: { email, role: 'admin' } });
      } else {
        return res.status(401).json({ message: 'Invalid admin credentials' });
      }
    }

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

// Verify Email
app.get('/api/verify-email', async (req, res) => {
  const { token, email } = req.query;

  try {
    const user = await usersCollection.findOne({ email, verificationToken: token });
    if (!user) return res.status(400).send('Invalid or expired verification link.');

    await usersCollection.updateOne(
      { email },
      { $set: { verified: true }, $unset: { verificationToken: "" } }
    );

    res.send("✅ Email verified successfully. You may now log in.");
  } catch (err) {
    console.error("Email verification error:", err);
    res.status(500).send("Email verification failed.");
  }
});


// ==========================
// PROFILE ROUTES
// ==========================

// Get Profile
app.get('/api/profile', authenticateJWT, async (req, res) => {
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
    console.error('Profile error:', err);
    res.status(500).json({ message: 'Failed to fetch profile' });
  }
});

// Update Profile
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

app.get('/api/heritage', async (req, res) => {
  try {
    const heritage = await heritageCollection.find().toArray();
    res.json(heritage);
  } catch (err) {
    console.error('Fetch heritage error:', err);
    res.status(500).json({ message: 'Failed to fetch heritage sites' });
  }
});

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
// ADMIN HERITAGE CRUD
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
    res.status(201).json({ _id: result.insertedId, name, description });
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
// VERIFY & STATS ROUTES
// ==========================

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
