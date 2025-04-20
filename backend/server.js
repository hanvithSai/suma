// backend/server.js
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const mcqRoutes = require("./routes/mcqRoutes");
const pollRoutes = require("./routes/pollRoutes");
const passport = require("passport");
require("./auth/googleAuth");

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Update for production
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.use(passport.initialize());
app.use(passport.session());
app.use("/auth", authRoutes);


// Routes
const roomRoutes = require("./routes/roomRoutes");
const messageRoutes = require("./routes/messageRoutes");
app.use("/api/rooms", roomRoutes);
app.use("/api/messages", messageRoutes);
app.use("/auth", authRoutes);
app.use("/api/mcqs", mcqRoutes);
app.use("/api/polls", pollRoutes);


// Connect Socket.io
const socketHandler = require("./socket/socketHandler");
socketHandler(io);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB Connected"))
.catch((err) => console.error("MongoDB Error:", err));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
