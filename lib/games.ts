import type { FacetItem, Game, GameData, GameListItem, GamesPage } from "./types";
import { PAGE_SIZE } from "./constants";
import { mediaUrl, resolveCoverUrl } from "./media";
import { createClient } from "@supabase/supabase-js";

export { PAGE_SIZE } from "./constants";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

type DbRow = {
  id: string;
  slug: string;
  title: string;
  meta_title: string | null;
  meta_description: string | null;
  cover_path: string | null;
  published_at: string | null;
  updated_at: string;
  data: GameData;
};

const LIST_SELECT =
  "id, slug, title, meta_title, meta_description, cover_path, published_at, updated_at, data";

const emptyDownloads: GameData["downloads"] = {
  windows: [],
  mac: [],
  linux: [],
  android: [],
};

function normalizeData(raw: Partial<GameData> | null): GameData {
  const d = raw ?? {};
  return {
    userRating: d.userRating ?? null,
    siteRating: d.siteRating ?? null,
    commentsCount: d.commentsCount ?? 0,
    viewsCount: d.viewsCount ?? 0,
    likesCount: d.likesCount ?? 0,
    categories: d.categories ?? [],
    platforms: d.platforms ?? [],
    genres: d.genres ?? [],
    tags: d.tags ?? [],
    gallery: d.gallery ?? [],
    overview: d.overview ?? "",
    infoHtml: d.infoHtml ?? "",
    changelog: d.changelog ?? "",
    developer: d.developer ?? null,
    version: d.version ?? null,
    language: d.language ?? null,
    censored: d.censored ?? null,
    installation: d.installation ?? null,
    supportLinks: d.supportLinks ?? [],
    downloads: d.downloads ?? emptyDownloads,
    goodPoints: d.goodPoints ?? [],
    badPoints: d.badPoints ?? [],
    ratingCriteria: d.ratingCriteria ?? {},
  };
}

function mapGame(row: DbRow): Game {
  const data = normalizeData(row.data);
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    metaTitle: row.meta_title,
    metaDescription: row.meta_description,
    coverUrl: resolveCoverUrl(row.cover_path, data.gallery),
    galleryUrls: data.gallery.map((p) => mediaUrl(p)).filter(Boolean) as string[],
    publishedAt: row.published_at,
    updatedAt: row.updated_at,
    ...data,
  };
}

function mapListItem(row: DbRow): GameListItem {
  const data = normalizeData(row.data);
  const galleryUrls = data.gallery.map((p) => mediaUrl(p)).filter(Boolean) as string[];
  const coverUrl = resolveCoverUrl(row.cover_path, data.gallery);
  const coverFallbackUrls = galleryUrls.filter((url) => url !== coverUrl);

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    metaTitle: row.meta_title,
    metaDescription: row.meta_description,
    coverUrl,
    coverFallbackUrls,
    userRating: data.userRating,
    siteRating: data.siteRating,
    platforms: data.platforms,
    genres: data.genres,
    tags: data.tags,
    version: data.version,
    publishedAt: row.published_at,
    updatedAt: row.updated_at,
  };
}

export type GameFilters = {
  genre?: string;
  platform?: string;
  tag?: string;
  page?: number;
  pageSize?: number;
};

function applyFilters(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query: any,
  filters: GameFilters,
) {
  const genre = filters.genre && filters.genre !== "All" ? filters.genre : null;
  const platform =
    filters.platform && filters.platform !== "All" ? filters.platform : null;
  const tag = filters.tag && filters.tag !== "All" ? filters.tag : null;

  if (genre) query = query.filter("data->genres", "cs", JSON.stringify([genre]));
  if (platform) query = query.filter("data->platforms", "cs", JSON.stringify([platform]));
  if (tag) query = query.filter("data->tags", "cs", JSON.stringify([tag]));
  return query;
}

/** Paginated catalog — never load the full table into the Worker. */
export async function getGamesPage(filters: GameFilters = {}): Promise<GamesPage> {
  const page = Math.max(1, filters.page ?? 1);
  const pageSize = Math.min(48, Math.max(1, filters.pageSize ?? PAGE_SIZE));
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  if (!supabase) {
    return { games: [], total: 0, page, pageSize, hasMore: false };
  }

  let query = supabase
    .from("games_public")
    .select(LIST_SELECT, { count: "exact" })
    .order("published_at", { ascending: false })
    .range(from, to);

  query = applyFilters(query, filters);

  const { data, error, count } = await query;
  if (error || !data) {
    console.error("getGamesPage:", error?.message);
    return { games: [], total: 0, page, pageSize, hasMore: false };
  }

  const total = count ?? 0;
  return {
    games: data.map((row) => mapListItem(row as DbRow)),
    total,
    page,
    pageSize,
    hasMore: to + 1 < total,
  };
}

