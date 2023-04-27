const express = require('express');
const app = express();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Set up multer upload function
const upload = multer({ storage }).single('file');

// Define route for file upload
app.post('/upload', (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send(err);
    }

    // Read file data
    const filePath = path.join(__dirname, req.file.path);
    const fileData = fs.readFileSync(filePath);

    // Convert file data to base64
    const base64Data = Buffer.from(fileData).toString('base64');
    // Send base64-encoded file data back to client
    res.send({ fileData: base64Data });
  });
});

// Start server
app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
