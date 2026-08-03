"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { FacetItem, GameListItem, GamesPage } from "@/lib/types";
import { PAGE_SIZE, TAG_PREVIEW } from "@/lib/constants";
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
  const [tagsExpanded, setTagsExpanded] = useState(false);
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

  // Keep shareable URL in sync (non-blocking)
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

  const visibleTags = useMemo(() => {
    if (tagsExpanded || facets.tags.length <= TAG_PREVIEW) return facets.tags;
    return facets.tags.slice(0, TAG_PREVIEW);
  }, [facets.tags, tagsExpanded]);

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

      <div id="platforms" className="filter-bar" role="tablist" aria-label="Filter by platform">
        <button
          type="button"
          role="tab"
          aria-selected={activePlatform === "All"}
          className={activePlatform === "All" ? "filter-chip is-active" : "filter-chip"}
          onClick={() => setActivePlatform("All")}
        >
          All
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

      <div id="genres" className="filter-bar filter-bar--secondary" role="tablist" aria-label="Filter by genre">
        <button
          type="button"
          role="tab"
          aria-selected={activeGenre === "All"}
          className={activeGenre === "All" ? "filter-chip is-active" : "filter-chip"}
          onClick={() => setActiveGenre("All")}
        >
          All genres
        </button>
        {facets.genres.map((g) => (
          <button
            key={g.name}
            type="button"
            role="tab"
            aria-selected={activeGenre === g.name}
            className={activeGenre === g.name ? "filter-chip is-active" : "filter-chip"}
            onClick={() => setActiveGenre(g.name)}
          >
            {g.name}
            <span className="filter-chip__count">{g.count}</span>
          </button>
        ))}
      </div>

      <div id="tags" className="tags-filter">
        <div className="tags-filter__head">
          <h3>Tags</h3>
          {facets.tags.length > TAG_PREVIEW && (
            <button
              type="button"
              className="tags-filter__toggle"
              onClick={() => setTagsExpanded((v) => !v)}
              aria-expanded={tagsExpanded}
            >
              {tagsExpanded ? "Hide tags" : `Show all tags (${facets.tags.length})`}
            </button>
          )}
        </div>
        <div className="filter-bar filter-bar--tags" role="tablist" aria-label="Filter by tag">
          <button
            type="button"
            role="tab"
            aria-selected={activeTag === "All"}
            className={activeTag === "All" ? "filter-chip is-active" : "filter-chip"}
            onClick={() => setActiveTag("All")}
          >
            All tags
          </button>
          {visibleTags.map((t) => (
            <button
              key={t.name}
              type="button"
              role="tab"
              aria-selected={activeTag === t.name}
              className={activeTag === t.name ? "filter-chip is-active" : "filter-chip"}
              onClick={() => setActiveTag(t.name)}
              title={`${t.count} games`}
            >
              {t.name}
              <span className="filter-chip__count">{t.count}</span>
            </button>
          ))}
        </div>
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
          No games match these filters yet. Try clearing filters or check back after the scraper runs.
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
