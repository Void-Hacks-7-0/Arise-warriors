const mongoose = require("mongoose");

const FinancialLiteracySchema = new mongoose.Schema(
{
  moduleId: { type: String, required: true, unique: true },
  title: String,
  description: String,

  category: {
    type: String,
    enum: ["budgeting", "saving", "investment", "debt_management"]
  },

  difficulty: { type: String, enum: ["beginner", "intermediate", "advanced"] },

  content: {
    text: String,
    videoUrl: String,
    infographics: [String]
  },

  quiz: [
    {
      questionId: String,
      question: String,
      options: [String],
      correctAnswer: String,
      explanation: String
    }
  ],

  tips: [
    {
      context: String,

      
      tip: String
    }
  ],

  completionTime: Number,
  language: { type: String, default: "en" }
},
{ timestamps: true }
);

module.exports = mongoose.model("FinancialLiteracy", FinancialLiteracySchema);
