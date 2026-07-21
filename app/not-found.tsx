import Link from "next/link";

export default function NotFound() {
  return (
    <div className="not-found">
      <h1>Title not found</h1>
      <p>That manga isn’t in the sample catalog.</p>
      <Link href="/" className="btn btn--primary">
        Go home
      </Link>
    </div>
  );
}
