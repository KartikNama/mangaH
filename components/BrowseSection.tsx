"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { FacetItem, GameListItem, GamesPage } from "@/lib/types";
import { PAGE_SIZE } from "@/lib/constants";
import { GameCard } from "./GameCard";

type Facets = {
  tags: FacetItem[];
  genres: FacetItem[];
  platforms: FacetItem[];
  total: number;
};

type Props = {
  initialGames: GameListItem[];
  initialTotal: number;
  initialHasMore: boolean;
  initialGenre?: string;
  initialPlatform?: string;
  initialTag?: string;
};

const emptyFacets: Facets = { tags: [], genres: [], platforms: [], total: 0 };

export function BrowseSection({
  initialGames,
  initialTotal,
  initialHasMore,
  initialGenre = "All",
  initialPlatform = "All",
  initialTag = "All",
}: Props) {
  const [games, setGames] = useState(initialGames);
  const [total, setTotal] = useState(initialTotal);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadingFilter, setLoadingFilter] = useState(false);
  const [facets, setFacets] = useState<Facets>(emptyFacets);
  const [activeGenre, setActiveGenre] = useState(initialGenre);
  const [activePlatform, setActivePlatform] = useState(initialPlatform);
  const [activeTag, setActiveTag] = useState(initialTag);
  const skipFirstFetch = useRef(true);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/games?kind=facets")
      .then((r) => {
        if (!r.ok) throw new Error("facets failed");
        return r.json();
      })
      .then((data: Facets) => {
        if (!cancelled) setFacets(data);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const fetchPage = useCallback(
    async (
      pageNum: number,
      replace: boolean,
      filters: { genre: string; platform: string; tag: string },
    ) => {
      const params = new URLSearchParams({
        page: String(pageNum),
        pageSize: String(PAGE_SIZE),
      });
      if (filters.genre !== "All") params.set("genre", filters.genre);
      if (filters.platform !== "All") params.set("platform", filters.platform);
      if (filters.tag !== "All") params.set("tag", filters.tag);

      const res = await fetch(`/api/games?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to load games");
      const data = (await res.json()) as GamesPage;

      setGames((prev) => (replace ? data.games : [...prev, ...data.games]));
      setTotal(data.total);
      setHasMore(data.hasMore);
      setPage(data.page);
    },
    [],
  );

  useEffect(() => {
    if (skipFirstFetch.current) {
      skipFirstFetch.current = false;
      return;
    }
    let cancelled = false;
    setLoadingFilter(true);
    fetchPage(1, true, {
      genre: activeGenre,
      platform: activePlatform,
      tag: activeTag,
    })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoadingFilter(false);
      });
    return () => {
      cancelled = true;
    };
  }, [activeGenre, activePlatform, activeTag, fetchPage]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (activeGenre !== "All") params.set("genre", activeGenre);
    if (activePlatform !== "All") params.set("platform", activePlatform);
    if (activeTag !== "All") params.set("tag", activeTag);
    const qs = params.toString();
    const next = qs ? `/?${qs}` : "/";
    if (typeof window !== "undefined" && window.location.pathname + window.location.search !== next) {
      window.history.replaceState(null, "", next);
    }
  }, [activeGenre, activePlatform, activeTag]);

  const onLoadMore = async () => {
    if (!hasMore || loadingMore) return;
    setLoadingMore(true);
    try {
      await fetchPage(page + 1, false, {
        genre: activeGenre,
        platform: activePlatform,
        tag: activeTag,
      });
    } catch {
      /* keep list */
    } finally {
      setLoadingMore(false);
    }
  };

  const clearFilters = () => {
    setActiveGenre("All");
    setActivePlatform("All");
    setActiveTag("All");
  };

  const hasActiveFilter =
    activeGenre !== "All" || activePlatform !== "All" || activeTag !== "All";

  return (
    <section id="browse" className="browse section">
      <div className="section__head">
        <h2>Browse games</h2>
        <p>
          {total.toLocaleString()} games
          {hasActiveFilter ? " match your filters" : " in the catalog"}.
        </p>
      </div>

      <div className="browse__explore">
        <Link href="/genres" className="browse__explore-link">
          All genres
          {facets.genres.length > 0 && (
            <span className="browse__explore-count">{facets.genres.length}</span>
          )}
        </Link>
        <Link href="/tags" className="browse__explore-link">
          All tags
          {facets.tags.length > 0 && (
            <span className="browse__explore-count">{facets.tags.length}</span>
          )}
        </Link>
      </div>

      <div id="platforms" className="filter-bar" role="tablist" aria-label="Filter by platform">
        <button
          type="button"
          role="tab"
          aria-selected={activePlatform === "All"}
          className={activePlatform === "All" ? "filter-chip is-active" : "filter-chip"}
          onClick={() => setActivePlatform("All")}
        >
          All platforms
          <span className="filter-chip__count">{facets.total || total}</span>
        </button>
        {facets.platforms.map((p) => (
          <button
            key={p.name}
            type="button"
            role="tab"
            aria-selected={activePlatform === p.name}
            className={activePlatform === p.name ? "filter-chip is-active" : "filter-chip"}
            onClick={() => setActivePlatform(p.name)}
          >
            {p.name}
            <span className="filter-chip__count">{p.count}</span>
          </button>
        ))}
      </div>

      {hasActiveFilter && (
        <div className="browse__active">
          <span>
            Showing {total.toLocaleString()} result{total === 1 ? "" : "s"}
            {activePlatform !== "All" ? ` · ${activePlatform}` : ""}
            {activeGenre !== "All" ? ` · ${activeGenre}` : ""}
            {activeTag !== "All" ? ` · #${activeTag}` : ""}
          </span>
          <button type="button" className="browse__clear" onClick={clearFilters}>
            Clear filters
          </button>
        </div>
      )}

      <div className={`game-grid${loadingFilter ? " is-loading" : ""}`}>
        {games.map((game, i) => (
          <GameCard key={game.id} game={game} priority={i < 6} />
        ))}
      </div>

      {games.length === 0 && !loadingFilter && (
        <p className="browse__empty">
          No games match these filters yet. Try{" "}
          <Link href="/genres">genres</Link> or <Link href="/tags">tags</Link>, or check back
          after the scraper runs.
        </p>
      )}

      {hasMore && (
        <div className="browse__more">
          <button
            type="button"
            className="btn btn--primary"
            onClick={onLoadMore}
            disabled={loadingMore}
          >
            {loadingMore ? "Loading…" : `Load more (${games.length} of ${total})`}
          </button>
        </div>
      )}

      {!hasMore && games.length > 0 && (
        <p className="browse__end">All {total.toLocaleString()} matching games loaded.</p>
      )}
    </section>
  );
}
