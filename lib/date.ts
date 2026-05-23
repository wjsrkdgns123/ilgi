/**
 * 시간 처리 단일 진입점 — 모든 "오늘"/요일/시간대 판단은 여기로.
 * KST(Asia/Seoul) 자정 기준.
 *
 * 절대 `new Date().toISOString().slice(0,10)` 같은 UTC 기반 코드 쓰지 말 것.
 * 자정 직전(예: 23:55) UTC 변환 시 날짜가 어긋남.
 */

import { formatInTimeZone, toZonedTime } from "date-fns-tz";
import { format } from "date-fns";
import type { Habit, Weekday } from "@/types/db";

export const KST_TIMEZONE = "Asia/Seoul";

/** KST 기준 오늘 날짜 (yyyy-MM-dd 형식, 예: "2026-05-22") */
export function getTodayKST(): string {
  return formatInTimeZone(new Date(), KST_TIMEZONE, "yyyy-MM-dd");
}

/** KST 기준 어제 날짜 (yyyy-MM-dd) */
export function getYesterdayKST(): string {
  const now = toZonedTime(new Date(), KST_TIMEZONE);
  now.setDate(now.getDate() - 1);
  return format(now, "yyyy-MM-dd");
}

/** KST 기준 현재 요일 (0=일 .. 6=토) */
export function getTodayWeekdayKST(): Weekday {
  return toZonedTime(new Date(), KST_TIMEZONE).getDay() as Weekday;
}

/**
 * 시간대별 인사 — 삐롱이가 건네는 한 마디 (반말 + 어리광 톤).
 * 톤 규칙 (사업계획 §7): ✅ "괜찮아/다시/오늘만/조금씩" / ❌ "갓생/성공/완벽/달성/화이팅"
 */
export function getGreetingKST(): string {
  const hour = toZonedTime(new Date(), KST_TIMEZONE).getHours();
  if (hour < 5) return "아직 안 자?";
  if (hour < 12) return "좋은 아침";
  if (hour < 18) return "오늘도 조금씩";
  if (hour < 22) return "저녁이야";
  return "늦었어, 얼른 자";
}

/**
 * 오늘 (KST) 이 습관을 해야 하는 날인지 — frequency + weekdays 조합
 * frequency 값은 DB 스키마와 일치: 'daily' | 'weekdays'
 */
export function isHabitDueToday(
  habit: Pick<Habit, "frequency" | "weekdays">,
): boolean {
  if (habit.frequency === "daily") return true;
  const today = getTodayWeekdayKST();
  return habit.weekdays.includes(today);
}

/** 한국어 긴 날짜 (예: "5월 22일 금요일") */
export function formatKoreanDateLong(date?: Date | string): string {
  const target =
    typeof date === "string" ? new Date(date) : (date ?? new Date());
  return formatInTimeZone(target, KST_TIMEZONE, "M월 d일 EEEE");
}

/** N일 전의 KST 날짜 문자열 (예: 어제 = daysAgoKST(1)) */
export function daysAgoKST(n: number): string {
  const past = new Date(Date.now() - n * 24 * 60 * 60 * 1000);
  return formatInTimeZone(past, KST_TIMEZONE, "yyyy-MM-dd");
}
