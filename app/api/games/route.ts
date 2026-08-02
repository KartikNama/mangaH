import { NextRequest, NextResponse } from "next/server";
import { getCatalogFacets, getGamesPage, PAGE_SIZE } from "@/lib/games";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const kind = searchParams.get("kind");

  if (kind === "facets") {
    const facets = await getCatalogFacets();
    return NextResponse.json(facets);
  }

  const page = Number(searchParams.get("page") ?? "1");
  const pageSize = Number(searchParams.get("pageSize") ?? String(PAGE_SIZE));
  const genre = searchParams.get("genre") ?? undefined;
  const platform = searchParams.get("platform") ?? undefined;
  const tag = searchParams.get("tag") ?? undefined;

  const result = await getGamesPage({
    page: Number.isFinite(page) ? page : 1,
    pageSize: Number.isFinite(pageSize) ? pageSize : PAGE_SIZE,
    genre,
    platform,
    tag,
  });

  return NextResponse.json(result);
}
