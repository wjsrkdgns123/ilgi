/**
 * 도메인 타입 — 컴포넌트/액션에서 쓸 친근한 이름.
 * Supabase Row 타입을 그대로 노출하기보다 의미 있는 이름으로 한 번 감싼다.
 */

import type { Database, Frequency, Weekday } from "@/lib/supabase/types";

export type { Frequency, Weekday };

export type Habit = Database["public"]["Tables"]["habits"]["Row"];
export type HabitInsert = Database["public"]["Tables"]["habits"]["Insert"];
export type HabitUpdate = Database["public"]["Tables"]["habits"]["Update"];

export type HabitLog = Database["public"]["Tables"]["habit_logs"]["Row"];
export type HabitLogInsert =
  Database["public"]["Tables"]["habit_logs"]["Insert"];

/** 폼/액션에서 받는 입력 타입 — DB Row보다 가볍게 */
export interface HabitInput {
  title: string;
  emoji?: string | null;
  frequency: Frequency;
  weekdays: number[];
}

/** 오늘 뷰에서 쓰는 habit + 오늘 로그 결합 */
export interface HabitWithTodayLog extends Habit {
  todayLog: HabitLog | null;
}

/** 요일 라벨 — 인덱스 0(일) ~ 6(토) */
export const WEEKDAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"] as const;
export const WEEKDAY_LABELS_FULL = [
  "일요일",
  "월요일",
  "화요일",
  "수요일",
  "목요일",
  "금요일",
  "토요일",
] as const;

/** 평일 (월~금) 단축 */
export const WEEKDAYS_ALL: Weekday[] = [0, 1, 2, 3, 4, 5, 6];
export const WEEKDAYS_WEEKDAY: Weekday[] = [1, 2, 3, 4, 5];
