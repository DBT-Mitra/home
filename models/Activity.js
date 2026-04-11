const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  type: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    required: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  participants: {
    type: Number,
    required: true,
    min: 1
  },
  description: {
    type: String,
    required: true,
    trim: true
  }
});

module.exports = mongoose.model("Activity", activitySchema);
