// config/mongoose.js
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export const connectMongoose = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Mongoose connected");
  } catch (error) {
    console.error("❌ Mongoose connection error:", error);
    process.exit(1);
  }
};
