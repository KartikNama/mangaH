import { Suspense } from "react";
import { GameImage } from "@/components/GameImage";
import Link from "next/link";
import { BrowseSection } from "@/components/BrowseSection";
import { getFeaturedGame, getGamesPage } from "@/lib/games";
import { PAGE_SIZE } from "@/lib/constants";

type Props = {
  searchParams: Promise<{ genre?: string; platform?: string; tag?: string }>;
};

export default async function HomePage({ searchParams }: Props) {
  const params = await searchParams;
  const genre = params.genre ?? "All";
  const platform = params.platform ?? "All";
  const tag = params.tag ?? "All";

  const [featured, page] = await Promise.all([
    getFeaturedGame(),
    getGamesPage({
      page: 1,
      pageSize: PAGE_SIZE,
      genre,
      platform,
      tag,
    }),
  ]);

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
          {page.total === 0 && (
            <p className="hero__hint">
              Catalog empty — run the scraper backend to populate games.
            </p>
          )}
        </div>
      </section>

      <Suspense fallback={<div className="section browse">Loading catalog…</div>}>
        <BrowseSection
          initialGames={page.games}
          initialTotal={page.total}
          initialHasMore={page.hasMore}
          initialGenre={genre}
          initialPlatform={platform}
          initialTag={tag}
        />
      </Suspense>
    </>
  );
}
