const multer = require('multer');
const path = require('path');

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Set the destination folder
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// File filter to allow only certain file types
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'application/pdf',  // PDF files
    'application/vnd.ms-powerpoint', // PPT files
    'application/vnd.openxmlformats-officedocument.presentationml.presentation', // PPTX files
    'application/msword', // DOC files
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document' // DOCX files
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, PPT, and DOC files are allowed.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter
});

module.exports = upload;
