"use client";

import Image, { type ImageProps } from "next/image";
import { useCallback, useState } from "react";
import { GAME_PLACEHOLDER } from "@/lib/media";

type Props = Omit<ImageProps, "onError" | "onLoad"> & {
  fallbackSrc?: string;
  /** Extra URLs to try (e.g. gallery) before the placeholder */
  fallbackSrcs?: string[];
  /** Skip gray lazy-load placeholders that return HTTP 200 */
  detectBlank?: boolean;
};

function isMostlyBlank(img: HTMLImageElement): boolean {
  try {
    const w = 48;
    const h = 48;
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return false;
    ctx.drawImage(img, 0, 0, w, h);
    const { data } = ctx.getImageData(0, 0, w, h);
    let min = 255;
    let max = 0;
    for (let i = 0; i < data.length; i += 4) {
      const lum = 0.299 * data[i]! + 0.587 * data[i + 1]! + 0.114 * data[i + 2]!;
      min = Math.min(min, lum);
      max = Math.max(max, lum);
    }
    return max - min < 18;
  } catch {
    return false;
  }
}

/** WebP on media server — skip optimizer; show placeholder if missing, 404, or gray lazy-load stub */
export function GameImage({
  src,
  fallbackSrc = GAME_PLACEHOLDER,
  fallbackSrcs = [],
  detectBlank = true,
  ...props
}: Props) {
  const chain = [
    !src || (typeof src === "string" && src.trim() === "") ? null : src,
    ...fallbackSrcs,
    fallbackSrc,
  ].filter(Boolean) as string[];

  const [index, setIndex] = useState(0);
  const currentSrc = chain[index] ?? fallbackSrc;

  const advance = useCallback(() => {
    setIndex((i) => (i + 1 < chain.length ? i + 1 : i));
  }, [chain.length]);

  return (
    <Image
      {...props}
      src={currentSrc}
      unoptimized
      onError={advance}
      onLoad={(e) => {
        if (!detectBlank || index >= chain.length - 1) return;
        if (isMostlyBlank(e.currentTarget)) advance();
      }}
    />
  );
}
