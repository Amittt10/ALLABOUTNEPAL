// config/db.js
import { MongoClient, ServerApiVersion } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

let dbInstance = null;

export async function connectDB() {
  if (dbInstance) return dbInstance; // ✅ return cached instance if already connected

  const client = new MongoClient(process.env.MONGO_URI, {
    serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true },
  });

  try {
    await client.connect();
    console.log("✅ Connected to MongoDB Atlas (native driver)");
    const db = client.db("auth_demo");

    dbInstance = {
      usersCollection: db.collection("users"),
      heritageCollection: db.collection("heritage_sites"),
      festivalCollection: db.collection("festivals"),
      subscribersCollection: db.collection("subscribers"),
      placesCollection: db.collection("places"),
    };

    return dbInstance;
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
}
