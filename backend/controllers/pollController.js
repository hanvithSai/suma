const Poll = require("../models/Poll");

exports.createPoll = async (req, res) => {
  try {
    const { roomId, question, options } = req.body;

    const newPoll = new Poll({
      room: roomId,
      question,
      options,
    });

    await newPoll.save();
    res.status(201).json({ message: "Poll created", data: newPoll });
  } catch (err) {
    console.error("🔥 Error creating poll:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.answerPoll = async (req, res) => {
  try {
    // Ensure the user is authenticated
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: Please log in" });
    }

    const pollId = req.params.id; // pollId comes from the URL
    const { selectedIndex } = req.body;

    // Get the poll by ID
    const poll = await Poll.findById(pollId);
    if (!poll) {
      return res.status(404).json({ message: "Poll not found" });
    }

    // Validate selectedIndex
    if (selectedIndex < 0 || selectedIndex >= poll.options.length) {
      return res.status(400).json({ message: "Invalid option index" });
    }

    // Check if the user has already answered this poll
    const userId = req.user.id; // User ID is available after authentication via the middleware
    const alreadyAnswered = poll.responses.some(resp => resp.user.toString() === userId);
    if (alreadyAnswered) {
      return res.status(400).json({ message: "User already answered this poll" });
    }

    // Push response to the poll
    const selectedOption = poll.options[selectedIndex]; // Get the option based on the selected index
    poll.responses.push({ user: userId, choice: selectedOption });
    await poll.save();

    res.status(200).json({ message: "Poll response submitted" });
  } catch (err) {
    console.error("🔥 Error answering poll:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
