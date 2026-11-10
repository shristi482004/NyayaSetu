const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const config = require('../config/env');

// Ensure upload directory exists
if (!fs.existsSync(config.uploadDir)) {
  fs.mkdirSync(config.uploadDir, { recursive: true });
}

// Disk storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, config.uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeName = `${uuidv4()}${ext}`;
    cb(null, safeName);
  }
});

// File filter checking MIME type and extension
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (file.mimetype !== 'application/pdf' || ext !== '.pdf') {
    const error = new Error('Invalid file format. Only PDF documents (.pdf) are permitted.');
    error.statusCode = 400;
    return cb(error, false);
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: config.maxFileSizeBytes // 25MB
  }
});

/**
 * Middleware to verify PDF magic bytes (%PDF-) after file is written to disk.
 */
const verifyPdfHeader = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      error: 'Bad Request',
      message: 'No file uploaded. Please supply a PDF file under the "file" form-data field.'
    });
  }

  const filePath = req.file.path;
  try {
    const buffer = Buffer.alloc(5);
    const fd = fs.openSync(filePath, 'r');
    fs.readSync(fd, buffer, 0, 5, 0);
    fs.closeSync(fd);

    const header = buffer.toString('utf-8');
    if (!header.startsWith('%PDF-')) {
      // Remove invalid file from disk
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      return res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'The uploaded file is not a valid PDF document (missing %PDF- header).'
      });
    }

    next();
  } catch (err) {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    return res.status(500).json({
      success: false,
      error: 'File Verification Error',
      message: `Failed to verify uploaded file header: ${err.message}`
    });
  }
};

module.exports = { upload, verifyPdfHeader };

