import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section not-found">
      <h1>404</h1>
      <p>This game was not found in the catalog.</p>
      <Link href="/" className="btn btn--primary">
        Back home
      </Link>
    </section>
  );
}
