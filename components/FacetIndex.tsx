"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { FacetItem } from "@/lib/types";

type Props = {
  title: string;
  description: string;
  items: FacetItem[];
  filterParam: "genre" | "tag";
  placeholder?: string;
};

export function FacetIndex({ title, description, items, filterParam, placeholder }: Props) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) => item.name.toLowerCase().includes(q));
  }, [items, query]);

  const totalGames = items.reduce((sum, i) => sum + i.count, 0);

  return (
    <section className="facet-index section">
      <div className="section__head">
        <h1>{title}</h1>
        <p>{description}</p>
        <p className="facet-index__meta">
          {items.length.toLocaleString()} {filterParam === "genre" ? "genres" : "tags"} ·{" "}
          {totalGames.toLocaleString()} total listings
        </p>
      </div>

      <div className="facet-index__toolbar">
        <input
          type="search"
          className="facet-index__search"
          placeholder={placeholder ?? `Search ${filterParam}s…`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label={`Search ${filterParam}s`}
        />
        <Link href="/#browse" className="btn btn--ghost facet-index__back">
          All games
        </Link>
      </div>

      {filtered.length === 0 ? (
        <p className="facet-index__empty">No matches for &ldquo;{query}&rdquo;.</p>
      ) : (
        <ul className="facet-grid">
          {filtered.map((item) => (
            <li key={item.name}>
              <Link
                href={`/?${filterParam}=${encodeURIComponent(item.name)}#browse`}
                className="facet-card"
              >
                <span className="facet-card__name">{item.name}</span>
                <span className="facet-card__count">
                  {item.count.toLocaleString()} game{item.count === 1 ? "" : "s"}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
