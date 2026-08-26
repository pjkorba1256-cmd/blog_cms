/*
  components/PostForm.jsx — Reusable Create/Edit Form
  
  WHY ONE COMPONENT FOR BOTH CREATE AND EDIT?
  The create form and the edit form look identical — same fields, same
  validation, same submit button. The only difference is:
  - Create: starts with empty fields
  - Edit: starts with the existing post's data
  
  So instead of duplicating code, we make ONE form component that accepts
  an "initialData" prop. If provided, the form starts populated (Edit mode).
  If not provided, it starts empty (Create mode).
  
  CONCEPT — Controlled Components (Controlled Inputs):
  In regular HTML, form inputs manage their own value internally.
  In React, we "control" the input by binding its value to React state.
  
  Regular HTML:   <input type="text" />   — uncontrolled
  React/Controlled: <input value={title} onChange={setTitle} /> — controlled
  
  Why control inputs?
  - We can validate the value instantly as the user types.
  - We can read the value whenever we want (e.g. on form submit).
  - We can programmatically reset or pre-fill the value.
  
  The pattern is always:
    const [value, setValue] = useState('');
    <input value={value} onChange={(e) => setValue(e.target.value)} />
  
  CONCEPT — useState:
  useState is a React Hook that lets a function component hold state.
  Without hooks, function components couldn't remember anything between renders.
  
  const [title, setTitle] = useState('');
  - title  → the current value of the state variable
  - setTitle → the function to update it (triggers a re-render)
  - useState('') → starts with an empty string
*/
import { useState, useEffect } from 'react';
import './PostForm.css';

// Props:
//   onSubmit    — function called when the form is submitted with valid data
//   initialData — optional { title, content } to pre-fill (used in EditPost)
//   submitLabel — text on the submit button, e.g. "Create Post" or "Update Post"
//   isLoading   — whether the parent is currently saving (disables the button)
function PostForm({ onSubmit, initialData = null, submitLabel = 'Create Post', isLoading = false }) {
  // State for the two form fields
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // State for validation errors (one per field)
  const [errors, setErrors] = useState({});

  // CONCEPT — useEffect:
  // useEffect runs AFTER the component renders. The second argument is the
  // "dependency array". When the values in it change, the effect re-runs.
  //
  // Here: when initialData changes (i.e. when EditPost finishes loading
  // the existing post), we populate the form fields with the existing values.
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setContent(initialData.content);
    }
  }, [initialData]); // runs again if initialData changes

  // ─── Validation ───────────────────────────────────────────
  // validate() checks both fields and returns true if the form is valid.
  // If invalid, it sets error messages in state so they appear under the inputs.
  function validate() {
    const newErrors = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required.';
    }
    if (!content.trim()) {
      newErrors.content = 'Content is required.';
    }

    setErrors(newErrors);

    // Object.keys(newErrors).length === 0 means no errors → form is valid
    return Object.keys(newErrors).length === 0;
  }

  // ─── Form Submit Handler ───────────────────────────────────
  // CONCEPT — Event handling in React:
  // We attach an onSubmit function to the <form> element.
  // e.preventDefault() stops the browser's default behavior of refreshing the page.
  function handleSubmit(e) {
    e.preventDefault(); // ← Very important! Prevents page reload.

    // Run validation first. If it fails, stop here.
    if (!validate()) return;

    // Call the parent's onSubmit function with the form data.
    // The parent (CreatePost.jsx or EditPost.jsx) handles the API call.
    onSubmit({ title: title.trim(), content: content.trim() });
  }

  return (
    <form className="post-form" onSubmit={handleSubmit} noValidate>
      {/* Title Field */}
      <div className="form-group">
        <label htmlFor="post-title" className="form-label">
          Title
        </label>
        <input
          id="post-title"
          type="text"
          className={`form-input ${errors.title ? 'error' : ''}`}
          placeholder="Enter a descriptive title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          // e.target.value is the current text inside the input
        />
        {/* Conditional rendering: show error only if it exists */}
        {errors.title && <p className="error-message">{errors.title}</p>}
      </div>

      {/* Content Field */}
      <div className="form-group">
        <label htmlFor="post-content" className="form-label">
          Content
        </label>
        <textarea
          id="post-content"
          className={`form-textarea ${errors.content ? 'error' : ''}`}
          placeholder="Write your blog post content here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        {errors.content && <p className="error-message">{errors.content}</p>}

        {/* Character count — optional enhancement */}
        <span className="char-count">
          {content.length} characters
        </span>
      </div>

      {/* Submit Button */}
      <div className="form-actions">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isLoading}
          // disabled prevents multiple clicks while saving
        >
          {isLoading ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  );
}

export default PostForm;
