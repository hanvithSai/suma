const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  room: { 
    type: String,  // ✅ Store `roomId` as String (UUID)
    required: true 
  },
  
  sender: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true
  },

  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;
