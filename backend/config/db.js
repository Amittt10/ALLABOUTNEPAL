// config/db.js
import { MongoClient, ServerApiVersion } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const client = new MongoClient(process.env.MONGO_URI, {
  serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true },
});

export async function connectDB() {
  try {
    await client.connect();
    console.log("✅ Connected to MongoDB Atlas (native driver)");
    const db = client.db("auth_demo");
    return {
      usersCollection: db.collection("users"),
      heritageCollection: db.collection("heritage_sites"),
      festivalCollection: db.collection("festivals"),
      subscribersCollection: db.collection("subscribers"),
      placesCollection: db.collection("places"), // add places here
    };
  } catch (err) {
    console.error("❌ MongoDB native driver connection error:", err);
    process.exit(1);
  }
}
