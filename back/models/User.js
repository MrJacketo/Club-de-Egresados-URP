const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firebaseUid: { type: String, required: true, unique: true }, // Firebase UID
  email: { type: String, required: true },
  name: { type: String, default: "Anonymous" },
  profilePicture: { type: String, default: "" },
  activo: {type:Boolean, default: true},
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);