import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GameCard } from "@/components/GameCard";
import { getGameBySlug, getGames, getRelatedGames } from "@/lib/games";
import { gameImageAlt } from "@/lib/media";
import type { PlatformDownloads } from "@/lib/types";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const games = await getGames();
  return games.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const game = await getGameBySlug(slug);
  if (!game) return { title: "Not found" };
  return {
    title: game.metaTitle ?? game.title,
    description: game.metaDescription ?? game.overview.slice(0, 160),
    openGraph: {
      title: game.metaTitle ?? game.title,
      description: game.metaDescription ?? game.overview.slice(0, 160),
      images: game.coverUrl ? [{ url: game.coverUrl, alt: gameImageAlt(game.title) }] : [],
    },
  };
}

const PLATFORM_LABELS: Record<string, string> = {
  windows: "Windows",
  mac: "macOS",
  linux: "Linux",
  android: "Android",
};

export default async function GamePage({ params }: Props) {
  const { slug } = await params;
  const game = await getGameBySlug(slug);
  if (!game) notFound();

  const related = await getRelatedGames(game);
  const rating = game.siteRating ?? game.userRating;
  const cover = game.coverUrl ?? "/placeholder-game.webp";
  const alt = gameImageAlt(game.title);

  return (
    <>
      <section className="game-hero">
        <div className="game-hero__cover">
          <Image
            src={cover}
            alt={alt}
            fill
            priority
            sizes="(max-width: 800px) 100vw, 420px"
          />
        </div>
        <div className="game-hero__body">
          <h1>{game.title}</h1>
          {game.developer && <p className="game-hero__byline">by {game.developer}</p>}
          <div className="game-hero__tags">
            {game.version && <span className="tag tag--accent">{game.version}</span>}
            {game.platforms.map((p) => (
              <span key={p} className="tag tag--platform">
                {p}
              </span>
            ))}
            {game.genres.slice(0, 4).map((g) => (
              <span key={g} className="tag">
                {g}
              </span>
            ))}
          </div>
          <p className="game-hero__desc">{game.overview}</p>
          <div className="game-hero__stats">
            {rating !== null && (
              <div>
                <strong>{rating.toFixed(1)}</strong>
                Rating
              </div>
            )}
            <div>
              <strong>{game.viewsCount.toLocaleString()}</strong>
              Views
            </div>
            <div>
              <strong>{game.likesCount}</strong>
              Likes
            </div>
            {game.publishedAt && (
              <div>
                <strong>{new Date(game.publishedAt).toLocaleDateString()}</strong>
                Updated
              </div>
            )}
          </div>
          <a href="#downloads" className="btn btn--primary">
            Download
          </a>
        </div>
      </section>

      {game.galleryUrls.length > 0 && (
        <section className="section gallery-section">
          <div className="section__head">
            <h2>Screenshots</h2>
          </div>
          <div className="gallery-grid">
            {game.galleryUrls.map((src, i) => (
              <figure key={src} className="gallery-grid__item">
                <Image
                  src={src}
                  alt={alt}
                  width={768}
                  height={396}
                  sizes="(max-width: 768px) 100vw, 380px"
                  className="h-auto w-full"
                />
              </figure>
            ))}
          </div>
        </section>
      )}

      <section id="downloads" className="section downloads-section">
        <div className="section__head">
          <h2>Downloads</h2>
          <p>Choose your platform and preferred mirror.</p>
        </div>
        <div className="downloads-grid">
          {(Object.keys(PLATFORM_LABELS) as Array<keyof PlatformDownloads>).map(
            (platform) => {
              const links = game.downloads[platform] ?? [];
              if (links.length === 0) return null;
              return (
                <div key={platform} className="download-block">
                  <h3>{PLATFORM_LABELS[platform]}</h3>
                  <div className="download-block__links">
                    {links.map((link) => (
                      <a
                        key={link.url}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn--download"
                      >
                        {link.provider}
                      </a>
                    ))}
                  </div>
                </div>
              );
            },
          )}
        </div>
        {game.installation && (
          <div className="info-box">
            <h3>Installation</h3>
            <p>{game.installation}</p>
          </div>
        )}
      </section>

      <section className="section tabs-section">
        <div className="tabs-grid">
          <div className="info-panel">
            <h2>Info</h2>
            <dl className="info-list">
              {game.developer && (
                <>
                  <dt>Developer</dt>
                  <dd>{game.developer}</dd>
                </>
              )}
              {game.version && (
                <>
                  <dt>Version</dt>
                  <dd>{game.version}</dd>
                </>
              )}
              {game.language && (
                <>
                  <dt>Language</dt>
                  <dd>{game.language}</dd>
                </>
              )}
              {game.censored !== null && (
                <>
                  <dt>Censored</dt>
                  <dd>{game.censored ? "Yes" : "No"}</dd>
                </>
              )}
            </dl>
            {game.supportLinks.length > 0 && (
              <div className="support-links">
                <h3>Support developer</h3>
                <div className="support-links__row">
                  {game.supportLinks.map((link) => (
                    <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer">
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {(game.goodPoints.length > 0 || game.badPoints.length > 0) && (
            <div className="review-panel">
              {rating !== null && (
                <div className="review-score">
                  <span className="review-score__value">{rating.toFixed(1)}</span>
                  <span className="review-score__label">Average</span>
                </div>
              )}
              {game.goodPoints.length > 0 && (
                <div className="review-col review-col--good">
                  <h3>Good</h3>
                  <ul>
                    {game.goodPoints.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                </div>
              )}
              {game.badPoints.length > 0 && (
                <div className="review-col review-col--bad">
                  <h3>Bad</h3>
                  <ul>
                    {game.badPoints.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {game.tags.length > 0 && (
        <section className="section tags-section">
          <h2>Tags</h2>
          <div className="tags-cloud">
            {game.tags.map((tag) => (
              <span key={tag} className="tag tag--small">
                {tag}
              </span>
            ))}
          </div>
        </section>
      )}

      {game.changelog && (
        <section className="section changelog-section">
          <h2>Changelog</h2>
          <div className="changelog-box">
            <p>{game.changelog}</p>
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="section related">
          <div className="section__head">
            <h2>Related games</h2>
            <p>More titles in similar genres.</p>
          </div>
          <div className="game-grid">
            {related.map((item) => (
              <GameCard key={item.id} game={item} />
            ))}
          </div>
        </section>
      )}

      <div className="game-page__back">
        <Link href="/#browse" className="btn btn--ghost">
          ← Back to browse
        </Link>
      </div>
    </>
  );
}
