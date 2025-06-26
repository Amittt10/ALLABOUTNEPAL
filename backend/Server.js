import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { sendVerificationEmail, sendPasswordResetEmail } from './utils/mailer.js';

import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import heritageRoutes from './routes/heritageRoutes.js';
import festivalRoutes from './routes/festivalRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import passwordRoutes from './routes/passwordRoutes.js';
import searchRoutes from './routes/searchRoutes.js';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Allowed origins for CORS (frontend dev servers)
const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174'];

app.use(cors({
  origin: function(origin, callback) {
    // allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);

    if (!allowedOrigins.includes(origin)) {
      return callback(new Error(`CORS: ${origin} not allowed`), false);
    }
    return callback(null, true);
  },
  credentials: true,
}));

// Parse incoming JSON requests
app.use(express.json());

// Serve uploaded files statically from /uploads
app.use('/uploads', express.static('uploads'));

// Connect to MongoDB, get collections, and then start server & setup middleware/routes
connectDB()
  .then(({ usersCollection, heritageCollection, festivalCollection }) => {
    // Middleware to attach DB collections and mail functions to req
    app.use((req, res, next) => {
      req.db = { usersCollection, heritageCollection, festivalCollection };
      req.sendVerificationEmail = sendVerificationEmail;
      req.sendPasswordResetEmail = sendPasswordResetEmail;
      next();
    });

    // Mount API routes
    app.use('/api', authRoutes);
    app.use('/api', profileRoutes);
    app.use('/api', heritageRoutes);
    app.use('/api', festivalRoutes);
    app.use('/api/admin', adminRoutes);
    app.use('/api', passwordRoutes);
    app.use('/api', searchRoutes);
    

    // Start listening on the specified port
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1); // Exit app if DB connection fails
  });