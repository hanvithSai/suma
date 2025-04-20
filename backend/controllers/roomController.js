const Room = require("../models/Room");
const { v4: uuidv4 } = require("uuid");

// 🔧 Utility: Generate a random nickname
const generateRandomNickname = () => {
  const adjectives = ["Cool", "Brave", "Happy", "Witty", "Swift"];
  const animals = ["Tiger", "Panda", "Eagle", "Fox", "Shark"];
  return `${adjectives[Math.floor(Math.random() * adjectives.length)]}${animals[Math.floor(Math.random() * animals.length)]}${Math.floor(Math.random() * 1000)}`;
};

// 🔧 Utility: Generate a 6-character room code
const generateRoomCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase(); // e.g. "A1B2C3"
};

// ✅ Create a new room
exports.createRoom = async (req, res) => {
  try {
    const roomId = uuidv4(); // ✅ Generate UUID
    const roomCode = generateRoomCode(); // ✅ Generate roomCode
    const { name } = req.body;
    const hostId = req.user.id; // 👤 Host from JWT

    if (!name) return res.status(400).json({ message: "Room name is required" });

    // Check if room code already exists
    const codeExists = await Room.findOne({ roomCode });
    if (codeExists) {
      return res.status(500).json({ message: "Room code conflict. Please try again." });
    }
    console.log("🔐 Generated Room Code:", roomCode);
    const newRoom = new Room({
      roomId,
      roomCode, // ✅ Store the short code
      name,
      host: hostId,
      users: [{ userId: hostId, nickname: generateRandomNickname() }],
      messages: [],
      mcqs: [],
      polls: [],
      status: "active",
    });

    await newRoom.save();

    res.status(201).json({ message: "Room created successfully", roomId, roomCode });
  } catch (error) {
    console.error("🔥 Error creating room:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ Get room details with nicknames
exports.getRoomById = async (req, res) => {
  try {
    const { roomId } = req.params;

    const room = await Room.findOne({ roomId })
      .populate("host", "name email")
      .populate("users.userId", "email");

    if (!room) return res.status(404).json({ message: "Room not found" });

    const users = room.users.map((u) => ({
      email: u.userId?.email || "Unknown",
      nickname: u.nickname,
    }));

    res.status(200).json({
      roomId: room.roomId,
      roomCode: room.roomCode, // ✅ Include code in response
      name: room.name,
      hostName: room.host.name,
      users,
      status: room.status,
    });
  } catch (error) {
    console.error("🔥 Error fetching room:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
