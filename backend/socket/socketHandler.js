const Message = require("../models/Message");
const Room = require("../models/Room");
const User = require("../models/User");

function socketHandler(io) {
  io.on("connection", (socket) => {
    console.log("✅ A user connected:", socket.id);

    // ✅ Join Room
    socket.on("joinRoom", async ({ roomCode, email, nickname }) => {
      try {
        const room = await Room.findOne({ roomCode });
        if (!room) return socket.emit("errorMessage", "Room not found.");

        const user = await User.findOne({ email });
        if (!user) return socket.emit("errorMessage", "User not found.");

        const isUserInRoom = room.users.some(
          (u) => u.userId.toString() === user._id.toString()
        );

        if (!isUserInRoom) {
          room.users.push({ userId: user._id, nickname });
          await room.save();

          user.roomsJoined.push(room._id);
          await user.save();
        }

        socket.join(room.roomCode);
        socket.emit("joinedRoom", { roomCode: room.roomCode, nickname });
        console.log(`✅ ${email} joined room '${room.roomCode}'`);

        // ✅ Send previous messages
        const previousMessages = await Message.find({ room: room.roomCode }) // string-based match
          .sort({ timestamp: 1 })
          .populate("sender", "nickname");

        const formattedMessages = previousMessages.map((msg) => ({
          content: msg.content,
          nickname: msg.sender?.nickname || "Unknown",
          timestamp: msg.timestamp,
        }));

        socket.emit("previousMessages", formattedMessages);
      } catch (err) {
        console.error("❌ joinRoom error:", err);
        socket.emit("errorMessage", "Failed to join room.");
      }
    });

    // ✅ Send Message
    socket.on("sendMessage", async ({ roomCode, email, content }) => {
      try {
        const room = await Room.findOne({ roomCode });
        const user = await User.findOne({ email });

        if (!room || !user) return;

        const nickname = room.users.find(
          (u) => u.userId.toString() === user._id.toString()
        )?.nickname || "User";

        const newMessage = new Message({
          content,
          room: room.roomCode, // match your schema (String UUID)
          sender: user._id,
          timestamp: new Date(),
        });

        await newMessage.save();

        io.to(roomCode).emit("receiveMessage", {
          content,
          nickname,
          timestamp: newMessage.timestamp,
        });
      } catch (err) {
        console.error("❌ sendMessage error:", err);
        socket.emit("errorMessage", "Failed to send message.");
      }
    });
  });
}

module.exports = socketHandler;
