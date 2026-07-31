"use client";

import { useMemo, useState } from "react";
import type { GameListItem } from "@/lib/types";
import { getGamesByGenre, getGamesByPlatform } from "@/lib/games";
import { GameCard } from "./GameCard";

type Props = {
  games: GameListItem[];
  genres: string[];
  platforms: string[];
};

export function BrowseSection({ games, genres, platforms }: Props) {
  const [activeGenre, setActiveGenre] = useState("All");
  const [activePlatform, setActivePlatform] = useState("All");

  const filtered = useMemo(() => {
    let result = getGamesByGenre(games, activeGenre);
    result = getGamesByPlatform(result, activePlatform);
    return result;
  }, [games, activeGenre, activePlatform]);

  return (
    <section id="browse" className="browse section">
      <div className="section__head">
        <h2>Browse games</h2>
        <p>Latest builds with multi-platform download links, screenshots, and reviews.</p>
      </div>

      <div id="platforms" className="filter-bar" role="tablist" aria-label="Filter by platform">
        {platforms.map((platform) => (
          <button
            key={platform}
            type="button"
            role="tab"
            aria-selected={activePlatform === platform}
            className={activePlatform === platform ? "filter-chip is-active" : "filter-chip"}
            onClick={() => setActivePlatform(platform)}
          >
            {platform}
          </button>
        ))}
      </div>

      <div id="genres" className="filter-bar filter-bar--secondary" role="tablist" aria-label="Filter by genre">
        {genres.map((genre) => (
          <button
            key={genre}
            type="button"
            role="tab"
            aria-selected={activeGenre === genre}
            className={activeGenre === genre ? "filter-chip is-active" : "filter-chip"}
            onClick={() => setActiveGenre(genre)}
          >
            {genre}
          </button>
        ))}
      </div>

      <div className="game-grid">
        {filtered.map((game, i) => (
          <GameCard key={game.id} game={game} priority={i < 6} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="browse__empty">
          No games match these filters yet. Run the scraper to populate the catalog.
        </p>
      )}
    </section>
  );
}
