/*
  App.jsx — Root Component and Router Setup
  
  CONCEPT — React Router:
  React Router lets you define which component to show based on the URL.
  Without it, React can only show one thing — it has no concept of "pages."
  
  CONCEPT — ThemeProvider:
  Wraps the entire app so any component can call useTheme() to read or
  toggle the current theme. It's placed at the top level so nothing
  is left outside the theme context.

  Key imports explained:
  
  BrowserRouter — wraps your whole app and enables URL-based routing.
                  It listens to the browser's address bar.
  
  Routes       — the container for all your Route definitions.
                  Only ONE Route matches at a time.
  
  Route        — maps a URL path to a component.
                  path="/"          → show <Home />
                  path="/create"    → show <CreatePost />
                  path="/posts/:id" → show <PostDetails /> (dynamic)
  
  CONCEPT — The layout pattern:
  Navbar is rendered OUTSIDE the Routes, which means it appears on
  EVERY page. Routes renders only the matching page component.
  
  Structure:
  <ThemeProvider>
    <BrowserRouter>
      <Navbar />           ← always visible
      <Routes>
        <Route ... />      ← only the matching route renders
      </Routes>
    </BrowserRouter>
  </ThemeProvider>
*/
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import CreatePost from './pages/CreatePost';
import PostDetails from './pages/PostDetails';
import EditPost from './pages/EditPost';

function App() {
  return (
    // ThemeProvider must wrap BrowserRouter so Navbar (inside Router) can use useTheme()
    <ThemeProvider>
      <BrowserRouter>
        {/* Navbar is outside Routes so it appears on every page */}
        <Navbar />

        {/* Routes renders only the component that matches the current URL */}
        <Routes>
          {/* Home page — lists all posts */}
          <Route path="/" element={<Home />} />

          {/* Create page — form for new posts */}
          <Route path="/create" element={<CreatePost />} />

          {/* Detail page — shows one post. :id is a dynamic segment */}
          <Route path="/posts/:id" element={<PostDetails />} />

          {/* Edit page — form pre-filled with existing post data */}
          <Route path="/posts/:id/edit" element={<EditPost />} />

          {/* Catch-all: if no route matches, show a friendly 404 message.
              The * means "match anything not matched above."
          */}
          <Route
            path="*"
            element={
              <div className="page">
                <div className="container state-container">
                  <span style={{ fontSize: '3.5rem' }}>🗺️</span>
                  <h2 className="state-title">Page Not Found</h2>
                  <p className="state-message">
                    The page you&#39;re looking for doesn&#39;t exist.
                  </p>
                  <a href="/" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                    Go Home
                  </a>
                </div>
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;

