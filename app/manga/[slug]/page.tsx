import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MangaCard } from "@/components/MangaCard";
import { ReadProgress } from "@/components/ReadProgress";
import { getMangaBySlug, getRelatedMangas, mangas } from "@/lib/mangas";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return mangas.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const manga = getMangaBySlug(slug);
  if (!manga) return { title: "Not found" };
  return {
    title: manga.title,
    description: manga.description,
  };
}

export default async function MangaPage({ params }: Props) {
  const { slug } = await params;
  const manga = getMangaBySlug(slug);
  if (!manga) notFound();

  const related = getRelatedMangas(manga);

  return (
    <>
      <ReadProgress />

      <section className="manga-hero">
        <div className="manga-hero__cover">
          <Image
            src={manga.cover}
            alt={`${manga.title} cover`}
            fill
            priority
            sizes="(max-width: 800px) 70vw, 240px"
          />
        </div>
        <div className="manga-hero__body">
          <h1>{manga.title}</h1>
          <p className="manga-hero__byline">by {manga.author}</p>
          <div className="manga-hero__tags">
            <span className="tag tag--accent">{manga.status}</span>
            {manga.genres.map((g) => (
              <span key={g} className="tag">
                {g}
              </span>
            ))}
          </div>
          <p className="manga-hero__desc">{manga.description}</p>
          <div className="manga-hero__stats">
            <div>
              <strong>{manga.pages.length} pages</strong>
              Full story
            </div>
            <div>
              <strong>{manga.readingTime}</strong>
              Avg. read
            </div>
            <div>
              <strong>{manga.year}</strong>
              Released
            </div>
          </div>
          <a href="#reader" className="btn btn--primary">
            Start reading
          </a>
        </div>
      </section>

      <section id="reader" className="reader">
        <div className="reader__inner">
          <p className="reader__label">Full story · scroll to read</p>
          <div className="reader__pages">
            {manga.pages.map((src, index) => (
              <figure key={`${manga.slug}-${index}`} className="reader__page">
                <Image
                  src={src}
                  alt={`${manga.title} — page ${index + 1}`}
                  width={900}
                  height={1350}
                  sizes="(max-width: 820px) 100vw, 820px"
                  className="h-auto w-full"
                  priority={index < 2}
                />
              </figure>
            ))}
          </div>
          <div className="reader__end">
            <h3>End of story</h3>
            <p>You finished {manga.title}. Explore more complete titles below.</p>
            <Link href="/#browse" className="btn btn--primary">
              Back to browse
            </Link>
          </div>
        </div>
      </section>

      <section className="section related">
        <div className="section__head">
          <h2>Related titles</h2>
          <p>More complete stories in similar genres.</p>
        </div>
        <div className="manga-grid">
          {related.map((item) => (
            <MangaCard key={item.id} manga={item} />
          ))}
        </div>
      </section>
    </>
  );
}
