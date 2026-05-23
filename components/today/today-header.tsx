"use client";

import Image from "next/image";
import { Flame } from "lucide-react";

import { cn } from "@/lib/utils";

type Mood = "normal" | "happy" | "pouting" | "celebrate";

interface Props {
  greeting: string;
  date: string;
  completed: number;
  total: number;
  streak: number;
}

/** 진행률 + streak로 삐롱이 감정 결정 */
function pickMood({
  completed,
  total,
  streak,
}: {
  completed: number;
  total: number;
  streak: number;
}): Mood {
  if (total === 0) return "normal";
  if (completed === total && streak >= 7) return "celebrate";
  if (completed === total) return "happy";
  if (completed >= total / 2) return "normal";
  return "pouting";
}

export function TodayHeader({
  greeting,
  date,
  completed,
  total,
  streak,
}: Props) {
  const mood = pickMood({ completed, total, streak });

  return (
    <header className="flex flex-col items-center pt-8 pb-6 text-center">
      <div className="relative mb-4">
        <Image
          src={`/bbirong/${mood}.png`}
          alt={`삐롱이 (${mood})`}
          width={140}
          height={140}
          priority
          className="select-none"
        />
        {streak >= 2 && (
          <span
            className={cn(
              "absolute -bottom-1 -right-2 flex items-center gap-1 rounded-full bg-accent px-2.5 py-1 text-xs font-bold text-accent-foreground shadow-sm",
            )}
          >
            <Flame className="size-3" />
            {streak}일
          </span>
        )}
      </div>
      <h1 className="text-2xl font-bold tracking-tight mb-1">{greeting}</h1>
      <p className="text-sm text-muted-foreground">
        {date} ·{" "}
        {total === 0 ? "오늘은 쉬는 날이야" : `${completed}/${total} 완료`}
      </p>
    </header>
  );
}
