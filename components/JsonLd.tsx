type Props = {
  data: Record<string, unknown> | Record<string, unknown>[];
};

/** Safe JSON-LD for Google rich results */
export function JsonLd({ data }: Props) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
