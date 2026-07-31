import { createClient } from "@supabase/supabase-js";
import { mediaUrl } from "./media";
import type { Game, GameData, GameListItem } from "./types";

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
    coverUrl: mediaUrl(row.cover_path),
    galleryUrls: data.gallery.map((p) => mediaUrl(p)).filter(Boolean) as string[],
    publishedAt: row.published_at,
    updatedAt: row.updated_at,
    ...data,
  };
}

function mapListItem(row: DbRow): GameListItem {
  const data = normalizeData(row.data);
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    metaTitle: row.meta_title,
    metaDescription: row.meta_description,
    coverUrl: mediaUrl(row.cover_path),
    userRating: data.userRating,
    siteRating: data.siteRating,
    platforms: data.platforms,
    genres: data.genres,
    version: data.version,
    publishedAt: row.published_at,
    updatedAt: row.updated_at,
  };
}

export async function getGames(): Promise<GameListItem[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("games_public")
    .select("id, slug, title, meta_title, meta_description, cover_path, published_at, updated_at, data")
    .order("published_at", { ascending: false });

  if (error || !data) return [];
  return data.map((row) => mapListItem(row as DbRow));
}

export async function getGameBySlug(slug: string): Promise<Game | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("games_public")
    .select("id, slug, title, meta_title, meta_description, cover_path, published_at, updated_at, data")
    .eq("slug", slug)
    .single();

  if (error || !data) return null;
  return mapGame(data as DbRow);
}

export async function getRelatedGames(game: Game, limit = 4): Promise<GameListItem[]> {
  const all = await getGames();
  const genreSet = new Set(game.genres);
  return all
    .filter((g) => g.id !== game.id)
    .map((g) => ({ g, score: g.genres.filter((x) => genreSet.has(x)).length }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.g);
}

export async function getAllGenres(): Promise<string[]> {
  const games = await getGames();
  const set = new Set<string>();
  for (const g of games) for (const genre of g.genres) set.add(genre);
  return ["All", ...Array.from(set).sort()];
}

export async function getAllPlatforms(): Promise<string[]> {
  const games = await getGames();
  const set = new Set<string>();
  for (const g of games) for (const p of g.platforms) set.add(p);
  return ["All", ...Array.from(set).sort()];
}

export function getGamesByGenre(games: GameListItem[], genre: string): GameListItem[] {
  if (genre === "All") return games;
  return games.filter((g) => g.genres.includes(genre));
}

export function getGamesByPlatform(games: GameListItem[], platform: string): GameListItem[] {
  if (platform === "All") return games;
  return games.filter((g) =>
    g.platforms.some((p) => p.toLowerCase() === platform.toLowerCase()),
  );
}
