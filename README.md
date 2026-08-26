# Blog CMS

A full-stack blog / content management system built as a college club recruitment task.

## Overview

A simple CRUD application that allows users to create, read, edit, and delete blog posts. Built with a React frontend, Node.js + Express backend, and SQLite database.

## Features

- ✅ View all blog posts in a responsive grid
- ✅ Search posts by title or content
- ✅ View an individual blog post
- ✅ Create a new blog post with form validation
- ✅ Edit an existing blog post
- ✅ Delete a post with confirmation dialog
- ✅ Loading, error, and empty states on every page
- ✅ Responsive design (desktop + mobile)

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, React Router |
| Backend | Node.js, Express.js |
| Database | SQLite (via better-sqlite3) |
| Styling | Vanilla CSS |
| HTTP | Fetch API |

## Project Structure

```
blog-cms/
├── frontend/               # React application (Vite)
│   └── src/
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── PostCard.jsx
│       │   └── PostForm.jsx
│       ├── pages/
│       │   ├── Home.jsx
│       │   ├── CreatePost.jsx
│       │   ├── PostDetails.jsx
│       │   └── EditPost.jsx
│       ├── services/
│       │   └── api.js      # All fetch() calls in one place
│       ├── App.jsx         # Router setup
│       └── index.css       # Global styles
│
└── backend/                # Express API
    ├── server.js           # Entry point, middleware, route mounting
    ├── routes/
    │   └── postRoutes.js   # Route → handler mappings
    ├── controllers/
    │   └── postController.js  # CRUD logic + SQL queries
    └── database/
        ├── database.js     # SQLite connection + schema
        └── blog.db         # Auto-generated SQLite database file
```

## Installation

### Prerequisites
- Node.js (v18+)
- npm

### Frontend setup

```bash
cd frontend
npm install
```

### Backend setup

```bash
cd backend
npm install
```

## Running the Application

Open **two terminal windows**.

**Terminal 1 — Backend:**
```bash
cd backend
npm start
# Server runs at http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
# App runs at http://localhost:5173
```

Then open **http://localhost:5173** in your browser.

## Database

SQLite is used for persistent storage. The database file (`blog.db`) is created automatically when the backend starts for the first time. No separate database server is needed.

The `posts` table schema:

```sql
CREATE TABLE posts (
    id         INTEGER  PRIMARY KEY AUTOINCREMENT,
    title      TEXT     NOT NULL,
    content    TEXT     NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## API Endpoints

| Method | Endpoint | Description | Status Codes |
|--------|----------|-------------|--------------|
| GET | `/api/posts` | Get all posts | 200, 500 |
| GET | `/api/posts/:id` | Get one post | 200, 404, 500 |
| POST | `/api/posts` | Create a post | 201, 400, 500 |
| PUT | `/api/posts/:id` | Update a post | 200, 400, 404, 500 |
| DELETE | `/api/posts/:id` | Delete a post | 200, 404, 500 |

**Health check:** `GET /api/health`

### Example request (Create Post)

```bash
curl -X POST http://localhost:5000/api/posts \
  -H "Content-Type: application/json" \
  -d '{"title": "My First Post", "content": "Hello, world!"}'
```

### Example response

```json
{
  "id": 1,
  "title": "My First Post",
  "content": "Hello, world!",
  "created_at": "2026-08-26 11:00:00",
  "updated_at": "2026-08-26 11:00:00"
}
```

## Future Improvements

- Add pagination for large post lists
- Add image upload support
- Add user authentication
- Add post categories / tags
- Add rich text editor
