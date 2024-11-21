const express = require('express');
const cors = require('cors');
const multer = require('multer'); // For handling file uploads
const pdfController = require('./controllers/pdfController');
const audioController = require('./controllers/audioController');

const app = express();
app.use(cors());

// Set up file upload handling with multer
const upload = multer({ dest: 'uploads/' }); // Destination folder for uploaded files

// Handle PDF upload
app.post('/upload-pdf', upload.single('file'), pdfController.uploadPDF);

module.exports = app;
