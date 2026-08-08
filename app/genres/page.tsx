import { FacetIndex } from "@/components/FacetIndex";
import { getCatalogFacets } from "@/lib/games";
import { SITE_URL } from "@/lib/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "All genres",
  description:
    "Browse adult games by genre on SAdult. Filter Windows, Mac, Linux and Android downloads by category.",
  alternates: { canonical: `${SITE_URL}/genres` },
  openGraph: {
    url: `${SITE_URL}/genres`,
    title: "All genres · SAdult",
  },
};

export default async function GenresPage() {
  const facets = await getCatalogFacets();

  return (
    <FacetIndex
      title="All genres"
      description="Pick a genre to see matching games. Counts show how many titles we have in each category."
      items={facets.genres}
      filterParam="genre"
      placeholder="Search genres…"
    />
  );
}
