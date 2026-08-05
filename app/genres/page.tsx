import { FacetIndex } from "@/components/FacetIndex";
import { getCatalogFacets } from "@/lib/games";

export const metadata = {
  title: "Genres — SAdult",
  description: "Browse adult games by genre on saudult.xyz.",
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
