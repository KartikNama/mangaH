import Image from "next/image";
import Link from "next/link";
import type { Manga } from "@/lib/types";

type Props = {
  manga: Manga;
  priority?: boolean;
};

export function MangaCard({ manga, priority = false }: Props) {
  return (
    <Link href={`/manga/${manga.slug}`} className="manga-card">
      <div className="manga-card__art">
        <Image
          src={manga.cover}
          alt={`${manga.title} cover`}
          fill
          sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 220px"
          className="manga-card__img"
          priority={priority}
        />
        <span className="manga-card__badge">{manga.status}</span>
      </div>
      <div className="manga-card__meta">
        <h3>{manga.title}</h3>
        <p>{manga.author}</p>
        <ul className="manga-card__genres">
          {manga.genres.slice(0, 2).map((g) => (
            <li key={g}>{g}</li>
          ))}
        </ul>
      </div>
    </Link>
  );
}
