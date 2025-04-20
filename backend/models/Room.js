const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  roomId: { type: String, required: true, unique: true }, // UUID
  name: { type: String, required: true, unique: true },
  roomCode: { type: String, required: true, unique: true }, // ✅ Short code for easy access
  host: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },

  users: [{ 
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    nickname: { type: String, required: true }
  }],

  messages: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Message" 
  }],

  mcqs: [{ type: mongoose.Schema.Types.ObjectId, ref: "MCQ" }],
  polls: [{ type: mongoose.Schema.Types.ObjectId, ref: "Poll" }],

  status: { type: String, enum: ["active", "ended"], default: "active" },
  endedAt: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now }
});

const Room = mongoose.model("Room", roomSchema);
module.exports = Room;
