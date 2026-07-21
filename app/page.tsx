import Image from "next/image";
import Link from "next/link";
import { BrowseSection } from "@/components/BrowseSection";
import { mangas } from "@/lib/mangas";

export default function HomePage() {
  const featured = mangas[0];

  return (
    <>
      <section className="hero">
        <div className="hero__media">
          <Image
            src={featured.cover}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="hero__veil" />
        </div>
        <div className="hero__content">
          <h1 className="hero__brand">
            Yo<span>mi</span>
          </h1>
          <p className="hero__line">
            Complete manga, one scroll. Pick a cover and read the whole story —
            no chapters, no volumes.
          </p>
          <div className="hero__actions">
            <a href="#browse" className="btn btn--primary">
              Start browsing
            </a>
            <Link href={`/manga/${featured.slug}`} className="btn btn--ghost">
              Read “{featured.title}”
            </Link>
          </div>
        </div>
      </section>

      <BrowseSection />
    </>
  );
}
