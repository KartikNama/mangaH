export type Manga = {
  id: string;
  slug: string;
  title: string;
  author: string;
  description: string;
  cover: string;
  genres: string[];
  pages: string[];
  status: "Completed";
  year: number;
  readingTime: string;
};
