"use client";

import * as React from "react";
import { useTransition, useOptimistic, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { MessageSquare, MessageSquareText } from "lucide-react";

import { toggleHabitLog, saveHabitNote } from "@/lib/habits";
import type { Habit } from "@/types/db";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface TodayLog {
  habit_id: string;
  count: number;
  note: string | null;
}

interface Props {
  habits: Pick<Habit, "id" | "title" | "emoji">[];
  logs: Map<string, TodayLog>;
}

export function TodayHabits({ habits, logs }: Props) {
  const [isPending, startTransition] = useTransition();
  const [optimisticLogs, addOptimistic] = useOptimistic(
    logs,
    (state, habitId: string) => {
      const next = new Map(state);
      if (next.has(habitId)) {
        next.delete(habitId);
      } else {
        next.set(habitId, { habit_id: habitId, count: 1, note: null });
      }
      return next;
    },
  );

  if (habits.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border p-10 text-center">
        <p className="text-sm text-muted-foreground">
          오늘 할 습관이 없어
        </p>
        <p className="text-xs text-muted-foreground/70 mt-1">
          습관 탭에서 하나 만들어보자
        </p>
        <Link
          href="/habits"
          className="inline-block mt-4 text-sm font-medium text-primary hover:underline"
        >
          습관 만들러 가기 →
        </Link>
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {habits.map((habit) => {
        const log = optimisticLogs.get(habit.id);
        const checked = !!log;
        const hasNote = !!log?.note;

        return (
          <li
            key={habit.id}
            className={cn(
              "flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3.5 transition-colors",
              checked && "bg-secondary/50",
            )}
          >
            <Checkbox
              checked={checked}
              onCheckedChange={() => {
                startTransition(async () => {
                  addOptimistic(habit.id);
                  try {
                    await toggleHabitLog(habit.id);
                  } catch (err) {
                    toast.error(
                      err instanceof Error
                        ? err.message
                        : "체크 실패. 다시 시도해줘.",
                    );
                  }
                });
              }}
              disabled={isPending}
              className="size-6"
              aria-label={`${habit.title} 체크`}
            />
            <span className="text-xl select-none" aria-hidden>
              {habit.emoji ?? "✨"}
            </span>
            <span
              className={cn(
                "flex-1 text-sm font-medium truncate",
                checked && "line-through text-muted-foreground",
              )}
            >
              {habit.title}
            </span>
            <NoteButton
              key={`note-${habit.id}-${log?.note ?? ""}`}
              habitId={habit.id}
              habitTitle={habit.title}
              initialNote={log?.note ?? ""}
              hasNote={hasNote}
              disabled={!checked}
            />
          </li>
        );
      })}
    </ul>
  );
}

function NoteButton({
  habitId,
  habitTitle,
  initialNote,
  hasNote,
  disabled,
}: {
  habitId: string;
  habitTitle: string;
  initialNote: string;
  hasNote: boolean;
  disabled: boolean;
}) {
  const [note, setNote] = useState(initialNote);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      await saveHabitNote(habitId, note);
      toast.success("기록했어");
      setOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "저장 실패");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <button
        type="button"
        onClick={() => setOpen(true)}
        disabled={disabled}
        aria-label={hasNote ? "한 줄 메모 보기/수정" : "한 줄 메모 추가"}
        className={cn(
          "p-2 rounded-lg transition-colors",
          disabled
            ? "opacity-40 cursor-not-allowed"
            : "hover:bg-muted active:bg-muted/70",
        )}
      >
        {hasNote ? (
          <MessageSquareText className="size-4 text-primary" />
        ) : (
          <MessageSquare className="size-4 text-muted-foreground" />
        )}
      </button>

      <SheetContent
        side="bottom"
        className="rounded-t-2xl pb-safe"
        showCloseButton={false}
      >
        <SheetHeader>
          <SheetTitle>오늘의 한 줄</SheetTitle>
          <SheetDescription className="text-xs">
            {habitTitle} · 짧게 기록해보자
          </SheetDescription>
        </SheetHeader>
        <div className="px-4 pb-6 pt-2 flex flex-col gap-3">
          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="어땠어?"
            maxLength={200}
            rows={3}
            className="text-base resize-none"
          />
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <span>{note.length}/200</span>
          </div>
          <Button
            type="button"
            size="lg"
            className="h-11 w-full"
            disabled={saving}
            onClick={handleSave}
          >
            {saving ? "저장 중..." : "저장"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
