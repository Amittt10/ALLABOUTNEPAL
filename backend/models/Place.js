import mongoose from "mongoose";

const placeSchema = new mongoose.Schema({
  title_en: { type: String, required: true },
  title_np: { type: String, required: true },
  description_en: { type: String, default: "" },
  description_np: { type: String, default: "" },
  category: {
    type: String,
    enum: ["unesco", "province", "pilgrims"],
    required: true,
  },
  thumbnail: { type: String },
  video_url: { type: String },
  video_file: { type: String },
  images: [{ type: String }],
  location: {
    lat: { type: Number },
    lng: { type: Number },
  },
  createdAt: { type: Date, default: Date.now },
});

const Place = mongoose.model("Place", placeSchema);
export default Place;
