import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  fullname: { type: String },
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  verified: { type: Boolean, default: false },
  role: { type: String, default: "user" },
  photo: { type: String }, // Add this line
  quizStats: {
    totalQuizzes: { type: Number, default: 0 },
    highestScore: { type: Number, default: 0 },
    categoriesPlayed: { type: [String], default: [] }
  }
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);
export default User;
