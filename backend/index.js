require('dotenv').config();
const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const db = require('./sqlite.js');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET,
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      cb(null, file.originalname);
    },
  }),
});

app.post('/upload', upload.single('file'), (req, res) => {
  const { originalname, size, mimetype } = req.file;
  db.run(
    'INSERT INTO files (name, size, mimetype) VALUES (?, ?, ?)',
    [originalname, size, mimetype],
    function (err) {
      if (err) return res.status(500).json({ message: 'DB insert failed.' });
      res.json({ message: 'File uploaded to S3 and metadata stored.' });
    }
  );
});

app.delete('/delete/:filename', (req, res) => {
  const filename = req.params.filename;
  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: filename,
  };

  s3.deleteObject(params, (err) => {
    if (err) return res.status(500).json({ message: 'S3 delete failed.' });

    db.run('DELETE FROM files WHERE name = ?', [filename], (dbErr) => {
      if (dbErr) return res.status(500).json({ message: 'DB delete failed.' });
      res.json({ message: 'File and metadata deleted.' });
    });
  });
});

app.get('/dbfiles', (req, res) => {
  db.all('SELECT * FROM files ORDER BY id DESC', (err, rows) => {
    if (err) return res.status(500).json({ message: 'Failed to fetch files.' });
    res.json(rows);
  });
});

app.get('/download/:filename', (req, res) => {
  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: req.params.filename,
    Expires: 60,
  };

  s3.getSignedUrl('getObject', params, (err, url) => {
    if (err) return res.status(500).json({ message: 'Error generating URL.' });
    res.redirect(url);
  });
});

app.use(express.static(path.join(__dirname, '../frontend')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/drive_first.html'));
});

app.listen(PORT,'0.0.0.0', () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
