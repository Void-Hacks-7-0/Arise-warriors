const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema(
{
  transactionId: { type: String, required: true, unique: true },
  userId: { type: String, required: true },

  type: { type: String, enum: ["income", "expense", "transfer"], required: true },
  category: String,
  amount: Number,
  currency: { type: String, default: "INR" },
  description: String,

  sourceAccount: String,
  destinationAccount: String,
  paymentMethod: {
    type: String,
    enum: ["bank_transfer", "upi", "crypto", "wallet"]
  },

  tags: [String],
  notes: String,
  attachments: [String],

  fraudFlag: { type: Boolean, default: false },
  fraudReason: String,
  anomalyScore: Number,

  blockchainHash: String,
  blockchainConfirmed: { type: Boolean, default: false },

  status: {
    type: String,
    enum: ["pending", "confirmed", "failed", "reversed"],
    default: "confirmed"
  },

  metadata: {
    location: String,
    deviceId: String,
    ipAddress: String
  }
},
{ timestamps: true }
);

// Indexes
TransactionSchema.index({ userId: 1, createdAt: -1 });
TransactionSchema.index({ transactionId: 1 }, { unique: true });
TransactionSchema.index({ blockchainHash: 1 });
TransactionSchema.index({ fraudFlag: 1, userId: 1 });

module.exports = mongoose.model("Transaction", TransactionSchema);
