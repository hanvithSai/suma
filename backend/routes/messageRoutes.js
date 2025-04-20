const express = require("express");
const router = express.Router();
const { sendMessage, getMessages } = require("../controllers/messageController");
const authMiddleware = require("../auth/authMiddleware");

// ✅ Ensure authentication for all message routes
router.post("/send", authMiddleware, sendMessage);
router.get("/:roomId", authMiddleware, getMessages);

module.exports = router;
