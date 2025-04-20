const Message = require("../models/Message");
const Room = require("../models/Room");

exports.sendMessage = async (req, res) => {
  try {
    const { roomId, content } = req.body;

    // ✅ Check if user is authenticated
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized: No user ID found" });
    }
    const userId = req.user.id;

    console.log("✅ User ID:", userId);
    console.log("✅ Room ID received:", roomId);

    // ✅ Ensure the room exists
    const room = await Room.findOne({ roomId });  
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // ✅ Ensure content is not empty
    if (!content || typeof content !== "string" || content.trim() === "") {
      return res.status(400).json({ message: "Message content is required" });
    }

    // ✅ Create new message with MongoDB ObjectId reference
    const newMessage = new Message({
      room: room._id, // 🔥 Store `room._id` (MongoDB ObjectId)
      sender: userId,
      content: content.trim(),
    });

    await newMessage.save();
    res.status(201).json({ message: "Message sent successfully", data: newMessage });
  } catch (error) {
    console.error("🔥 Error sending message:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { roomId } = req.params;

    // ✅ Ensure the room exists
    const room = await Room.findOne({ roomId });
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // ✅ Fetch messages by `room._id` and sort by timestamp
    const messages = await Message.find({ room: room._id })
      .populate("sender", "name")
      .sort({ timestamp: 1 }); // 🔥 Sort messages in ascending order

    res.status(200).json({ messages });
  } catch (error) {
    console.error("🔥 Error fetching messages:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
