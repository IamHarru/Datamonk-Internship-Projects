// Load environment variables
require('dotenv').config();

const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const express = require('express');
const fs = require('fs'); // still used for download fallback
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 5000;
const db = require('./sqlite.js');

app.use(cors());
app.use(express.json());

// ✅ Set up S3 client using .env
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// ✅ Set up Multer with S3 storage
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET,
    // acl: 'public-read', // or 'private'
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      cb(null, file.originalname); // You can add timestamp for uniqueness
    },
  }),
});

// ✅ Upload file to S3 and save metadata to DB
app.post('/upload', upload.single('file'), (req, res) => {
  const { originalname, size, mimetype } = req.file;

  db.run(
    'INSERT INTO files (name, size, mimetype) VALUES (?, ?, ?)',
    [originalname, size, mimetype],
    function (err) {
      if (err) return res.status(500).json({ message: 'DB insert error' });
      res.json({ message: 'File uploaded to S3 and metadata stored', id: this.lastID });
    }
  );
});

// ✅ Delete file from S3 and DB
app.delete('/delete/:filename', (req, res) => {
  const filename = req.params.filename;

  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: filename,
  };

  s3.deleteObject(params, (err, data) => {
    if (err) return res.status(500).json({ message: 'Error deleting from S3', error: err });

    db.run('DELETE FROM files WHERE name = ?', [filename], (dbErr) => {
      if (dbErr) return res.status(500).json({ message: 'File deleted from S3, but DB error' });
      res.json({ message: 'File and metadata deleted successfully from S3' });
    });
  });
});

// ✅ List files from SQLite DB
app.get('/dbfiles', (req, res) => {
  db.all('SELECT * FROM files ORDER BY id DESC', (err, rows) => {
    if (err) return res.status(500).json({ message: 'Failed to fetch from database' });
    res.json(rows);
  });
});

// ✅ Download file from S3 via signed URL
app.get('/download/:filename', (req, res) => {
  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: req.params.filename,
    Expires: 60, // 60 seconds temporary URL
  };

  s3.getSignedUrl('getObject', params, (err, url) => {
    if (err) return res.status(500).json({ message: 'Error generating download link' });
    res.redirect(url);
  });
});

// ✅ Serve frontend
app.use(express.static(path.join(__dirname, '../frontend')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/drive_first.html'));
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
