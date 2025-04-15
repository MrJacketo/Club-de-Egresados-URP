const admin = require("firebase-admin");
const User = require("../models/User"); // MongoDB User model

// Middleware to verify Firebase token and sync with MongoDB
const verifyFirebaseToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token from Authorization header

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    // Verify Firebase token
    const decodedToken = await admin.auth().verifyIdToken(token);
    const { uid, email, name, picture } = decodedToken;

    // Check if user exists in MongoDB
    let user = await User.findOne({ firebaseUid: uid });

    if (!user) {
      // If user does not exist, create a new user in MongoDB
      user = new User({
        firebaseUid: uid,
        email,
        name: name || "Anonymous",
        profilePicture: picture || "",
      });
      await user.save();
    }

    // Attach user to the request object
    req.user = user;
    next();
  } catch (error) {
    console.error("Error verifying Firebase token:", error);
    res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = verifyFirebaseToken;