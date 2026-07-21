import Link from "next/link";

export function Header() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link href="/" className="brand" aria-label="Yomi home">
          <span className="brand__mark" aria-hidden>
            読
          </span>
          <span className="brand__name">Yomi</span>
        </Link>
        <nav className="site-nav" aria-label="Primary">
          <a href="/#browse">Browse</a>
          <a href="/#genres">Genres</a>
        </nav>
      </div>
    </header>
  );
}
