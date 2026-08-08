import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { BrowseSection } from "@/components/BrowseSection";
import { HeroSlider } from "@/components/HeroSlider";
import { getGamesPage, getHeroSlides } from "@/lib/games";
import { PAGE_SIZE } from "@/lib/constants";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: `${SITE_NAME} — Free adult game downloads`,
  description: SITE_DESCRIPTION,
  alternates: { canonical: SITE_URL },
  openGraph: {
    url: SITE_URL,
    title: `${SITE_NAME} — Free adult game downloads`,
    description: SITE_DESCRIPTION,
  },
};

type Props = {
  searchParams: Promise<{ genre?: string; platform?: string; tag?: string }>;
};

export default async function HomePage({ searchParams }: Props) {
  const params = await searchParams;
  const genre = params.genre ?? "All";
  const platform = params.platform ?? "All";
  const tag = params.tag ?? "All";

  const [heroGames, page] = await Promise.all([
    getHeroSlides(),
    getGamesPage({
      page: 1,
      pageSize: PAGE_SIZE,
      genre,
      platform,
      tag,
    }),
  ]);

  const featured = heroGames[0];

  return (
    <>
      <section className="hero">
        <div className="hero__media">
          <HeroSlider games={heroGames} />
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
                Featured game
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
