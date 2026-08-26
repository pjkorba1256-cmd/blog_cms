/*
  components/Navbar.jsx — Navigation Bar
  
  CONCEPT — Component:
  A component is a reusable piece of UI. Navbar is rendered on every page,
  so instead of copy-pasting the same HTML everywhere, we write it once here
  and use <Navbar /> wherever we need it.
  
  CONCEPT — Link vs <a>:
  React Router's <Link> component works like a regular <a> tag, but it
  does NOT reload the entire page. It updates the URL and lets React
  render the correct page component — much faster.

  CONCEPT — useTheme():
  This is a custom hook from ThemeContext. It gives us the current theme
  ('light' or 'dark') and a toggleTheme() function — without needing
  to pass props down from App.jsx. That's the power of React Context.
*/
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import './Navbar.css';

function Navbar() {
  const location = useLocation(); // e.g. { pathname: '/create' }
  const { theme, toggleTheme } = useTheme();

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

          {/* Dark / Light mode toggle button.
              aria-label makes it accessible to screen readers since it has no visible text.
              title shows a browser tooltip on hover. */}
          <button
            id="theme-toggle"
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>

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
