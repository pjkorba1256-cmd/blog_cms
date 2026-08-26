/*
  components/Navbar.jsx — Navigation Bar
  
  CONCEPT — Component:
  A component is a reusable piece of UI. Navbar is rendered on every page,
  so instead of copy-pasting the same HTML everywhere, we write it once here
  and use <Navbar /> wherever we need it.
  
  CONCEPT — Props:
  Props (short for "properties") are inputs you pass to a component.
  Like function arguments, but for React components.
  Example: <Navbar title="Blog CMS" /> passes "Blog CMS" as a prop.
  
  CONCEPT — Link vs <a>:
  React Router's <Link> component works like a regular <a> tag, but it
  does NOT reload the entire page. It updates the URL and lets React
  render the correct page component — much faster.
*/
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

// useLocation() is a React Router hook that tells us the current URL path.
// We use it to highlight the active navigation link.

function Navbar() {
  const location = useLocation(); // e.g. { pathname: '/create' }

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        {/* Logo / Brand — clicking takes you to the homepage */}
        <Link to="/" className="navbar-brand">
          <span className="navbar-logo">✍️</span>
          Blog CMS
        </Link>

        {/* Navigation links */}
        <nav className="navbar-links">
          {/* We add the "active" class when the user is on that page */}
          <Link
            to="/"
            className={`navbar-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            Posts
          </Link>

          {/* "Create Post" is the primary action — styled as a button */}
          <Link to="/create" className="btn btn-primary navbar-cta">
            + New Post
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
