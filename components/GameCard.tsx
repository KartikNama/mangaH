import { GameImage } from "@/components/GameImage";
import Link from "next/link";
import { gameImageAlt } from "@/lib/media";
import type { GameListItem } from "@/lib/types";

type Props = {
  game: GameListItem;
  priority?: boolean;
};

const PLATFORM_ICONS: Record<string, string> = {
  windows: "Win",
  macos: "Mac",
  linux: "Linux",
  android: "Android",
  ios: "iOS",
};

export function GameCard({ game, priority = false }: Props) {
  const rating = game.siteRating ?? game.userRating;
  const cover = game.coverUrl ?? "/placeholder-game.webp";
  const alt = gameImageAlt(game.title);

  return (
    <Link href={`/game/${game.slug}`} className="game-card">
      <div className="game-card__art">
        <GameImage
          src={cover}
          alt={alt}
          fill
          sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 240px"
          className="game-card__img"
          priority={priority}
        />
        {rating !== null && (
          <span className="game-card__rating">{rating.toFixed(1)}</span>
        )}
        {game.version && <span className="game-card__version">{game.version}</span>}
      </div>
      <div className="game-card__meta">
        <h3>{game.title}</h3>
        <div className="game-card__platforms">
          {game.platforms.slice(0, 4).map((p) => (
            <span key={p}>{PLATFORM_ICONS[p.toLowerCase()] ?? p}</span>
          ))}
        </div>
        <ul className="game-card__genres">
          {game.genres.slice(0, 3).map((g) => (
            <li key={g}>{g}</li>
          ))}
        </ul>
      </div>
    </Link>
  );
}
