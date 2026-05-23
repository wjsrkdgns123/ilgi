"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export type Mood =
  | "normal"
  | "happy"
  | "pouting"
  | "sad"
  | "away"
  | "angry"
  | "sleep"
  | "celebrate";

const MOOD_FALLBACK_EMOJI: Record<Mood, string> = {
  normal: "🦦",
  happy: "🥳",
  pouting: "🥺",
  sad: "😢",
  away: "🙈",
  angry: "😤",
  sleep: "😴",
  celebrate: "🎉",
};

interface Props {
  mood: Mood;
  size: number;
  priority?: boolean;
  className?: string;
  alt?: string;
}

/**
 * 마스코트 이미지 — PNG 누락 시 부드럽게 fallback (이모지).
 * /public/bbirong/<mood>.png 로드 실패하면 자동 대체.
 */
export function MascotImage({
  mood,
  size,
  priority,
  className,
  alt = "삐롱이",
}: Props) {
  const [errored, setErrored] = React.useState(false);

  if (errored) {
    return (
      <div
        role="img"
        aria-label={alt}
        style={{ width: size, height: size }}
        className={cn(
          "rounded-full bg-secondary/60 flex items-center justify-center select-none",
          className,
        )}
      >
        <span
          aria-hidden
          className="leading-none"
          style={{ fontSize: size * 0.55 }}
        >
          {MOOD_FALLBACK_EMOJI[mood]}
        </span>
      </div>
    );
  }

  return (
    <Image
      src={`/bbirong/${mood}.png`}
      alt={alt}
      width={size}
      height={size}
      priority={priority}
      onError={() => setErrored(true)}
      className={cn("select-none", className)}
    />
  );
}
