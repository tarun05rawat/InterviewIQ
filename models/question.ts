import mongoose from 'mongoose'

const questionSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true,
  },
  tips: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

export const Question = mongoose.models.Question || mongoose.model('Question', questionSchema)