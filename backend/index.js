// i used for creating this backend using the 
// multer package for file upload and express for server handling 

const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Serve uploaded files statically
app.use('/uploads', express.static('uploads'));

// File storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage });

// Upload file section
app.post('/upload', upload.single('file'), (req, res) => {
  res.json({ message: 'File uploaded successfully', filename: req.file.originalname });
});

// Delete file section
app.delete('/delete/:filename', (req, res) => {
  const filePath = path.join(__dirname, 'uploads', req.params.filename);
  fs.unlink(filePath, (err) => {
    if (err) return res.status(404).json({ message: 'File not found' });
    res.json({ message: 'File deleted successfully' });
  });
});

// List files section 
app.get('/files', (req, res) => {
  const uploadDir = path.join(__dirname, 'uploads');
  fs.readdir(uploadDir, (err, files) => {
    if (err) return res.status(500).json({ message: 'Failed to read files' });
    res.json(files);
  });
});

// View file section
app.get('/files/:filename', (req, res) => {
  const filePath = path.join(__dirname, 'uploads', req.params.filename);
  if (!fs.existsSync(filePath)) return res.status(404).json({ message: 'File not found' });
  res.sendFile(filePath);
});

// Download file section
app.get('/download/:filename', (req, res) => {
  const filePath = path.join(__dirname, 'uploads', req.params.filename);
  if (!fs.existsSync(filePath)) return res.status(404).json({ message: 'File not found' });
  res.download(filePath);
});
// host section 
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
