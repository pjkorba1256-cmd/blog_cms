/*
  pages/EditPost.jsx — Edit Existing Post Page
  Route: /posts/:id/edit
  
  This page is slightly more complex than CreatePost because it must:
  1. Read the post ID from the URL (useParams)
  2. Load the existing post data (useEffect + GET request)
  3. Pre-fill the form with that data (passed via initialData prop)
  4. Handle the update (PUT request)
  5. Redirect to the updated post's detail page
  
  CONCEPT — Two sequential async operations:
  First we GET the post (to fill the form).
  Then when submitted, we PUT the updated data.
  These are two separate API calls at different times.
*/
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import PostForm from '../components/PostForm';
import { getPost, updatePost } from '../services/api';
import './CreatePost.css';

function EditPost() {
  const { id } = useParams();         // get post ID from URL
  const navigate = useNavigate();

  const [post, setPost]             = useState(null);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError]   = useState(null);

  // Step 1: Load the existing post
  useEffect(() => {
    async function fetchPost() {
      try {
        setLoading(true);
        const data = await getPost(id); // GET /api/posts/:id
        setPost(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchPost();
  }, [id]);

  // Step 2: Handle the form submission
  async function handleSubmit(formData) {
    try {
      setIsSubmitting(true);
      setSubmitError(null);

      await updatePost(id, formData); // PUT /api/posts/:id

      // Navigate to the detail page so the user can see the updated post
      navigate(`/posts/${id}`);
    } catch (err) {
      setSubmitError(err.message || 'Unable to update post. Please try again.');
      setIsSubmitting(false);
    }
  }

  // ── Loading the existing post ──
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

  // ── Error loading the post (e.g. invalid ID) ──
  if (error) {
    return (
      <div className="page">
        <div className="container">
          <div className="state-container">
            <span className="empty-icon">😕</span>
            <h2 className="state-title">Post Not Found</h2>
            <p className="state-message">{error}</p>
            <Link to="/" className="btn btn-secondary" style={{ marginTop: '1rem' }}>
              ← Back to Posts
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Post loaded successfully — show the edit form ──
  return (
    <div className="page">
      <div className="container">
        <Link to={`/posts/${id}`} className="back-link">
          ← Back to Post
        </Link>

        <h1 className="page-title">Edit Post</h1>
        <p className="page-subtitle">
          Editing: <strong>{post.title}</strong>
        </p>

        {/* Submission error from the API (not validation errors) */}
        {submitError && (
          <div className="alert alert-error">{submitError}</div>
        )}

        {/* PostForm pre-filled with existing data via the initialData prop.
            PostForm's useEffect watches initialData and sets the input values
            when this prop arrives.
        */}
        <PostForm
          onSubmit={handleSubmit}
          initialData={{ title: post.title, content: post.content }}
          submitLabel="Update Post"
          isLoading={isSubmitting}
        />
      </div>
    </div>
  );
}

export default EditPost;
