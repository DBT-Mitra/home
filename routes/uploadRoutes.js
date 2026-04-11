const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const Report = require("../models/Report");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const extension = path.extname(file.originalname);
    const safeName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`;
    cb(null, safeName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "video/mp4",
      "video/quicktime",
      "video/webm"
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPG, PNG, WEBP, MP4, MOV, and WEBM files are allowed."));
    }
  }
});

router.post("/upload", protect, upload.single("reportFile"), async (req, res) => {
  try {
    const { title } = req.body;

    if (!title || !req.file) {
      return res.status(400).json({ message: "Title and file are required." });
    }

    const report = await Report.create({
      userId: req.user._id,
      title,
      filePath: `/uploads/${req.file.filename}`
    });

    return res.status(201).json({
      message: "Report uploaded successfully.",
      report
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Unable to upload report." });
  }
});

module.exports = router;
