/** Public site config — used for SEO, sitemap, and AdSense */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://saudult.xyz"
).replace(/\/$/, "");

export const SITE_NAME = "SAdult";

export const SITE_DESCRIPTION =
  "Download free adult games, visual novels and RPGs for Windows, Mac, Linux and Android. Browse by genre, platform and tags at saudult.xyz.";

export const ADSENSE_CLIENT = "ca-pub-3830176311793296";

export const GOOGLE_SITE_VERIFICATION = process.env.GOOGLE_SITE_VERIFICATION ?? "";
