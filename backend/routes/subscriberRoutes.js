import express from "express";
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    const existing = await req.db.subscribersCollection.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already subscribed" });
    }

    await req.db.subscribersCollection.insertOne({ name, email, createdAt: new Date() });

    res.status(201).json({ message: "Subscribed successfully!" });
  } catch (error) {
    console.error("Subscriber route error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
