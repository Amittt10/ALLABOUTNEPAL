import { MongoClient, ServerApiVersion } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

let dbInstance = null;

export async function connectDB() {
  if (dbInstance) return dbInstance; // ✅ return cached instance if already connected

  const client = new MongoClient(process.env.MONGO_URI, {
    serverApi: { version: ServerApiVersion.v1, strict: false, deprecationErrors: true, apiStrict: false },
  });

  try {
    await client.connect();
    console.log("✅ Connected to MongoDB Atlas (native driver)");
    const db = client.db("auth_demo");

    // Get collections
    const usersCollection = db.collection("users");
    const heritageCollection = db.collection("heritage_sites");
    const festivalCollection = db.collection("festivals");
    const subscribersCollection = db.collection("subscribers");
    const placesCollection = db.collection("places");

    // Create text indexes on necessary fields for text search (run only once)
    await Promise.all([
      festivalCollection.createIndex({ name_en: "text", description: "text" }),
      heritageCollection.createIndex({ name_en: "text", description: "text" }),
      placesCollection.createIndex({ title_en: "text", description_en: "text" }),
    ]);
    console.log("✅ Text indexes created/ensured");

    dbInstance = {
      usersCollection,
      heritageCollection,
      festivalCollection,
      subscribersCollection,
      placesCollection,
    };

    return dbInstance;
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
}
