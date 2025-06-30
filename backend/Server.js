// backend/Server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { sendVerificationEmail, sendPasswordResetEmail } from './utils/mailer.js';

import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import heritageRoutes from './routes/heritageRoutes.js';
import festivalRoutes from './routes/festivalRoutes.js';  // public festival routes
import adminRoutes from './routes/adminRoutes.js';        // admin routes
import passwordRoutes from './routes/passwordRoutes.js';
import searchRoutes from './routes/searchRoutes.js';
import subscriberRoutes from './routes/subscriberRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174'];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (!allowedOrigins.includes(origin)) {
        return callback(new Error(`CORS: ${origin} not allowed`), false);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Connect to DB and start server
connectDB()
  .then(({ usersCollection, heritageCollection, festivalCollection, subscribersCollection }) => {
    // Attach collections and mailers to req object
    app.use((req, res, next) => {
      req.db = { usersCollection, heritageCollection, festivalCollection, subscribersCollection };
      req.sendVerificationEmail = sendVerificationEmail;
      req.sendPasswordResetEmail = sendPasswordResetEmail;
      next();
    });

    // Mount routes
    app.use('/api', authRoutes);
    app.use('/api', profileRoutes);
    app.use('/api', heritageRoutes);
    app.use('/api/festivals', festivalRoutes);  // public festival routes
    app.use('/api/admin', adminRoutes);       // admin routes for festivals, heritage, etc.
    app.use('/api', passwordRoutes);
    app.use('/api', searchRoutes);
    app.use('/api/subscribers', subscriberRoutes);

    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });
