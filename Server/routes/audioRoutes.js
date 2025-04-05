// routes/audioRoutes.js
const { Router } = require("express");
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = Router();

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads/audio');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Set up multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Create a safe filename with original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname) || '.mp3'; // Default to .mp3 if no extension
    cb(null, 'audio-' + uniqueSuffix + ext);
  }
});

// Initialize multer with the storage configuration and error handling
const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: (req, file, cb) => {
    // Accept all audio files and check more thoroughly later if needed
    if (file.mimetype.startsWith('audio/') || file.originalname.match(/\.(mp3|wav|ogg|m4a)$/)) {
      cb(null, true);
    } else {
      cb(new Error('Only audio files are allowed!'), false);
    }
  }
}).single('audioFile'); // The field name must match what's sent from the client

// Enhanced error handling for multer uploads
router.post('/upload', (req, res) => {
  upload(req, res, function(err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading
      console.error('Multer error:', err);
      return res.status(500).json({
        success: false,
        message: `Upload error: ${err.message}`
      });
    } else if (err) {
      // An unknown error occurred
      console.error('Unknown upload error:', err);
      return res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`
      });
    }
    
    // Everything went fine
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file was uploaded'
      });
    }
    
    // Log successful upload
    console.log('File uploaded successfully:', req.file);
    
    // Return success response with file details
    return res.status(200).json({
      success: true,
      file: {
        filename: req.file.filename,
        path: req.file.path,
        size: req.file.size,
        mimetype: req.file.mimetype
      }
    });
  });
});

// Optional: Get audio file by filename
router.get('/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(uploadDir, filename);
  
  // Check if file exists
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({
      success: false,
      message: 'File not found'
    });
  }
  
  // Send the file
  res.sendFile(filePath);
});

module.exports = router;