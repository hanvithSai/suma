const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  googleId: { type: String, required: true, unique: true },   // Google OAuth ID
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  profilePic: { type: String },                              // Google profile picture

  // Rooms the user has joined
  roomsJoined: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Room" 
  }],

  // Rooms the user has created (host)
  roomsCreated: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Room" 
  }],

  // Rooms where the user is restricted
  restrictedInRooms: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Room" 
  }],

  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model("User", userSchema);
module.exports = User;
