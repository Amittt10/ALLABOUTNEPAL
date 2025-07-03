import mongoose from 'mongoose';

const quizQuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: { type: [String], required: true },
  correctAnswerIndex: { type: Number, required: true },
  category: { type: String, required: true },
  difficulty: { type: String, default: 'easy' },
  explanation: { type: String },
});

export default mongoose.model('QuizQuestion', quizQuestionSchema);
