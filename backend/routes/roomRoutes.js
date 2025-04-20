const express = require("express");
const { createRoom, getRoomById } = require("../controllers/roomController");
const authMiddleware = require("../auth/authMiddleware");

const router = express.Router();

router.post("/create", authMiddleware, createRoom);
router.get("/:roomId", authMiddleware, getRoomById);

module.exports = router;
