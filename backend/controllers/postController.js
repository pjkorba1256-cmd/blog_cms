/*
  controllers/postController.js — Business Logic
  
  CONCEPT — Controller:
  A controller contains the actual logic for each API operation.
  The route file (postRoutes.js) says WHAT URL triggers WHICH function.
  The controller says HOW to handle it.
  
  Separating routes and controllers means:
  - Routes stay short and readable
  - Controllers are easy to test in isolation
  - Each function has a single responsibility
  
  CONCEPT — req and res (Request and Response):
  Every Express handler function receives two objects:
  
  req (request)  → information about what the client sent:
    req.params   → URL parameters  e.g. /posts/3 → { id: "3" }
    req.body     → request body    e.g. { title: "...", content: "..." }
    req.query    → query string    e.g. /posts?page=2 → { page: "2" }
  
  res (response) → methods to send something back to the client:
    res.json()      → sends JSON (sets Content-Type: application/json)
    res.status(404) → sets the HTTP status code
  
  CONCEPT — Parameterized Queries (Security):
  We use ? placeholders in SQL queries instead of string concatenation.
  
  WRONG (vulnerable to SQL injection):
    db.prepare(`SELECT * FROM posts WHERE id = ${id}`).get();
    // If id = "1; DROP TABLE posts", this would delete your database!
  
  CORRECT (safe — better-sqlite3 handles the escaping):
    db.prepare('SELECT * FROM posts WHERE id = ?').get(id);
  
  better-sqlite3 never lets user input become raw SQL.
*/

const db = require('../database/database');

// ─── GET ALL POSTS ───────────────────────────────────────────
// Handles: GET /api/posts
// Returns: array of all post objects, ordered newest first
function getAllPosts(req, res) {
  try {
    // CONCEPT — SELECT:
    // SELECT * means "select all columns".
    // FROM posts means "from the posts table".
    // ORDER BY created_at DESC means "newest posts first".
    // .all() returns an array of all matching rows.
    const posts = db.prepare(`
      SELECT id, title, content, created_at, updated_at
      FROM posts
      ORDER BY created_at DESC
    `).all();

    res.status(200).json(posts);
  } catch (error) {
    console.error('Error getting posts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// ─── GET ONE POST ────────────────────────────────────────────
// Handles: GET /api/posts/:id
// Returns: a single post object, or 404 if not found
function getPostById(req, res) {
  try {
    const { id } = req.params;
    // CONCEPT — WHERE clause:
    // WHERE id = ? filters rows to only the one with matching id.
    // .get() returns the first (and only) matching row, or undefined.
    const post = db.prepare(`
      SELECT id, title, content, created_at, updated_at
      FROM posts
      WHERE id = ?
    `).get(id); // id is safely passed as a parameter

    if (!post) {
      // CONCEPT — 404 Not Found:
      // The request was valid, but the resource doesn't exist.
      return res.status(404).json({ error: 'Post not found' });
    }

    res.status(200).json(post);
  } catch (error) {
    console.error('Error getting post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// ─── CREATE POST ─────────────────────────────────────────────
// Handles: POST /api/posts
// Body: { title, content }
// Returns: the newly created post (including its id and timestamps)
function createPost(req, res) {
  try {
    const { title, content } = req.body;

    // CONCEPT — Backend Validation:
    // Even though the React form validates on the frontend,
    // we validate again here. Why? Because anyone can send a raw HTTP
    // request to our API, bypassing the frontend entirely.
    // (e.g. using Postman, curl, or a script)
    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Title is required' });
    }
    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Content is required' });
    }

    // CONCEPT — INSERT:
    // INSERT INTO posts (...) VALUES (?, ?)
    // Adds a new row to the posts table.
    // .run() executes the statement and returns info (like the new row's id).
    const stmt = db.prepare(`
      INSERT INTO posts (title, content)
      VALUES (?, ?)
    `);

    const result = stmt.run(title.trim(), content.trim());
    // result.lastInsertRowid → the auto-generated id of the new post

    // Fetch the newly created post to return it (with created_at, etc.)
    const newPost = db.prepare('SELECT * FROM posts WHERE id = ?')
      .get(result.lastInsertRowid);

    // CONCEPT — 201 Created:
    // Use 201 (not 200) for successful resource creation.
    res.status(201).json(newPost);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// ─── UPDATE POST ─────────────────────────────────────────────
// Handles: PUT /api/posts/:id
// Body: { title, content }
// Returns: the updated post object
function updatePost(req, res) {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    // Validate input
    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Title is required' });
    }
    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Content is required' });
    }

    // First, check that the post exists
    const existing = db.prepare('SELECT id FROM posts WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // CONCEPT — UPDATE:
    // UPDATE posts SET ... WHERE id = ?
    // Modifies the matching row(s). We also manually update updated_at
    // because SQLite's DEFAULT only applies on INSERT, not UPDATE.
    // CURRENT_TIMESTAMP is a SQLite function that returns the current date/time.
    db.prepare(`
      UPDATE posts
      SET title = ?, content = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(title.trim(), content.trim(), id);

    // Return the updated post
    const updatedPost = db.prepare('SELECT * FROM posts WHERE id = ?').get(id);
    res.status(200).json(updatedPost);
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// ─── DELETE POST ─────────────────────────────────────────────
// Handles: DELETE /api/posts/:id
// Returns: { message: 'Post deleted successfully' }
function deletePost(req, res) {
  try {
    const { id } = req.params;

    // Check that the post exists before trying to delete
    const existing = db.prepare('SELECT id FROM posts WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // CONCEPT — DELETE:
    // DELETE FROM posts WHERE id = ?
    // Permanently removes the matching row from the table.
    db.prepare('DELETE FROM posts WHERE id = ?').run(id);

    // 200 with a message confirms the deletion
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Export all functions so postRoutes.js can use them
module.exports = {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
};
