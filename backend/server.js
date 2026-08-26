/*
  server.js — Express Application Entry Point
  
  CONCEPT — Node.js:
  Node.js lets you run JavaScript on the server (not just in the browser).
  When you run "node server.js", Node.js executes this file and keeps
  running as a server, listening for incoming HTTP requests.
  
  CONCEPT — Express:
  Express is a minimal web framework for Node.js. It makes it easy to:
  - Define routes (what to do for GET /api/posts, etc.)
  - Add middleware (functions that run on every request)
  - Send responses (JSON, HTML, etc.)
  
  Without Express, you'd have to manually parse URLs, headers, and bodies
  using Node's built-in http module — much more complex.
  
  CONCEPT — Middleware:
  Middleware are functions that run between receiving a request and
  sending a response. They can modify req, modify res, or call next().
  
  The flow:
    Request → middleware 1 → middleware 2 → route handler → Response
  
  Common middleware we use:
    cors()         → allows the React frontend to call this API
    express.json() → parses JSON request bodies
  
  CONCEPT — CORS (Cross-Origin Resource Sharing):
  Browsers block JavaScript from making requests to a different "origin"
  (domain + port) by default. This is a security feature.
  
  Our setup:
    Frontend: http://localhost:5173 (Vite)
    Backend:  http://localhost:5000 (Express)
  
  They have different ports → different origins → browser blocks requests.
  CORS headers tell the browser: "Yes, this is an allowed cross-origin request."
  The "cors" npm package adds these headers automatically.
*/

const express = require('express');
const cors = require('cors');
const postRoutes = require('./routes/postRoutes');

// Initialize the database immediately when the server starts.
// This runs the CREATE TABLE IF NOT EXISTS statement.
require('./database/database');

const app = express();         // create the Express application

// process.env.PORT is set automatically by Render (and other hosting platforms).
// We fall back to 5000 for local development.
const PORT = process.env.PORT || 5000;

// ─── Middleware ───────────────────────────────────────────────

// CORS: In production (Render), we allow any origin so the Vercel frontend
// can reach this API regardless of its exact URL.
// In development, this still allows localhost:5173.
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? true                            // allow all origins in production
  : 'http://localhost:5173';        // only our dev frontend locally

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

// JSON body parser: reads the request body and makes it available as req.body.
// Without this, req.body would be undefined for POST/PUT requests.
app.use(express.json());

// ─── Routes ───────────────────────────────────────────────────
// All post-related routes are in postRoutes.js.
// The '/api/posts' prefix is added here, so inside postRoutes.js
// we only need to write '/' and '/:id'.
//
// Result:
//   postRoutes GET  /   → becomes GET  /api/posts
//   postRoutes POST /   → becomes POST /api/posts
//   postRoutes GET  /:id → becomes GET  /api/posts/:id
//   etc.
app.use('/api/posts', postRoutes);

// ─── Health Check ─────────────────────────────────────────────
// A simple route to verify the server is running.
// Visit http://localhost:5000/api/health in your browser to check.
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Blog CMS API is running' });
});

// ─── 404 Handler ──────────────────────────────────────────────
// If no route above matched, send a 404.
// This middleware comes LAST — it only runs if nothing else handled the request.
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.url} not found` });
});

// ─── Global Error Handler ─────────────────────────────────────
// A special Express middleware with 4 parameters (err, req, res, next).
// Express automatically routes errors here when next(err) is called.
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// ─── Start the Server ─────────────────────────────────────────
// app.listen() starts the HTTP server on the given port.
// The callback runs once the server is ready.
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`📋 API endpoints:`);
  console.log(`   GET    http://localhost:${PORT}/api/posts`);
  console.log(`   POST   http://localhost:${PORT}/api/posts`);
  console.log(`   GET    http://localhost:${PORT}/api/posts/:id`);
  console.log(`   PUT    http://localhost:${PORT}/api/posts/:id`);
  console.log(`   DELETE http://localhost:${PORT}/api/posts/:id`);
});
