/*
  pages/CreatePost.jsx — Create New Post Page
  Route: /create
  
  This page is simple: it renders the PostForm component and handles
  the API call when the form is submitted.
  
  Notice how thin this component is — the form logic is in PostForm,
  the API logic is in api.js. This page just connects them.
  
  This is called "separation of concerns" — each file has one job.
*/
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import PostForm from '../components/PostForm';
import { createPost } from '../services/api';
import './CreatePost.css';

function CreatePost() {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // This function is passed as a prop to PostForm.
  // PostForm calls it with { title, content } when the form is submitted.
  async function handleSubmit(formData) {
    try {
      setIsLoading(true);
      setError(null);

      const newPost = await createPost(formData); // POST /api/posts

      // After creating, navigate to the new post's detail page.
      // navigate('/') would go to Home — but going directly to the post
      // lets the user see what they just created. Better UX!
      navigate(`/posts/${newPost.id}`);
    } catch (err) {
      setError(err.message || 'Unable to create post. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="page">
      <div className="container">
        {/* Breadcrumb navigation */}
        <Link to="/" className="back-link">
          ← Back to Posts
        </Link>

        <h1 className="page-title">Create New Post</h1>
        <p className="page-subtitle">Share your thoughts with the world.</p>

        {/* API error (different from validation errors in the form) */}
        {error && <div className="alert alert-error">{error}</div>}

        {/* PostForm component — we pass:
            - onSubmit: what to do with the data
            - submitLabel: text for the submit button
            - isLoading: whether to disable the button
        */}
        <PostForm
          onSubmit={handleSubmit}
          submitLabel="Create Post"
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}

export default CreatePost;
