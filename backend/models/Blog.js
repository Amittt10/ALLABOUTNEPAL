import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  snippet: { type: String, required: true },
  content: { type: String, required: true },
  thumbnail: { type: String }, // main thumbnail
  gallery: [{ type: String }], // array of image URLs for gallery
  category: { type: String },
  createdAt: { type: Date, default: Date.now },
});


export default mongoose.model("Blog", blogSchema);
