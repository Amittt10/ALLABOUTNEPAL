import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  // Add this block for quiz progress tracking
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
