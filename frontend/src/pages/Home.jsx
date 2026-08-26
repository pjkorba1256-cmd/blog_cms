/*
  pages/Home.jsx — Blog Post List Page
  Route: /
  
  This is the first page the user sees. It shows all blog posts.
  
  CONCEPT — useEffect + useState for API calls:
  The classic pattern for loading data in React is:
  
    1. Create state for: data, loading flag, error message
    2. Use useEffect to fetch data when the component mounts
    3. While fetching: show a loading message
    4. If it fails: show an error message
    5. If successful: show the data
  
  "Mounting" = when a component appears in the browser for the first time.
  
  CONCEPT — The empty dependency array []:
  useEffect(() => { ... }, [])
  The [] means "run this effect only ONCE — when the component first mounts."
  Without [], the effect would run after every re-render (infinite loop risk!).
*/
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PostCard from '../components/PostCard';
import { getPosts } from '../services/api';
import './Home.css';

function Home() {
  // State variables — each stores a piece of information this component needs
  const [posts, setPosts]       = useState([]);     // array of post objects
  const [loading, setLoading]   = useState(true);   // true while waiting for API
  const [error, setError]       = useState(null);   // error message string or null

  // Search state — for the optional search feature
  const [searchTerm, setSearchTerm] = useState('');

  // useEffect: runs once when Home first appears on screen
  useEffect(() => {
    // We define an async function inside useEffect because useEffect's
    // callback itself cannot be async directly.
    async function fetchPosts() {
      try {
        setLoading(true);
        setError(null);

        const data = await getPosts(); // calls GET /api/posts
        setPosts(data);               // saves posts into state
      } catch (err) {
        // If the API call fails (network error, server down, etc.)
        setError('Unable to load posts. Is the backend server running?');
      } finally {
        // finally always runs — even if try or catch threw an error
        setLoading(false);
      }
    }

    fetchPosts();
  }, []); // [] = run only once on mount

  // ─── Search Filtering ─────────────────────────────────────
  // We filter the posts array in memory (no extra API call needed).
  // .filter() returns a new array containing only items where the
  // callback function returns true.
  const filteredPosts = posts.filter((post) => {
    if (!searchTerm.trim()) return true; // no search term → show all
    const term = searchTerm.toLowerCase();
    return (
      post.title.toLowerCase().includes(term) ||
      post.content.toLowerCase().includes(term)
    );
  });

  // ─── Render ───────────────────────────────────────────────
  // CONCEPT — Conditional Rendering:
  // We use JavaScript's ternary (condition ? ifTrue : ifFalse) and && operator
  // to show different UI depending on state.
  return (
    <div className="page">
      <div className="container">
        {/* Page Header */}
        <div className="home-header">
          <div>
            <h1 className="page-title">Blog Posts</h1>
            <p className="page-subtitle">
              {posts.length > 0
                ? `${posts.length} post${posts.length !== 1 ? 's' : ''} published`
                : 'Share your thoughts with the world'}
            </p>
          </div>

          <Link to="/create" className="btn btn-primary">
            + New Post
          </Link>
        </div>

        {/* Search Bar */}
        <div className="home-search">
          <input
            type="search"
            className="form-input search-input"
            placeholder="🔍  Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* ── Loading State ── */}
        {loading && (
          <div className="state-container">
            <div className="loading-spinner" aria-label="Loading" />
            <p className="state-message">Loading posts...</p>
          </div>
        )}

        {/* ── Error State ── */}
        {!loading && error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        {/* ── Empty State (no posts at all) ── */}
        {!loading && !error && posts.length === 0 && (
          <div className="state-container empty-state">
            <span className="empty-icon">📝</span>
            <h2 className="state-title">No blog posts yet.</h2>
            <p className="state-message">Create your first post to get started!</p>
            <Link to="/create" className="btn btn-primary" style={{ marginTop: '1rem' }}>
              + Create First Post
            </Link>
          </div>
        )}

        {/* ── Empty Search Results ── */}
        {!loading && !error && posts.length > 0 && filteredPosts.length === 0 && (
          <div className="state-container">
            <span className="empty-icon">🔍</span>
            <p className="state-message">
              No posts match &quot;{searchTerm}&quot;. Try a different search.
            </p>
          </div>
        )}

        {/* ── Post Grid ── */}
        {/* CONCEPT — List Rendering with .map():
            posts.map() transforms each post object into a <PostCard> element.
            React renders all the resulting elements as a list.
            The key prop must be unique per item — we use post.id.
        */}
        {!loading && !error && filteredPosts.length > 0 && (
          <div className="posts-grid">
            {filteredPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
