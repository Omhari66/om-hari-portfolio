// Footer — minimal sign-off strip.

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      style={{
        borderTop: "1px solid var(--color-border)",
        padding: "2rem 0",
      }}
    >
      <div
        className="container-site"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--text-xs)",
            color: "var(--color-text-dim)",
            letterSpacing: "0.05em",
          }}
        >
          © {year} Om Hari — Built with care, shipped with intent.
        </p>

        <a
          href="#hero"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--text-xs)",
            color: "var(--color-text-dim)",
            textDecoration: "none",
            letterSpacing: "0.05em",
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            transition: "color var(--duration-fast)",
          }}
        >
          ↑ Back to top
        </a>
      </div>
    </footer>
  );
}
