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

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174'];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (!allowedOrigins.includes(origin)) {
      return callback(new Error(`CORS: ${origin} not allowed`), false);
    }
    return callback(null, true);
  },
  credentials: true,
}));

app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Connect to MongoDB, then setup collections, middleware, routes, and listen
connectDB()
  .then(({ usersCollection, heritageCollection, festivalCollection }) => {
    // Middleware to attach DB collections and mail functions to req object
    app.use((req, res, next) => {
      req.db = { usersCollection, heritageCollection, festivalCollection };
      req.sendVerificationEmail = sendVerificationEmail;
      req.sendPasswordResetEmail = sendPasswordResetEmail;
      next();
    });

    // Routes
    app.use('/api', authRoutes);
    app.use('/api', profileRoutes);
    app.use('/api', heritageRoutes);
    app.use('/api', festivalRoutes);
    app.use('/api/admin', adminRoutes);
    app.use('/api', passwordRoutes);

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1); // Exit app if DB connection fails
  });
