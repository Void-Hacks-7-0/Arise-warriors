const axios = require("axios");
const admin = require("../config/firebase");
const User = require("../models/User");
const { signJwt } = require("../utils/jwt");

const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY;

exports.register = async (req, res, next) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    // Create Firebase user
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: `${firstName} ${lastName}`
    });

    // Create MongoDB user
    const user = await User.create({
      userId: userRecord.uid,
      email: userRecord.email,
      firstName,
      lastName
    });

    // Create JWT
    const token = signJwt({ userId: user.userId, email: user.email });

    res.json({ success: true, user, token });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Firebase REST login (get idToken)
    const resp = await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`,
      { email, password, returnSecureToken: true }
    );

    const idToken = resp.data.idToken;

    // Verify token
    const decoded = await admin.auth().verifyIdToken(idToken);

    // Create local user if doesn’t exist
    let user = await User.findOne({ userId: decoded.uid });
    if (!user) {
      user = await User.create({
        userId: decoded.uid,
        email: decoded.email,
        firstName: decoded.name || ""
      });
    }

    // Create JWT
    const token = signJwt({ userId: user.userId, email: user.email });

    res.json({ success: true, user, token });
  } catch (err) {
    next(err);
  }
};
