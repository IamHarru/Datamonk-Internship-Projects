// i used for creating this backend using the 
// multer package for file upload and express for server handling 

const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 5000;
const db = require('./sqlite.js');
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
  const { originalname, size, mimetype } = req.file;

  db.run(
    'INSERT INTO files (name, size, mimetype) VALUES (?, ?, ?)',
    [originalname, size, mimetype],
    function (err) {
      if (err) return res.status(500).json({ message: 'DB insert error' });
      res.json({ message: 'File uploaded and metadata stored', id: this.lastID });
    }
  );
});


// Delete file section
app.delete('/delete/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'uploads', filename);

  fs.unlink(filePath, (err) => {
    if (err) return res.status(404).json({ message: 'File not found' });

    db.run('DELETE FROM files WHERE name = ?', [filename], (dbErr) => {
      if (dbErr) return res.status(500).json({ message: 'File deleted, but DB error' });
      res.json({ message: 'File and metadata deleted successfully' });
    });
  });
});

// List files section 


// View file section
app.get('/dbfiles', (req, res) => {
  db.all('SELECT * FROM files ORDER BY id DESC', (err, rows) => {

    if (err) {
      return res.status(500).json({ message: 'Failed to fetch from database' });
    }
    res.json(rows);
  });
});


// Download file section
app.get('/download/:filename', (req, res) => {
  const filePath = path.join(__dirname, 'uploads', req.params.filename);
  if (!fs.existsSync(filePath)) return res.status(404).json({ message: 'File not found' });
  res.download(filePath);
});
// Serve frontend
app.use(express.static(path.join(__dirname, '../frontend')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/drive_first.html'));
});
// host section 
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
