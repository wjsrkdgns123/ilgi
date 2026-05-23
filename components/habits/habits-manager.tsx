"use client";

import * as React from "react";
import { Plus } from "lucide-react";

import type { Habit } from "@/types/db";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { HabitRow } from "./habit-row";
import { HabitForm } from "./habit-form";

interface HabitsManagerProps {
  initialHabits: Habit[];
}

// undefined = 시트 닫힘, null = 새로 만들기, Habit = 수정 중
type EditingState = Habit | null | undefined;

export function HabitsManager({ initialHabits }: HabitsManagerProps) {
  const [editing, setEditing] = React.useState<EditingState>(undefined);
  const isOpen = editing !== undefined;
  const isCreating = editing === null;

  function close() {
    setEditing(undefined);
  }

  return (
    <>
      {/* 목록 */}
      <div className="flex flex-col gap-2.5">
        {initialHabits.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-8 text-center">
            <p className="text-sm text-muted-foreground">
              아직 등록한 습관이 없어요.
            </p>
            <Button
              onClick={() => setEditing(null)}
              size="lg"
              className="mt-4 h-11"
            >
              <Plus className="size-4" />
              첫 습관 만들기
            </Button>
          </div>
        ) : (
          initialHabits.map((habit) => (
            <HabitRow
              key={habit.id}
              habit={habit}
              onClick={() => setEditing(habit)}
            />
          ))
        )}
      </div>

      {/* FAB — 목록 있을 때만 */}
      {initialHabits.length > 0 && (
        <button
          type="button"
          onClick={() => setEditing(null)}
          aria-label="새 습관 추가"
          className="fixed right-4 bottom-20 size-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center transition-transform active:scale-95 z-30"
          style={{ bottom: "calc(5rem + env(safe-area-inset-bottom))" }}
        >
          <Plus className="size-6" strokeWidth={2.5} />
        </button>
      )}

      {/* 시트 */}
      <Sheet open={isOpen} onOpenChange={(open) => !open && close()}>
        <SheetContent
          side="bottom"
          className="max-h-[90vh] rounded-t-2xl overflow-y-auto pb-safe"
          showCloseButton={false}
        >
          <SheetHeader>
            <SheetTitle>
              {isCreating ? "새 습관" : "습관 수정"}
            </SheetTitle>
            <SheetDescription className="sr-only">
              습관의 제목, 이모지, 빈도를 설정합니다.
            </SheetDescription>
          </SheetHeader>
          {isOpen && (
            <HabitForm
              habit={isCreating ? null : (editing as Habit)}
              onDone={close}
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
