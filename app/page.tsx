import { GameImage } from "@/components/GameImage";
import Link from "next/link";
import { BrowseSection } from "@/components/BrowseSection";
import { getAllGenres, getAllPlatforms, getGames } from "@/lib/games";

export default async function HomePage() {
  const games = await getGames();
  const genres = await getAllGenres();
  const platforms = await getAllPlatforms();
  const featured = games[0];

  return (
    <>
      <section className="hero">
        <div className="hero__media">
          {featured?.coverUrl ? (
            <GameImage
              src={featured.coverUrl}
              alt={featured.title}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          ) : (
            <div className="hero__placeholder" />
          )}
          <div className="hero__veil" />
        </div>
        <div className="hero__content">
          <h1 className="hero__brand">
            S<span>Adult</span>
          </h1>
          <p className="hero__line">
            Free adult game downloads — Windows, Mac, Linux & Android builds,
            screenshots, and direct mirror links.
          </p>
          <div className="hero__actions">
            <a href="#browse" className="btn btn--primary">
              Browse games
            </a>
            {featured && (
              <Link href={`/game/${featured.slug}`} className="btn btn--ghost">
                Latest upload
              </Link>
            )}
          </div>
          {games.length === 0 && (
            <p className="hero__hint">
              Catalog empty — run the scraper backend to populate games.
            </p>
          )}
        </div>
      </section>

      <BrowseSection games={games} genres={genres} platforms={platforms} />
    </>
  );
}
