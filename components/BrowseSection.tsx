"use client";

import { useMemo, useState } from "react";
import { genres, mangas } from "@/lib/mangas";
import { MangaCard } from "./MangaCard";

export function BrowseSection() {
  const [active, setActive] = useState<string>("All");

  const filtered = useMemo(() => {
    if (active === "All") return mangas;
    return mangas.filter((m) => m.genres.includes(active));
  }, [active]);

  return (
    <section id="browse" className="browse section">
      <div className="section__head">
        <h2>Browse titles</h2>
        <p>Every manga here is a full story — open it and read straight through.</p>
      </div>

      <div id="genres" className="genre-bar" role="tablist" aria-label="Filter by genre">
        {genres.map((genre) => (
          <button
            key={genre}
            type="button"
            role="tab"
            aria-selected={active === genre}
            className={active === genre ? "genre-chip is-active" : "genre-chip"}
            onClick={() => setActive(genre)}
          >
            {genre}
          </button>
        ))}
      </div>

      <div className="manga-grid">
        {filtered.map((manga, i) => (
          <MangaCard key={manga.id} manga={manga} priority={i < 4} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="browse__empty">No titles in this genre yet.</p>
      )}
    </section>
  );
}
