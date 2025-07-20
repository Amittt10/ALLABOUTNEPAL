import mongoose from "mongoose";
import slugify from "slugify";

const placeSchema = new mongoose.Schema({
  title_en: { type: String, required: true },
  title_np: { type: String, required: true },
  slug: { type: String, unique: true }, // ✅ Add this line
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

// Auto-generate slug before saving
placeSchema.pre("save", function (next) {
  if (!this.isModified("title_en")) return next();
  this.slug = slugify(this.title_en, { lower: true, strict: true });
  next();
});

const Place = mongoose.model("Place", placeSchema);
export default Place;
