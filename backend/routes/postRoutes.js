/*
  routes/postRoutes.js — Route Definitions
  
  CONCEPT — Express Router:
  express.Router() creates a "mini application" that handles just one
  group of routes. We export it and mount it in server.js at /api/posts.
  
  CONCEPT — HTTP Methods:
  Each CRUD operation maps to a different HTTP method:
  
    GET    → Read (retrieve data, don't change anything)
    POST   → Create (add new data)
    PUT    → Update (replace existing data)
    DELETE → Delete (remove data)
  
  The SAME URL can handle DIFFERENT methods:
    GET    /api/posts/:id → read post 3
    PUT    /api/posts/:id → update post 3
    DELETE /api/posts/:id → delete post 3
  
  This is the "R" in REST (Representational State Transfer):
  - Use nouns in URLs (/posts, not /getPosts or /deletePosts)
  - Use HTTP methods to express the action
*/

const express = require('express');
const router = express.Router();
const {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
} = require('../controllers/postController');

// GET    /api/posts       → get all posts
// POST   /api/posts       → create a new post
router.get('/', getAllPosts);
router.post('/', createPost);

// GET    /api/posts/:id   → get a single post
// PUT    /api/posts/:id   → update a post
// DELETE /api/posts/:id   → delete a post
router.get('/:id', getPostById);
router.put('/:id', updatePost);
router.delete('/:id', deletePost);

module.exports = router;
