privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")

const admin = require("firebase-admin");

if (!process.env.FIREBASE_PRIVATE_KEY) {
  throw new Error("Firebase private key missing in env!");
}

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  }),
});

module.exports = admin;
