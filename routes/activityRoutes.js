const express = require("express");

const Activity = require("../models/Activity");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/activity", protect, async (req, res) => {
  try {
    const { type, date, location, participants, description } = req.body;

    if (!type || !date || !location || !participants || !description) {
      return res.status(400).json({ message: "All activity fields are required." });
    }

    const activity = await Activity.create({
      userId: req.user._id,
      type,
      date,
      location,
      participants,
      description
    });

    return res.status(201).json({
      message: "Activity logged successfully.",
      activity
    });
  } catch (_error) {
    return res.status(500).json({ message: "Unable to save activity." });
  }
});

module.exports = router;
