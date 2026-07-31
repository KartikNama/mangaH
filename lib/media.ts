const base = process.env.NEXT_PUBLIC_MEDIA_URL?.replace(/\/$/, "") ?? "";

export function mediaUrl(relativePath: string | null | undefined): string | null {
  if (!relativePath) return null;
  if (relativePath.startsWith("http")) return relativePath;
  if (!base) return `/${relativePath.replace(/^\/+/, "")}`;
  return `${base}/${relativePath.replace(/^\/+/, "")}`;
}

/** All game images use the game title as alt text */
export function gameImageAlt(title: string): string {
  return title;
}
