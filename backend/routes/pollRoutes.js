const express = require("express");
const router = express.Router();
const pollController = require("../controllers/pollController");
const authenticate = require("../auth/authMiddleware"); // 👈 import auth

// Create a poll
router.post("/create", authenticate, pollController.createPoll);

// Answer a poll
router.post("/:id/response", authenticate, pollController.answerPoll);

module.exports = router;