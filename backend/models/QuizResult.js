import mongoose from 'mongoose';

const quizResultSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  score: { type: Number, required: true },
  correctAnswers: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  category: { type: String },
  difficulty: { type: String },
  timestamp: { type: Date, default: Date.now },
}, { timestamps: true }); // <-- add this


export default mongoose.model('QuizResult', quizResultSchema);
