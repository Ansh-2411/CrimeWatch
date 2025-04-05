const { Router } = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const router = Router();

// Define and ensure upload directory exists
const uploadDir = path.join(__dirname, "uploads/audio"); // If uploads is in same directory
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Set up multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // Use the same uploadDir as defined
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Initialize multer with error handling
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  }),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("audio/")) {
      cb(null, true);
    } else {
      cb(new Error("Only audio files are allowed!"), false);
    }
  },
});

// Middleware to log incoming request details
router.post("/upload", (req, res, next) => {
  console.log("Incoming request headers:", req.headers);
  console.log("Incoming request body size:", req.headers["content-length"]);
  next();
}, upload.single("audioFile"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }
    console.log("File uploaded successfully:", req.file);
    return res.status(200).json({ success: true, file: req.file });
  } catch (error) {
    console.error("Upload handler error:", error.stack);
    return res.status(500).json({ success: false, message: `Server error: ${error.message}` });
  }
});

router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError || err.message === "Unexpected end of form") {
    console.error("Multer error:", err.stack);
    return res.status(400).json({ success: false, message: `Upload error: ${err.message}` });
  }
  next(err);
});

// Get Audio File Route
router.get("/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(uploadDir, filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ success: false, message: "File not found" });
  }

  res.sendFile(filePath);
});

module.exports = router;