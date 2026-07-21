import type { Manga } from "./types";

/** Sample catalog — swap for API data later. Each title is one complete work (no chapters). */
export const mangas: Manga[] = [
  {
    id: "1",
    slug: "neon-alley-ghost",
    title: "Neon Alley Ghost",
    author: "Rina Sato",
    description:
      "A courier who can see the dead takes one last job through the glowing backstreets of Neo-Osaka. What starts as a simple delivery becomes a chase across rooftops, memory markets, and the people who refuse to stay buried.",
    cover:
      "https://images.unsplash.com/photo-1613376026476-ae0bd3bd7770?w=600&h=900&fit=crop&q=80",
    genres: ["Action", "Mystery", "Sci-Fi"],
    status: "Completed",
    year: 2024,
    readingTime: "18 min",
    pages: [
      "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=900&h=1350&fit=crop&q=80",
      "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=900&h=1350&fit=crop&q=80",
      "https://images.unsplash.com/photo-1613376026476-ae0bd3bd7770?w=900&h=1350&fit=crop&q=80",
      "https://images.unsplash.com/photo-1614583225154-5fcdda339133?w=900&h=1350&fit=crop&q=80",
      "https://images.unsplash.com/photo-1560972550-aba3456b5564?w=900&h=1350&fit=crop&q=80",
      "https://images.unsplash.com/photo-1559981421-3e0fd0ec1c6d?w=900&h=1350&fit=crop&q=80",
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=900&h=1350&fit=crop&q=80",
      "https://images.unsplash.com/photo-1480796927426-f609979314bd?w=900&h=1350&fit=crop&q=80",
    ],
  },
  {
    id: "2",
    slug: "tea-house-at-dusk",
    title: "Tea House at Dusk",
    author: "Mei Nakamura",
    description:
      "Every evening, a quiet tea house opens only for people who have lost something they cannot name. One regular begins to notice the same stranger returning — and the steam in her cup spelling out warnings.",
    cover:
      "https://images.unsplash.com/photo-1545569341-9eb8ce22455a?w=600&h=900&fit=crop&q=80",
    genres: ["Slice of Life", "Romance", "Fantasy"],
    status: "Completed",
    year: 2023,
    readingTime: "14 min",
    pages: [
      "https://images.unsplash.com/photo-1545569341-9eb8ce22455a?w=900&h=1350&fit=crop&q=80",
      "https://images.unsplash.com/photo-1528164344705-47542687000d?w=900&h=1350&fit=crop&q=80",
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=900&h=1350&fit=crop&q=80",
      "https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?w=900&h=1350&fit=crop&q=80",
      "https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?w=900&h=1350&fit=crop&q=80",
      "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=900&h=1350&fit=crop&q=80",
    ],
  },
  {
    id: "3",
    slug: "blade-of-the-hollow-moon",
    title: "Blade of the Hollow Moon",
    author: "Kenji Aoyama",
    description:
      "A disgraced swordsman is hired to escort a sealed shrine across a war-torn province. The seal fails on the first night — and whatever wakes inside remembers his name.",
    cover:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=900&fit=crop&q=80",
    genres: ["Action", "Fantasy", "Horror"],
    status: "Completed",
    year: 2025,
    readingTime: "22 min",
    pages: [
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=900&h=1350&fit=crop&q=80",
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=900&h=1350&fit=crop&q=80",
      "https://images.unsplash.com/photo-1509248966401-f4c0b9e4a0a8?w=900&h=1350&fit=crop&q=80",
      "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=900&h=1350&fit=crop&q=80",
      "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=900&h=1350&fit=crop&q=80",
      "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=900&h=1350&fit=crop&q=80",
      "https://images.unsplash.com/photo-1613376026476-ae0bd3bd7770?w=900&h=1350&fit=crop&q=80",
      "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=900&h=1350&fit=crop&q=80",
      "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=900&h=1350&fit=crop&q=80",
    ],
  },
  {
    id: "4",
    slug: "station-seven",
    title: "Station Seven",
    author: "Hana Okada",
    description:
      "Two strangers miss the last train home and spend one night wandering a city that rearranges itself when no one is looking. By dawn, they must decide whether to board — or stay where the maps end.",
    cover:
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&h=900&fit=crop&q=80",
    genres: ["Romance", "Slice of Life", "Mystery"],
    status: "Completed",
    year: 2024,
    readingTime: "16 min",
    pages: [
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=900&h=1350&fit=crop&q=80",
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=900&h=1350&fit=crop&q=80",
      "https://images.unsplash.com/photo-1528164344705-47542687000d?w=900&h=1350&fit=crop&q=80",
      "https://images.unsplash.com/photo-1480796927426-f609979314bd?w=900&h=1350&fit=crop&q=80",
      "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=900&h=1350&fit=crop&q=80",
      "https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?w=900&h=1350&fit=crop&q=80",
      "https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?w=900&h=1350&fit=crop&q=80",
    ],
  },
  {
    id: "5",
    slug: "paper-crane-protocol",
    title: "Paper Crane Protocol",
    author: "Yuki Tanabe",
    description:
      "In a school where folded paper can rewrite reality, a quiet student discovers her crane can undo one mistake — but every fold costs a memory she might need later.",
    cover:
      "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=600&h=900&fit=crop&q=80",
    genres: ["Fantasy", "Drama", "Slice of Life"],
    status: "Completed",
    year: 2022,
    readingTime: "12 min",
    pages: [
      "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=900&h=1350&fit=crop&q=80",
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=900&h=1350&fit=crop&q=80",
      "https://images.unsplash.com/photo-1560972550-aba3456b5564?w=900&h=1350&fit=crop&q=80",
      "https://images.unsplash.com/photo-1559981421-3e0fd0ec1c6d?w=900&h=1350&fit=crop&q=80",
      "https://images.unsplash.com/photo-1614583225154-5fcdda339133?w=900&h=1350&fit=crop&q=80",
      "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=900&h=1350&fit=crop&q=80",
    ],
  },
  {
    id: "6",
    slug: "deep-signal",
    title: "Deep Signal",
    author: "Akira Mori",
    description:
      "A deep-sea research crew picks up a broadcast older than the ocean itself. The closer they dive, the more the signal sounds like someone they left behind on the surface.",
    cover:
      "https://images.unsplash.com/photo-1551244072-5d0addd3b5d4?w=600&h=900&fit=crop&q=80",
    genres: ["Sci-Fi", "Horror", "Mystery"],
    status: "Completed",
    year: 2025,
    readingTime: "20 min",
    pages: [
      "https://images.unsplash.com/photo-1551244072-5d0addd3b5d4?w=900&h=1350&fit=crop&q=80",
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=900&h=1350&fit=crop&q=80",
      "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=900&h=1350&fit=crop&q=80",
      "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=900&h=1350&fit=crop&q=80",
      "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=900&h=1350&fit=crop&q=80",
      "https://images.unsplash.com/photo-1509248966401-f4c0b9e4a0a8?w=900&h=1350&fit=crop&q=80",
      "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=900&h=1350&fit=crop&q=80",
      "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=900&h=1350&fit=crop&q=80",
    ],
  },
  {
    id: "7",
    slug: "sunday-bakery-war",
    title: "Sunday Bakery War",
    author: "Sora Ide",
    description:
      "Rival bakeries on the same street corner wage a delicious war of croissants, sabotage, and one shared delivery bike. Whoever wins the Sunday contest keeps the corner — and maybe each other.",
    cover:
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&h=900&fit=crop&q=80",
    genres: ["Romance", "Comedy", "Slice of Life"],
    status: "Completed",
    year: 2023,
    readingTime: "11 min",
    pages: [
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=900&h=1350&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517433670267-08bbd4be890f?w=900&h=1350&fit=crop&q=80",
      "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=900&h=1350&fit=crop&q=80",
      "https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=900&h=1350&fit=crop&q=80",
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=900&h=1350&fit=crop&q=80",
      "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=900&h=1350&fit=crop&q=80",
    ],
  },
  {
    id: "8",
    slug: "ashen-garden",
    title: "Ashen Garden",
    author: "Lina Kurosawa",
    description:
      "A gardener tends a greenhouse that grows only what people regret. When a new client asks for a flower that never existed, the garden begins rewriting both of their pasts.",
    cover:
      "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=600&h=900&fit=crop&q=80",
    genres: ["Drama", "Fantasy", "Horror"],
    status: "Completed",
    year: 2024,
    readingTime: "17 min",
    pages: [
      "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=900&h=1350&fit=crop&q=80",
      "https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?w=900&h=1350&fit=crop&q=80",
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=900&h=1350&fit=crop&q=80",
      "https://images.unsplash.com/photo-1509248966401-f4c0b9e4a0a8?w=900&h=1350&fit=crop&q=80",
      "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=900&h=1350&fit=crop&q=80",
      "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=900&h=1350&fit=crop&q=80",
      "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=900&h=1350&fit=crop&q=80",
    ],
  },
];

export const genres = [
  "All",
  "Action",
  "Romance",
  "Fantasy",
  "Slice of Life",
  "Horror",
  "Sci-Fi",
  "Mystery",
  "Drama",
  "Comedy",
] as const;

export function getMangaBySlug(slug: string): Manga | undefined {
  return mangas.find((m) => m.slug === slug);
}

export function getRelatedMangas(manga: Manga, limit = 4): Manga[] {
  const genreSet = new Set(manga.genres);
  return mangas
    .filter((m) => m.id !== manga.id)
    .map((m) => ({
      manga: m,
      score: m.genres.filter((g) => genreSet.has(g)).length,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.manga);
}

export function getMangasByGenre(genre: string): Manga[] {
  if (genre === "All") return mangas;
  return mangas.filter((m) => m.genres.includes(genre));
}