/** Hero slider: 4 games with covers, rotated by day (same set all day, new set tomorrow). */
const HERO_POOL = 48;
const HERO_SLIDE_COUNT = 4;

export async function getHeroSlides(): Promise<GameListItem[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("games_public")
    .select(LIST_SELECT)
    .not("cover_path", "is", null)
    .order("published_at", { ascending: false })
    .limit(HERO_POOL);

  if (error || !data?.length) {
    const fallback = await getGamesPage({ page: 1, pageSize: HERO_SLIDE_COUNT });
    return fallback.games.filter((g) => g.coverUrl);
  }

  const items = (data as DbRow[])
    .map((row) => mapListItem(row))
    .filter((g) => g.coverUrl);

  if (items.length === 0) return [];

  const count = Math.min(HERO_SLIDE_COUNT, items.length);
  const dayIndex = Math.floor(Date.now() / 86_400_000);
  const maxStart = Math.max(1, items.length - count + 1);
  const start = dayIndex % maxStart;

  return items.slice(start, start + count);
}

/** Latest game for hero — single row. */
export async function getFeaturedGame(): Promise<GameListItem | null> {
  const { games } = await getGamesPage({ page: 1, pageSize: 1 });
  return games[0] ?? null;
}

export async function getGameBySlug(slug: string): Promise<Game | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("games_public")
    .select(LIST_SELECT)
    .eq("slug", slug)
    .single();

  if (error || !data) return null;
  return mapGame(data as DbRow);
}

export async function getRelatedGames(game: Game, limit = 4): Promise<GameListItem[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("games_public")
    .select(LIST_SELECT)
    .neq("id", game.id)
    .order("published_at", { ascending: false })
    .limit(48);

  if (error || !data) return [];
  const genreSet = new Set(game.genres);
  return data
    .map((row) => mapListItem(row as DbRow))
    .map((g) => ({ g, score: g.genres.filter((x) => genreSet.has(x)).length }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.g);
}

function emptyFacets() {
  return { tags: [] as FacetItem[], genres: [] as FacetItem[], platforms: [] as FacetItem[], total: 0 };
}

function normalizeFacetList(raw: unknown): FacetItem[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const row = item as { name?: unknown; count?: unknown };
      const name = typeof row.name === "string" ? row.name.trim() : "";
      const count = typeof row.count === "number" ? row.count : Number(row.count);
      if (!name || !Number.isFinite(count)) return null;
      return { name, count };
    })
    .filter(Boolean) as FacetItem[];
}

/** Prefer Postgres RPC; fallback scans slim pages if migration not applied yet. */
export async function getCatalogFacets() {
  if (!supabase) return emptyFacets();

  const { data, error } = await supabase.rpc("get_catalog_facets");
  if (!error && data) {
    const payload = data as {
      tags?: unknown;
      genres?: unknown;
      platforms?: unknown;
      total?: number;
    };
    return {
      tags: normalizeFacetList(payload.tags),
      genres: normalizeFacetList(payload.genres),
      platforms: normalizeFacetList(payload.platforms),
      total: typeof payload.total === "number" ? payload.total : 0,
    };
  }

  return getCatalogFacetsFallback();
}

async function getCatalogFacetsFallback() {
  if (!supabase) return emptyFacets();

  const tagMap = new Map<string, number>();
  const genreMap = new Map<string, number>();
  const platformMap = new Map<string, number>();
  let total = 0;
  const chunk = 500;

  for (let from = 0; ; from += chunk) {
    const { data, error, count } = await supabase
      .from("games_public")
      .select("data", { count: from === 0 ? "exact" : undefined })
      .range(from, from + chunk - 1);

    if (error || !data?.length) break;
    if (from === 0) total = count ?? 0;

    for (const row of data) {
      const d = (row as { data?: GameData }).data;
      for (const t of d?.tags ?? []) tagMap.set(t, (tagMap.get(t) ?? 0) + 1);
      for (const t of d?.genres ?? []) genreMap.set(t, (genreMap.get(t) ?? 0) + 1);
      for (const t of d?.platforms ?? []) platformMap.set(t, (platformMap.get(t) ?? 0) + 1);
    }
    if (data.length < chunk) break;
  }

  const toSorted = (map: Map<string, number>): FacetItem[] =>
    [...map.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

  return {
    tags: toSorted(tagMap),
    genres: toSorted(genreMap),
    platforms: toSorted(platformMap),
    total,
  };
}
