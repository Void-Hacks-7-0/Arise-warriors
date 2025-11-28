const mongoose = require("mongoose");

const BudgetSchema = new mongoose.Schema(
{
  budgetId: { type: String, required: true, unique: true },
  userId: { type: String, required: true },

  category: { type: String, required: true },
  budgetLimit: Number,
  currency: { type: String, default: "INR" },
  period: { type: String, enum: ["weekly", "monthly", "yearly"] },

  startDate: Date,
  endDate: Date,

  currentSpending: { type: Number, default: 0 },
  percentageUsed: { type: Number, default: 0 },
  alertThreshold: { type: Number, default: 80 },
  isAlert: { type: Boolean, default: false },

  notes: String,

  history: [
    {
      month: String,
      spentAmount: Number,
      status: String // "exceeded", "within_limit"
    }
  ]
},
{ timestamps: true }
);

// Indexes
BudgetSchema.index({ userId: 1, category: 1 });
BudgetSchema.index({ period: 1, endDate: 1 });

module.exports = mongoose.model("Budget", BudgetSchema);
