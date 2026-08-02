import Image, { type ImageProps } from "next/image";

/** Game media is pre-optimized WebP on the media server — skip Next.js optimizer */
export function GameImage(props: ImageProps) {
  return <Image {...props} unoptimized />;
}
