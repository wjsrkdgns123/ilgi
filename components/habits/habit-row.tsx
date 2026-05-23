"use client";

import type { Habit } from "@/types/db";
import { WEEKDAY_LABELS, WEEKDAYS_ALL } from "@/types/db";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

interface HabitRowProps {
  habit: Habit;
  onClick: () => void;
}

function frequencyLabel(habit: Habit): string {
  if (habit.frequency === "daily") return "매일";
  if (habit.weekdays.length === WEEKDAYS_ALL.length) return "매일";
  if (habit.weekdays.length === 0) return "비활성";
  // weekdays 정렬되어 있다고 가정
  return habit.weekdays
    .map((d) => WEEKDAY_LABELS[d])
    .join("·");
}

export function HabitRow({ habit, onClick }: HabitRowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3.5 text-left",
        "transition-colors hover:bg-muted/40 active:bg-muted/60",
      )}
    >
      <div
        className={cn(
          "size-12 rounded-full bg-secondary/70 flex items-center justify-center text-2xl shrink-0",
        )}
        aria-hidden
      >
        {habit.emoji || "•"}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-base font-medium truncate">{habit.title}</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {frequencyLabel(habit)}
        </p>
      </div>
      <ChevronRight
        className="size-4 text-muted-foreground/60 shrink-0"
        strokeWidth={1.75}
      />
    </button>
  );
}
