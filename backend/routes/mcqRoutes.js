const express = require("express");
const router = express.Router();
const { createMCQ, answerMCQ } = require("../controllers/mcqController");
const authMiddleware = require("../auth/authMiddleware");

// Create an MCQ
router.post("/", authMiddleware, createMCQ); // ✅ Changed endpoint from `/create` to `/`

// Answer an MCQ by ID
router.post("/:id/answer", authMiddleware, answerMCQ); // ✅ Include :id to capture the MCQ ID in the URL

module.exports = router;
