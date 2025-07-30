// sqlite.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, 'filedata.db'), (err) => {
  if (err) console.error('❌ DB connection error:', err.message);
  else console.log('📁 Connected to SQLite DB');
});

db.run(`
  CREATE TABLE IF NOT EXISTS files (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    size INTEGER,
    mimetype TEXT,
    uploaded_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`);

module.exports = db;
