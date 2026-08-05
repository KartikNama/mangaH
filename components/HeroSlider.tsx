"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { GameImage } from "@/components/GameImage";
import { gameImageAlt } from "@/lib/media";
import type { GameListItem } from "@/lib/types";

type Props = {
  games: GameListItem[];
  intervalMs?: number;
};

export function HeroSlider({ games, intervalMs = 6000 }: Props) {
  const [index, setIndex] = useState(0);
  const count = games.length;

  useEffect(() => {
    if (count <= 1) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % count);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [count, intervalMs]);

  if (count === 0) {
    return <div className="hero__placeholder" aria-hidden />;
  }

  const active = games[index] ?? games[0];

  return (
    <>
      <div className="hero__slides" aria-live="polite">
        {games.map((game, i) => (
          <div
            key={game.id}
            className={`hero__slide${i === index ? " is-active" : ""}`}
            aria-hidden={i !== index}
          >
            {game.coverUrl ? (
              <GameImage
                src={game.coverUrl}
                fallbackSrcs={game.coverFallbackUrls}
                alt={gameImageAlt(game.title)}
                fill
                priority={i === 0}
                sizes="100vw"
                className="object-cover"
              />
            ) : (
              <div className="hero__placeholder" />
            )}
          </div>
        ))}
      </div>
      <div className="hero__veil" />

      {count > 1 && (
        <div className="hero__dots" role="tablist" aria-label="Featured games">
          {games.map((game, i) => (
            <button
              key={game.id}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Show ${game.title}`}
              className={i === index ? "hero__dot is-active" : "hero__dot"}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      )}

      <div className="hero__featured">
        <span className="hero__featured-label">Featured today</span>
        <Link href={`/game/${active.slug}`} className="hero__featured-title">
          {active.title}
        </Link>
        {active.genres[0] && <span className="hero__featured-meta">{active.genres[0]}</span>}
      </div>
    </>
  );
}
