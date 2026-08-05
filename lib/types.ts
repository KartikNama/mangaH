export type DownloadLink = {
  provider: string;
  url: string;
};

export type PlatformDownloads = {
  windows: DownloadLink[];
  mac: DownloadLink[];
  linux: DownloadLink[];
  android: DownloadLink[];
};

export type SupportLink = {
  label: string;
  url: string;
};

export type RatingCriteria = {
  story?: number;
  visual?: number;
  engagement?: number;
  coreLoop?: number;
};

export type GameData = {
  userRating: number | null;
  siteRating: number | null;
  commentsCount: number;
  viewsCount: number;
  likesCount: number;
  categories: string[];
  platforms: string[];
  genres: string[];
  tags: string[];
  gallery: string[];
  overview: string;
  infoHtml: string;
  changelog: string;
  developer: string | null;
  version: string | null;
  language: string | null;
  censored: boolean | null;
  installation: string | null;
  supportLinks: SupportLink[];
  downloads: PlatformDownloads;
  goodPoints: string[];
  badPoints: string[];
  ratingCriteria: RatingCriteria;
};

export type Game = {
  id: string;
  slug: string;
  title: string;
  metaTitle: string | null;
  metaDescription: string | null;
  coverUrl: string | null;
  galleryUrls: string[];
  publishedAt: string | null;
  updatedAt: string;
} & GameData;

export type GameListItem = {
  id: string;
  slug: string;
  title: string;
  metaTitle: string | null;
  metaDescription: string | null;
  coverUrl: string | null;
  /** Gallery URLs to try when cover is missing or a gray placeholder */
  coverFallbackUrls: string[];
  userRating: number | null;
  siteRating: number | null;
  platforms: string[];
  genres: string[];
  tags: string[];
  version: string | null;
  publishedAt: string | null;
  updatedAt: string;
};

export type FacetItem = {
  name: string;
  count: number;
};

export type GamesPage = {
  games: GameListItem[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
};
