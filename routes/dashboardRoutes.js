const express = require("express");

const Activity = require("../models/Activity");
const Report = require("../models/Report");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

function generateSessionDates() {
  const today = new Date();

  return [7, 15, 23].map((offset, index) => {
    const sessionDate = new Date(today);
    sessionDate.setDate(today.getDate() + offset);

    return {
      id: `session-${index + 1}`,
      title: ["Campus Awareness Drive", "Faculty SPOC Briefing", "Scholarship Help Desk"][index],
      date: sessionDate.toISOString(),
      venue: ["Main Auditorium", "Seminar Hall B", "Innovation Lab"][index]
    };
  });
}

router.get("/dashboard", protect, async (req, res) => {
  try {
    const [activities, reports] = await Promise.all([
      Activity.find({ userId: req.user._id }).sort({ date: -1, _id: -1 }).limit(10),
      Report.find({ userId: req.user._id }).sort({ createdAt: -1, _id: -1 }).limit(10)
    ]);

    res.json({
      user: req.user,
      sessionDates: generateSessionDates(),
      stats: {
        activitiesLogged: activities.length,
        reportsUploaded: reports.length,
        totalParticipants: activities.reduce((sum, item) => sum + item.participants, 0)
      },
      activities,
      reports
    });
  } catch (_error) {
    res.status(500).json({ message: "Unable to load dashboard data." });
  }
});

module.exports = router;
