// SkipLink — renders a visually hidden "Skip to main content" link.
// Appears on :focus so keyboard users can bypass the Navbar.
// Must be the very first focusable element on the page (rendered in layout.tsx
// before Navbar so it comes first in tab order).
//
// Accessibility: WCAG 2.4.1 — bypass blocks.

export function SkipLink() {
  return (
    <a href="#main-content" className="skip-link">
      Skip to main content
    </a>
  );
}
