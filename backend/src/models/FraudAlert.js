const mongoose = require("mongoose");

const FraudAlertSchema = new mongoose.Schema(
{
  alertId: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  transactionId: { type: String, required: true },

  alertType: {
    type: String,
    enum: [
      "unusual_amount",
      "unusual_time",
      "frequency_spike",
      "location_mismatch"
    ]
  },

  severity: { type: String, enum: ["low", "medium", "high"] },
  description: String,
  anomalyScore: Number,

  detectedAt: Date,
  acknowledgedAt: Date,

  status: {
    type: String,
    enum: [
      "unresolved",
      "verified_legitimate",
      "marked_fraud",
      "under_review"
    ],
    default: "unresolved"
  },

  userResponse: String
},
{ timestamps: true }
);

// Indexes
FraudAlertSchema.index({ userId: 1, createdAt: -1 });
FraudAlertSchema.index({ status: 1, severity: 1 });

module.exports = mongoose.model("FraudAlert", FraudAlertSchema);
