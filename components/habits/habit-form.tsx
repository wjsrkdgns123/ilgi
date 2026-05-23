"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

import { createHabit, updateHabit, archiveHabit } from "@/lib/habits";
import type { Habit, Frequency, Weekday } from "@/types/db";
import { WEEKDAY_LABELS, WEEKDAYS_ALL } from "@/types/db";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const EMOJI_SUGGESTIONS = ["☀️", "💧", "📚", "🏃", "🧘", "🍎", "💤", "✍️"];

const schema = z.object({
  title: z
    .string()
    .min(1, { error: "제목을 입력해주세요." })
    .max(60, { error: "제목은 60자 이하여야 합니다." }),
  emoji: z.string().max(4).optional(),
});

type FormValues = z.infer<typeof schema>;

const inputClass =
  "h-11 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-base outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/30 disabled:opacity-50";

interface HabitFormProps {
  habit: Habit | null;
  onDone: () => void;
}

export function HabitForm({ habit, onDone }: HabitFormProps) {
  const isEdit = habit !== null;

  const [frequency, setFrequency] = React.useState<Frequency>(
    habit?.frequency ?? "daily",
  );
  const [weekdays, setWeekdays] = React.useState<number[]>(
    habit?.weekdays ?? [...WEEKDAYS_ALL],
  );
  const [submitting, setSubmitting] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: habit?.title ?? "",
      emoji: habit?.emoji ?? "",
    },
  });

  const emojiValue = watch("emoji") ?? "";

  function toggleWeekday(day: number) {
    setWeekdays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day].sort(),
    );
  }

  async function onSubmit(values: FormValues) {
    if (frequency === "weekdays" && weekdays.length === 0) {
      toast.error("최소 하루 이상 선택해주세요.");
      return;
    }

    setSubmitting(true);
    try {
      const input = {
        title: values.title,
        emoji: values.emoji || null,
        frequency,
        weekdays: frequency === "daily" ? [...WEEKDAYS_ALL] : weekdays,
      };

      if (isEdit && habit) {
        await updateHabit(habit.id, input);
        toast.success("습관을 수정했습니다.");
      } else {
        await createHabit(input);
        toast.success("새 습관을 만들었습니다.");
      }
      onDone();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  }

  async function onDelete() {
    if (!isEdit || !habit) return;
    if (!confirm(`"${habit.title}" 습관을 삭제할까요?`)) return;

    setDeleting(true);
    try {
      await archiveHabit(habit.id);
      toast.success("습관을 삭제했습니다.");
      onDone();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "삭제 중 오류");
      setDeleting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-5 px-4 pb-6"
    >
      {/* 제목 */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="title" className="text-sm font-medium">
          제목
        </label>
        <input
          id="title"
          type="text"
          autoFocus={!isEdit}
          placeholder="예) 물 한 잔 마시기"
          aria-invalid={!!errors.title}
          className={inputClass}
          {...register("title")}
        />
        {errors.title && (
          <p className="text-xs text-destructive">{errors.title.message}</p>
        )}
      </div>

      {/* 이모지 */}
      <div className="flex flex-col gap-2">
        <label htmlFor="emoji" className="text-sm font-medium">
          이모지 <span className="text-muted-foreground">(선택)</span>
        </label>
        <input
          id="emoji"
          type="text"
          maxLength={4}
          placeholder="아무거나 1자"
          aria-invalid={!!errors.emoji}
          className={cn(inputClass, "text-center text-xl")}
          {...register("emoji")}
        />
        <div className="grid grid-cols-8 gap-1.5">
          {EMOJI_SUGGESTIONS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => setValue("emoji", emoji, { shouldDirty: true })}
              className={cn(
                "h-10 rounded-md text-xl transition-colors hover:bg-muted",
                emojiValue === emoji && "bg-muted ring-2 ring-primary",
              )}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      {/* 빈도 */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">빈도</label>
        <div className="grid grid-cols-2 gap-1.5 rounded-lg bg-muted p-1">
          {(["daily", "weekdays"] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFrequency(f)}
              className={cn(
                "h-9 rounded-md text-sm font-medium transition-colors",
                frequency === f
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {f === "daily" ? "매일" : "특정 요일"}
            </button>
          ))}
        </div>

        {frequency === "weekdays" && (
          <div className="flex gap-1.5 mt-1">
            {WEEKDAY_LABELS.map((label, i) => {
              const day = i as Weekday;
              const active = weekdays.includes(day);
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleWeekday(day)}
                  className={cn(
                    "flex-1 h-10 rounded-md text-sm font-medium transition-colors border",
                    active
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-input text-muted-foreground hover:bg-muted",
                  )}
                  aria-pressed={active}
                >
                  {label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 액션 */}
      <div className="flex flex-col gap-2 pt-2">
        <Button
          type="submit"
          size="lg"
          className="h-11 w-full"
          disabled={submitting || deleting}
        >
          {submitting ? "저장 중..." : isEdit ? "수정 저장" : "습관 만들기"}
        </Button>

        {isEdit && (
          <Button
            type="button"
            variant="destructive"
            onClick={onDelete}
            disabled={submitting || deleting}
            className="h-11 w-full gap-2"
          >
            <Trash2 className="size-4" />
            {deleting ? "삭제 중..." : "삭제"}
          </Button>
        )}
      </div>
    </form>
  );
}
