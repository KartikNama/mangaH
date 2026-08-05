import { FacetIndex } from "@/components/FacetIndex";
import { getCatalogFacets } from "@/lib/games";

export const metadata = {
  title: "Tags — SAdult",
  description: "Browse adult games by tag on saudult.xyz.",
};

export default async function TagsPage() {
  const facets = await getCatalogFacets();

  return (
    <FacetIndex
      title="All tags"
      description="Every tag in the catalog with game counts. Select one to filter the browse list."
      items={facets.tags}
      filterParam="tag"
      placeholder="Search tags…"
    />
  );
}
