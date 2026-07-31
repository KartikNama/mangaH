import Link from "next/link";

export function Header() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link href="/" className="brand" aria-label="SAdult home">
          <span className="brand__mark" aria-hidden>
            SA
          </span>
          <span className="brand__name">
            S<span>Adult</span>
          </span>
        </Link>
        <nav className="site-nav" aria-label="Primary">
          <a href="/#browse">Browse</a>
          <a href="/#platforms">Platforms</a>
          <a href="/#genres">Genres</a>
        </nav>
      </div>
    </header>
  );
}
