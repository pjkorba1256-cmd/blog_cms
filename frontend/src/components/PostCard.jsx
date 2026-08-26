/*
  components/PostCard.jsx — Blog Post Card
  
  CONCEPT — Props:
  PostCard receives a single post object as a prop.
  The parent (Home.jsx) maps over the posts array and renders one
  <PostCard> per post, passing the post data in.
  
  Usage example in Home.jsx:
    {posts.map(post => <PostCard key={post.id} post={post} />)}
  
  CONCEPT — Keys:
  When React renders a list of components, each must have a unique "key" prop.
  The key helps React know which item changed/was added/removed during updates.
  We use post.id as the key because it is guaranteed to be unique.
  
  CONCEPT — Date formatting:
  created_at comes from SQLite as a string like "2026-08-26 10:00:00".
  We pass it to the JavaScript Date object and use toLocaleDateString()
  to display it in a human-readable format.
*/
import { Link } from 'react-router-dom';
import './PostCard.css';

// Helper function: format a date string into "26 Aug 2026"
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

// Helper function: truncate long content for the preview
// We only show the first 150 characters in the card.
function truncate(text, maxLength = 150) {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

// PostCard receives { post } — a single post object destructured from props.
// Destructuring: instead of writing props.post.title, we write post.title.
function PostCard({ post }) {
  return (
    <article className="post-card">
      {/* Card Header */}
      <div className="post-card-body">
        <h2 className="post-card-title">{post.title}</h2>

        {/* Content preview — truncated so cards are uniform height */}
        <p className="post-card-preview">{truncate(post.content)}</p>
      </div>

      {/* Card Footer */}
      <div className="post-card-footer">
        <span className="post-card-date">
          {/* 📅 icon + formatted date */}
          📅 {formatDate(post.created_at)}
        </span>

        {/* React Router Link — navigates to the post detail page */}
        {/* /posts/3 for a post with id = 3 */}
        <Link to={`/posts/${post.id}`} className="btn btn-ghost post-card-link">
          Read More →
        </Link>
      </div>
    </article>
  );
}

export default PostCard;
