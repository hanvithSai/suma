const MCQ = require("../models/MCQ");

exports.createMCQ = async (req, res) => {
  try {
    let { roomId, question, options, correctAnswer } = req.body;

    // ✅ Input Validation
    if (!roomId || !question || !options || correctAnswer === undefined) {
      return res.status(400).json({ message: "All fields are required" });
    }
    
    if (!Array.isArray(options) || options.length < 2) {
      return res.status(400).json({ message: "At least two options are required" });
    }

    correctAnswer = parseInt(correctAnswer);
    if (isNaN(correctAnswer) || correctAnswer < 0 || correctAnswer >= options.length) {
      return res.status(400).json({ message: "Invalid correctAnswer index" });
    }

    // ✅ Create and Save MCQ
    const newMCQ = new MCQ({ room: roomId, question, options, correctAnswer });
    await newMCQ.save();

    res.status(201).json({ message: "MCQ created successfully", data: newMCQ });
  } catch (err) {
    console.error("🔥 Error creating MCQ:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.answerMCQ = async (req, res) => {
  try {
    const mcqId = req.params.id; // ✅ Extract mcqId from URL params
    const { answer } = req.body; // ✅ Only 'answer' comes from request body

    // ✅ Input Validation
    if (answer === undefined) {
      return res.status(400).json({ message: "Answer field is required" });
    }

    const mcq = await MCQ.findById(mcqId);
    if (!mcq) {
      return res.status(404).json({ message: "MCQ not found" });
    }

    const answerIndex = parseInt(answer);
    if (isNaN(answerIndex) || answerIndex < 0 || answerIndex >= mcq.options.length) {
      return res.status(400).json({ message: "Invalid answer index" });
    }

    // ✅ Check if the user already answered (Assuming user ID is available from JWT)
    const userId = req.user.id; // Assuming you added user info from the auth middleware
    const alreadyAnswered = mcq.responses.some(resp => resp.user.toString() === userId);
    if (alreadyAnswered) {
      return res.status(400).json({ message: "User already answered this MCQ" });
    }

    // ✅ Atomic Update (Push response without fetching the full document)
    await MCQ.findByIdAndUpdate(mcqId, {
      $push: { responses: { user: userId, answer: answerIndex } }
    });

    res.status(200).json({ message: "Answer submitted successfully" });
  } catch (err) {
    console.error("🔥 Error answering MCQ:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
