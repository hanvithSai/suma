const mongoose = require("mongoose");

const responseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  answer: {
    type: Number,
    required: true
  }
}, { timestamps: true });

const mcqSchema = new mongoose.Schema({
  room: {
    type: String,
    required: true
  },
  question: {
    type: String,
    required: true
  },
  options: {
    type: [String],
    required: true,
    validate: {
      validator: arr => arr.length >= 2,
      message: "At least two options are required"
    }
  },
  correctAnswer: {
    type: Number,
    required: true
  },
  responses: [responseSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("MCQ", mcqSchema);
