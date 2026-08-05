export const GAME_PLACEHOLDER = "/placeholder-game.svg";

const base = process.env.NEXT_PUBLIC_MEDIA_URL?.replace(/\/$/, "") ?? "";

export function mediaUrl(relativePath: string | null | undefined): string | null {
  if (!relativePath) return null;
  if (relativePath.startsWith("http")) return relativePath;
  const path = relativePath.replace(/^\/+/, "");
  if (!base) return `/media/${path}`;
  return `${base}/${path}`;
}

/** Prefer cover; fall back to first gallery image saved by the scraper */
export function resolveCoverUrl(
  coverPath: string | null | undefined,
  galleryPaths: string[] = [],
): string | null {
  return mediaUrl(coverPath) ?? mediaUrl(galleryPaths[0]) ?? null;
}

export function gameImageAlt(title: string): string {
  return title;
}
