/*
  database/database.js — SQLite Connection and Schema Setup
  
  CONCEPT — Database:
  A database is organized storage for your application's data.
  Without it, all posts would be lost when the server restarts.
  
  CONCEPT — SQLite:
  SQLite stores your entire database in a single file (blog.db).
  Unlike MySQL or PostgreSQL, it doesn't need a separate server process.
  It's perfect for small/medium applications and development.
  
  CONCEPT — better-sqlite3:
  We use the "better-sqlite3" npm package. Unlike most database libraries,
  it is SYNCHRONOUS (blocking). This means:
  - No promises / async-await needed for queries
  - Simpler code to read and understand
  - Fast enough for our use case
  
  CONCEPT — Table:
  A table is like a spreadsheet. It has:
  - Columns: id, title, content, created_at, updated_at
  - Rows: one row per blog post
  
  CONCEPT — SQL (Structured Query Language):
  SQL is the language used to talk to relational databases.
  Common statements: SELECT, INSERT, UPDATE, DELETE, CREATE TABLE.
  
  CONCEPT — Primary Key:
  The "id" column is the primary key — it uniquely identifies each row.
  INTEGER PRIMARY KEY AUTOINCREMENT means SQLite assigns the next number
  automatically when a row is inserted.
*/

const Database = require('better-sqlite3');
const path = require('path');

// The database file will be created at backend/database/blog.db
// path.join builds a cross-platform file path
const dbPath = path.join(__dirname, 'blog.db');

// Open (or create) the database file
// verbose: logs every SQL statement to the console during development
// This is very helpful for understanding what queries are being run!
const db = new Database(dbPath, {
  verbose: process.env.NODE_ENV !== 'production' ? console.log : null,
});

// CONCEPT — WAL Mode (Write-Ahead Logging):
// This is a performance setting. WAL mode allows reads and writes to happen
// concurrently without blocking each other. It's the recommended mode for SQLite.
db.pragma('journal_mode = WAL');

// CONCEPT — CREATE TABLE IF NOT EXISTS:
// This creates the "posts" table only if it doesn't already exist.
// Safe to run every time the server starts — it won't delete existing data.
//
// Column definitions:
//   id         INTEGER PRIMARY KEY AUTOINCREMENT  → auto-incrementing unique ID
//   title      TEXT NOT NULL                      → required text field
//   content    TEXT NOT NULL                      → required text field
//   created_at DATETIME DEFAULT CURRENT_TIMESTAMP → set automatically on INSERT
//   updated_at DATETIME DEFAULT CURRENT_TIMESTAMP → updated manually on UPDATE
db.exec(`
  CREATE TABLE IF NOT EXISTS posts (
    id         INTEGER  PRIMARY KEY AUTOINCREMENT,
    title      TEXT     NOT NULL,
    content    TEXT     NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

console.log(`✅ Database connected: ${dbPath}`);

// Export the db object so other files (postController.js) can import it
module.exports = db;
