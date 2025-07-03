// config/mongoose.js
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

export const connectMongoose = async () => {
  try {
    const dbURI = process.env.MONGO_URI;

    if (!dbURI) {
      throw new Error("MONGO_URI is not defined in .env");
    }

    await mongoose.connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const dbName = mongoose.connection.name;
    console.log(`✅ Mongoose connected to database: ${dbName}`);
  } catch (error) {
    console.error("❌ Mongoose connection error:", error.message);
    process.exit(1);
  }
};
