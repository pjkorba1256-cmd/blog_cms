/*
  server.js — Express Application Entry Point

  Vercel deployment version.
*/

const express = require('express');
const cors = require('cors');
const postRoutes = require('./routes/postRoutes');

// Initialize the database
require('./database/database');

const app = express();

// ─── Middleware ───────────────────────────────────────────────

// Allow requests from the frontend
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? true
  : 'http://localhost:5173';

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

// Parse JSON request bodies
app.use(express.json());

// ─── Routes ───────────────────────────────────────────────────

app.use('/api/posts', postRoutes);

// ─── Health Check ─────────────────────────────────────────────

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Blog CMS API is running'
  });
});

// ─── 404 Handler ──────────────────────────────────────────────

app.use((req, res) => {
  res.status(404).json({
    error: `Route ${req.method} ${req.url} not found`
  });
});

// ─── Global Error Handler ────────────────────────────────────

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);

  res.status(500).json({
    error: 'Internal server error'
  });
});

// ─── Export + Local Start ─────────────────────────────────────
// module.exports = app   → Vercel imports this and handles the HTTP server itself.
//
// require.main === module → true ONLY when this file is run directly:
//   node server.js  (local dev)
//
// It is false when the file is require()'d by another system (e.g. Vercel),
// so app.listen() is SKIPPED on Vercel and RUNS locally. Best of both worlds.

module.exports = app;

if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    console.log(`📋 API endpoints:`);
    console.log(`   GET    http://localhost:${PORT}/api/posts`);
    console.log(`   POST   http://localhost:${PORT}/api/posts`);
    console.log(`   GET    http://localhost:${PORT}/api/posts/:id`);
    console.log(`   PUT    http://localhost:${PORT}/api/posts/:id`);
    console.log(`   DELETE http://localhost:${PORT}/api/posts/:id`);
  });
}