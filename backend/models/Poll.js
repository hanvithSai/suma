const mongoose = require("mongoose");

const pollSchema = new mongoose.Schema({
  room: { 
    type: String,  // If you're using UUIDs for rooms, this will work
    required: true 
  },

  question: { type: String, required: true },
  options: [{ type: String, required: true }],

  // Responses with user details
  responses: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,  // Keep this as ObjectId for referencing users
      ref: "User"
    },
    choice: { type: String, required: true }
  }],

  createdAt: { type: Date, default: Date.now }
});

const Poll = mongoose.model("Poll", pollSchema);
module.exports = Poll;
