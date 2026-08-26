/*
  src/services/api.js — API Service Layer
  
  WHY THIS FILE EXISTS:
  Instead of writing fetch() calls scattered across every page component,
  we centralize all communication with the backend in ONE place.
  
  Benefits:
  1. If the backend URL changes, we change it in ONE place.
  2. Pages stay clean — they just call getPosts(), createPost(), etc.
  3. Easier to debug API issues.
  
  CONCEPT — The Fetch API:
  fetch() is a built-in browser function that makes HTTP requests.
  It returns a Promise — a value that isn't ready yet but will be
  available in the future. We use async/await to handle promises
  in a readable way.
  
  Example:
    const response = await fetch('/api/posts');  // wait for the server
    const data = await response.json();           // wait to parse JSON
*/

// Base URL for all API calls.
//
// CONCEPT — Environment Variables in Vite:
// Vite exposes variables prefixed with VITE_ to your React code via import.meta.env.
// - In development: reads from frontend/.env
// - In production (Vercel): reads from environment variables set in the Vercel dashboard
//
// This means we NEVER change this file when deploying — we just set VITE_API_URL
// in the hosting platform's dashboard.
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ─── GET ALL POSTS ───────────────────────────────────────────
// Fetches the list of all blog posts from the backend.
// Returns: array of post objects, e.g. [{ id, title, content, created_at }, ...]
export async function getPosts() {
  const response = await fetch(`${BASE_URL}/posts`);

  // response.ok is true if the status code is 200–299.
  // If the server returned an error (4xx or 5xx), we throw so the
  // calling component can handle it.
  if (!response.ok) {
    throw new Error('Failed to fetch posts');
  }

  return response.json(); // parses the JSON body and returns it
}

// ─── GET ONE POST ────────────────────────────────────────────
// Fetches a single post by its ID.
// id: the numeric ID from the URL (e.g. /posts/3 → id = 3)
// Returns: a single post object { id, title, content, created_at, updated_at }
export async function getPost(id) {
  const response = await fetch(`${BASE_URL}/posts/${id}`);

  if (response.status === 404) {
    // 404 means the post was not found in the database.
    // We throw a specific error so PostDetails can show "Post not found."
    throw new Error('Post not found');
  }

  if (!response.ok) {
    throw new Error('Failed to fetch post');
  }

  return response.json();
}

// ─── CREATE POST ─────────────────────────────────────────────
// Sends a new post to the backend to be saved in the database.
//
// data: an object { title, content }
// Returns: the newly created post object (with its new id, created_at, etc.)
//
// CONCEPT — POST request:
// A POST request sends data TO the server. We include the data in the
// request body as JSON. The Content-Type header tells the server
// "the body is JSON, please parse it as such."
export async function createPost(data) {
  const response = await fetch(`${BASE_URL}/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json', // tells server: body is JSON
    },
    body: JSON.stringify(data), // converts JS object → JSON string
  });

  if (!response.ok) {
    // Try to get the error message from the server response body
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to create post');
  }

  return response.json();
}

// ─── UPDATE POST ─────────────────────────────────────────────
// Updates an existing post's title and/or content.
//
// id: the ID of the post to update
// data: an object { title, content }
// Returns: the updated post object
//
// CONCEPT — PUT request:
// PUT means "replace this resource with what I'm sending."
// We send the complete new version of the post.
export async function updatePost(id, data) {
  const response = await fetch(`${BASE_URL}/posts/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (response.status === 404) {
    throw new Error('Post not found');
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to update post');
  }

  return response.json();
}

// ─── DELETE POST ─────────────────────────────────────────────
// Deletes a post from the database permanently.
//
// id: the ID of the post to delete
// Returns: nothing meaningful (just a success confirmation)
//
// CONCEPT — DELETE request:
// DELETE tells the server to remove the resource.
// Unlike POST/PUT, we don't send a body — the ID in the URL is enough.
export async function deletePost(id) {
  const response = await fetch(`${BASE_URL}/posts/${id}`, {
    method: 'DELETE',
  });

  if (response.status === 404) {
    throw new Error('Post not found');
  }

  if (!response.ok) {
    throw new Error('Failed to delete post');
  }

  // DELETE typically returns 200 or 204 (No Content).
  // We just return without parsing JSON since there's nothing meaningful.
  return true;
}
