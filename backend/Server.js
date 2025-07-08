// Server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import path from "path";
import { fileURLToPath } from "url";


import { connectDB } from "./config/db.js";
import { connectMongoose } from "./config/mongoose.js";

import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import heritageRoutes from "./routes/heritageRoutes.js";
import festivalRoutes from "./routes/festivalRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import passwordRoutes from "./routes/passwordRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";
import subscriberRoutes from "./routes/subscriberRoutes.js";
import placeRoutes from "./routes/placeRoutes.js";
import quizRoutes from './routes/quizRoutes.js';
import { deleteOldQuizResults } from "./controllers/quizController.js";
import reviewRoutes from './routes/reviewRoutes.js';



dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = ["http://localhost:5173", "http://localhost:5174"];

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

// ES module fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Serve static uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


Promise.all([connectDB(), connectMongoose()])
  .then(([nativeDb]) => {
    app.use((req, res, next) => {
      req.db = nativeDb; // native collections
      next();
    });

    // Public & Admin Routes
    app.use("/api", authRoutes);
    app.use("/api", profileRoutes);
    app.use("/api", heritageRoutes);
    app.use("/api/festivals", festivalRoutes);
    app.use("/api/admin", adminRoutes);
    app.use("/api", passwordRoutes);
    app.use("/api", searchRoutes);
    app.use("/api/subscribers", subscriberRoutes);
    app.use("/api/places", placeRoutes);
    app.use("/api/quiz", quizRoutes);
    app.use('/api/admin/quiz', quizRoutes);
    app.use('/api/reviews', reviewRoutes);

    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);

           // 🧹 Daily quiz result cleanup
      setInterval(() => {
        deleteOldQuizResults()
          .then(() => console.log("✅ Old quiz results cleaned up"))
          .catch((err) => console.error("❌ Cleanup error:", err));
      }, 24 * 60 * 60 * 1000);
    });
  })

  .catch((err) => {
    console.error("❌ DB connection error:", err);
    process.exit(1);
  });
