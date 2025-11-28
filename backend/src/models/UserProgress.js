const mongoose = require("mongoose");

const UserProgressSchema = new mongoose.Schema(
{
  userId: { type: String, required: true },
  moduleId: { type: String, required: true },

  status: { type: String, enum: ["started", "in_progress", "completed"] },

  completedAt: Date,
  quizScore: Number,
  timeSpent: Number,
  certificateUrl: String
},
{ timestamps: true }
);

module.exports = mongoose.model("UserProgress", UserProgressSchema);
