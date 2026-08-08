import Link from "next/link";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__brand">
          <Link href="/" className="brand brand--footer">
            <span className="brand__mark" aria-hidden>
              SA
            </span>
            <span className="brand__name">
              S<span>Adult</span>
            </span>
          </Link>
          <p>
            Free adult game downloads for Windows, Mac, Linux & Android — curated at saudult.xyz.
          </p>
        </div>
        <div className="site-footer__cols">
          <div>
            <h3>Explore</h3>
            <Link href="/#browse">All games</Link>
            <Link href="/genres">Genres</Link>
            <Link href="/tags">Tags</Link>
          </div>
          <div>
            <h3>Site</h3>
            <a href="/sitemap.xml">Sitemap</a>
            <a href="/robots.txt">Robots</a>
            <a href="/ads.txt">Ads.txt</a>
          </div>
          <div>
            <h3>Platforms</h3>
            <span>Windows</span>
            <span>Mac</span>
            <span>Linux</span>
            <span>Android</span>
          </div>
        </div>
      </div>
      <div className="site-footer__bottom">
        <p>© {new Date().getFullYear()} saudult.xyz</p>
      </div>
    </footer>
  );
}
