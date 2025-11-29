const axios = require("axios");
const admin = require("../config/firebase");
const User = require("../models/User");
const { signJwt } = require("../utils/jwt");

const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY;

// Helper: format user object frontend-friendly
const formatUser = (user) => ({
  _id: user._id,
  userId: user.userId,
  email: user.email,
  firstName: user.firstName,
  lastName: user.lastName,
  name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
  preferredLanguage: user.preferredLanguage,
  accountStatus: user.accountStatus,
  kycVerified: user.kycVerified,
  riskProfile: user.riskProfile,
  settings: user.settings,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt
});

/* ----------------------------
   REGISTER CONTROLLER
---------------------------- */
exports.register = async (req, res, next) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    // 1. Create Firebase User
    const userRecord = await admin.auth().createUser({
      email,
      password
    });

    // 2. Create user in MongoDB
    const user = await User.create({
      userId: userRecord.uid,
      email: userRecord.email,
      firstName,
      lastName
    });

    // 3. Generate JWT
    const token = signJwt({
      userId: user.userId,
      email: user.email
    });

    return res.json({
      success: true,
      user: formatUser(user),
      token
    });

  } catch (err) {
    next(err);
  }
};

/* ----------------------------
   LOGIN CONTROLLER
---------------------------- */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1. Login using Firebase REST API
    const resp = await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`,
      { email, password, returnSecureToken: true }
    );

    const idToken = resp.data.idToken;

    // 2. Decode Firebase token
    const decoded = await admin.auth().verifyIdToken(idToken);

    // 3. Ensure user exists in MongoDB
    let user = await User.findOne({ userId: decoded.uid });

    if (!user) {
      user = await User.create({
        userId: decoded.uid,
        email: decoded.email,
        firstName: "",
        lastName: ""
      });
    }

    // 4. Generate local JWT
    const token = signJwt({
      userId: user.userId,
      email: user.email
    });

    return res.json({
      success: true,
      user: formatUser(user),
      token
    });

  } catch (err) {
    next(err);
  }
};
