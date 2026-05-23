"use client";

import * as React from "react";
import { Flame } from "lucide-react";

import { cn } from "@/lib/utils";
import { MascotImage, type Mood } from "@/components/mascot-image";

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

  // 체크 시 마스코트 bouncy 애니메이션 (사업계획 §2 정서 연결)
  const [bumped, setBumped] = React.useState(false);
  const prevCompletedRef = React.useRef<number | undefined>(undefined);

  React.useEffect(() => {
    // 첫 마운트는 스킵 (페이지 로드마다 흔들리면 어지러움)
    if (prevCompletedRef.current === undefined) {
      prevCompletedRef.current = completed;
      return;
    }
    if (prevCompletedRef.current !== completed) {
      setBumped(true);
      const t = window.setTimeout(() => setBumped(false), 540);
      prevCompletedRef.current = completed;
      return () => window.clearTimeout(t);
    }
  }, [completed]);

  return (
    <header className="flex flex-col items-center pt-8 pb-6 text-center">
      <div className="relative mb-4">
        {/* 마스코트만 애니메이션. streak 배지는 흔들리지 않게 별도 div */}
        <div className={cn(bumped && "animate-bbirong-bump")}>
          <MascotImage mood={mood} size={140} priority />
        </div>
        {streak >= 2 && (
          <span
            className="absolute -bottom-1 -right-2 flex items-center gap-1 rounded-full bg-accent px-2.5 py-1 text-xs font-bold text-accent-foreground shadow-sm"
            aria-label={`${streak}일 연속`}
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
