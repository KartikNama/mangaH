import { FacetIndex } from "@/components/FacetIndex";
import { getCatalogFacets } from "@/lib/games";
import { SITE_URL } from "@/lib/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "All tags",
  description:
    "Browse adult games by tag on SAdult. Every tag in the catalog with game counts.",
  alternates: { canonical: `${SITE_URL}/tags` },
  openGraph: {
    url: `${SITE_URL}/tags`,
    title: "All tags · SAdult",
  },
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
