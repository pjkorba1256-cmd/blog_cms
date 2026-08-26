/*
  pages/PostDetails.jsx — Individual Post View
  Route: /posts/:id
  
  CONCEPT — Dynamic Routes and useParams:
  The route is /posts/:id — the ":id" is a URL parameter (a placeholder).
  When you visit /posts/3, React Router sets id = "3".
  
  useParams() is a React Router hook that reads these parameters from the URL.
  const { id } = useParams(); // id = "3" (always a string!)
  
  We must convert it to a number when passing to the API:
  getPost(id) — our api.js function accepts it as-is (the URL handles it).
  
  CONCEPT — Navigating programmatically (useNavigate):
  Sometimes we need to navigate WITHOUT clicking a Link — for example,
  after deleting a post, we need to go back to Home automatically.
  useNavigate() gives us a navigate() function for this.
  navigate('/') sends the user to the Home page.
*/
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getPost, deletePost } from '../services/api';
import './PostDetails.css';

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function PostDetails() {
  // useParams reads :id from the URL
  const { id } = useParams();

  // useNavigate lets us redirect programmatically
  const navigate = useNavigate();

  // State
  const [post, setPost]           = useState(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [deleting, setDeleting]   = useState(false);

  // Confirmation dialog state
  // true = the "Are you sure?" dialog is visible
  const [showConfirm, setShowConfirm] = useState(false);

  // Fetch the post when the component mounts (or when id changes)
  useEffect(() => {
    async function fetchPost() {
      try {
        setLoading(true);
        setError(null);
        const data = await getPost(id); // GET /api/posts/:id
        setPost(data);
      } catch (err) {
        setError(err.message); // "Post not found" or "Failed to fetch post"
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, [id]); // re-run if the id in the URL changes

  // ─── Delete Handler ──────────────────────────────────────
  async function handleDelete() {
    try {
      setDeleting(true);
      await deletePost(id); // DELETE /api/posts/:id
      // After successful deletion, go back to the post list
      navigate('/');
    } catch (err) {
      setError('Unable to delete post. Please try again.');
      setDeleting(false);
      setShowConfirm(false);
    }
  }

  // ── Loading ──
  if (loading) {
    return (
      <div className="page">
        <div className="container">
          <div className="state-container">
            <div className="loading-spinner" />
            <p className="state-message">Loading post...</p>
          </div>
        </div>
      </div>
    );
  }

  // ── Error / Not Found ──
  if (error) {
    return (
      <div className="page">
        <div className="container">
          <div className="state-container">
            <span className="empty-icon">😕</span>
            <h2 className="state-title">
              {error === 'Post not found' ? 'Post Not Found' : 'Something went wrong'}
            </h2>
            <p className="state-message">{error}</p>
            <Link to="/" className="btn btn-secondary" style={{ marginTop: '1rem' }}>
              ← Back to Posts
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Post Found — Render It ──
  return (
    <div className="page">
      <div className="container">
        <article className="post-detail">
          {/* Back navigation */}
          <Link to="/" className="back-link">
            ← All Posts
          </Link>

          {/* Post Header */}
          <header className="post-detail-header">
            <h1 className="post-detail-title">{post.title}</h1>

            <div className="post-detail-meta">
              <span>Published: {formatDate(post.created_at)}</span>
              {/* Show updated date only if the post was edited */}
              {post.updated_at && post.updated_at !== post.created_at && (
                <span>Updated: {formatDate(post.updated_at)}</span>
              )}
            </div>
          </header>

          {/* Post Content */}
          {/* white-space: pre-wrap preserves newlines from the textarea */}
          <div className="post-detail-content">
            {post.content}
          </div>

          {/* Action Buttons */}
          <div className="post-detail-actions">
            <Link to={`/posts/${id}/edit`} className="btn btn-secondary">
              ✏️ Edit
            </Link>

            <button
              className="btn btn-danger"
              onClick={() => setShowConfirm(true)}
              // Shows the confirmation dialog — doesn't delete immediately
            >
              🗑️ Delete
            </button>
          </div>
        </article>

        {/* ── Delete Confirmation Dialog ──
            CONCEPT — Conditional Rendering with &&:
            {condition && <Component />} renders Component only if condition is true.
            This is how we show/hide the modal.
        */}
        {showConfirm && (
          <div className="modal-overlay" role="dialog" aria-modal="true">
            <div className="modal">
              <h2 className="modal-title">Delete Post?</h2>
              <p className="modal-body">
                Are you sure you want to delete <strong>&quot;{post.title}&quot;</strong>?
                This action cannot be undone.
              </p>
              <div className="modal-actions">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowConfirm(false)}
                  disabled={deleting}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-danger"
                  onClick={handleDelete}
                  disabled={deleting}
                >
                  {deleting ? 'Deleting...' : 'Yes, Delete'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PostDetails;
