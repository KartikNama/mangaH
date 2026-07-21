import Link from "next/link";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__brand">
          <Link href="/" className="brand brand--footer">
            <span className="brand__mark" aria-hidden>
              読
            </span>
            <span className="brand__name">Tomi</span>
          </Link>
          <p>Complete stories. One scroll. No chapter chase.</p>
        </div>
        <div className="site-footer__cols">
          <div>
            <h3>Explore</h3>
            <a href="/#browse">All titles</a>
            <a href="/#genres">Genres</a>
          </div>
          <div>
            <h3>Soon</h3>
            <span>Accounts</span>
            <span>Uploads</span>
            <span>Library sync</span>
          </div>
        </div>
      </div>
      <div className="site-footer__bottom">
        <p>© {new Date().getFullYear()} Tomi. Sample catalog for frontend demo.</p>
      </div>
    </footer>
  );
}
