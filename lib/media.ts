const base = process.env.NEXT_PUBLIC_MEDIA_URL?.replace(/\/$/, "") ?? "";

export function mediaUrl(relativePath: string | null | undefined): string | null {
  if (!relativePath) return null;
  if (relativePath.startsWith("http")) return relativePath;
  const path = relativePath.replace(/^\/+/, "");
  if (!base) return `/media/${path}`;
  return `${base}/${path}`;
}

/** All game images use the game title as alt text */
export function gameImageAlt(title: string): string {
  return title;
}
