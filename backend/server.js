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

// ─── Vercel Export ────────────────────────────────────────────
// Vercel handles starting the HTTP server.
// We only export the Express application.

module.exports = app;