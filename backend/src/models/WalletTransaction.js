const mongoose = require("mongoose");

const WalletTransactionSchema = new mongoose.Schema(
{
  walletTxId: { type: String, required: true, unique: true },

  senderId: String,
  recipientId: String,

  amount: Number,
  currency: { type: String, default: "SECURECOIN" },

  description: String,

  blockchainHash: String,
  status: { type: String, enum: ["pending", "confirmed", "failed"], default: "pending" },

  exchangeRate: Number,
  feeAmount: Number,
  totalAmount: Number,

  confirmedAt: Date
},
{ timestamps: true }
);

module.exports = mongoose.model("WalletTransaction", WalletTransactionSchema);
