const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
{
  userId: { type: String, required: true, unique: true },
  email: {
  type: String,
  required: true,
  unique: true,
  trim: true,
  lowercase: true,
},

  firstName: String,
  lastName: String,
  mobileNumber: String,
  profilePicture: String,
  preferredLanguage: { type: String, default: "en" }, 
  accountStatus: {
    type: String,
    enum: ["active", "suspended", "archived"],
    default: "active"
  },
  kycVerified: { type: Boolean, default: false },
  riskProfile: { type: String, enum: ["low", "medium", "high"], default: "low" },
  blockchainWallet: String,

  settings: {
    twoFactorEnabled: { type: Boolean, default: false },
    notificationsEnabled: { type: Boolean, default: true },
    currencyPreference: { type: String, default: "INR" },
    timeZone: { type: String, default: "IST" }
  }
},
{ timestamps: true }
);

// Indexes
UserSchema.index({ blockchainWallet: 1 });

module.exports = mongoose.model("User", UserSchema);
