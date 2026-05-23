"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getTodayKST } from "@/lib/date";
import type { Habit, HabitInput } from "@/types/db";

/**
 * 습관 관련 Server Actions.
 * 모든 함수는 인증 확인 + 본인 user_id 자동 주입 (RLS에 의존하지 않고 명시).
 */

class UnauthorizedError extends Error {
  constructor() {
    super("로그인이 필요합니다.");
  }
}

async function requireUser() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new UnauthorizedError();
  return { supabase, user };
}

/**
 * 활성 습관(archived 아님) 목록. 정렬: sort_order ASC, created_at ASC.
 * 읽기 작업이므로 인증 안 된 경우 빈 배열을 반환 (조용히).
 * 미인증 상태는 layout이 /login으로 리다이렉트하므로 사용자가 보지 않음.
 */
export async function listActiveHabits(): Promise<Habit[]> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("habits")
    .select("*")
    .eq("user_id", user.id)
    .is("archived_at", null)
    .eq("active", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) throw new Error(`습관 목록을 불러오지 못했습니다: ${error.message}`);
  return data ?? [];
}

/** 새 습관 추가 */
export async function createHabit(input: HabitInput): Promise<Habit> {
  const { supabase, user } = await requireUser();

  // 정렬 순서: 현재 활성 습관 개수만큼 뒤에 붙임
  const { count } = await supabase
    .from("habits")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .is("archived_at", null);

  const { data, error } = await supabase
    .from("habits")
    .insert({
      user_id: user.id,
      title: input.title.trim(),
      emoji: input.emoji?.trim() || null,
      frequency: input.frequency,
      weekdays: input.weekdays,
      sort_order: count ?? 0,
    })
    .select()
    .single();

  if (error) throw new Error(`습관을 추가하지 못했습니다: ${error.message}`);
  revalidatePath("/habits");
  revalidatePath("/today");
  return data;
}

/** 습관 수정 */
export async function updateHabit(
  id: string,
  input: HabitInput,
): Promise<Habit> {
  const { supabase, user } = await requireUser();

  const { data, error } = await supabase
    .from("habits")
    .update({
      title: input.title.trim(),
      emoji: input.emoji?.trim() || null,
      frequency: input.frequency,
      weekdays: input.weekdays,
    })
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) throw new Error(`습관을 수정하지 못했습니다: ${error.message}`);
  revalidatePath("/habits");
  revalidatePath("/today");
  return data;
}

/** 습관 아카이브(soft delete). archived_at 설정. */
export async function archiveHabit(id: string): Promise<void> {
  const { supabase, user } = await requireUser();

  const { error } = await supabase
    .from("habits")
    .update({
      archived_at: new Date().toISOString(),
      active: false,
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw new Error(`습관을 삭제하지 못했습니다: ${error.message}`);
  revalidatePath("/habits");
  revalidatePath("/today");
}

/**
 * 오늘자 habit_log 토글.
 * 이미 있으면 삭제, 없으면 추가 (count=1).
 * UNIQUE(habit_id, date) 제약 활용.
 */
export async function toggleHabitLog(habitId: string): Promise<void> {
  const { supabase, user } = await requireUser();
  const today = getTodayKST();

  const { data: existing, error: selectError } = await supabase
    .from("habit_logs")
    .select("id")
    .eq("habit_id", habitId)
    .eq("date", today)
    .maybeSingle();

  if (selectError) {
    throw new Error(`기록 조회 실패: ${selectError.message}`);
  }

  if (existing) {
    const { error } = await supabase
      .from("habit_logs")
      .delete()
      .eq("id", existing.id)
      .eq("user_id", user.id);
    if (error) throw new Error(`체크 해제 실패: ${error.message}`);
  } else {
    const { error } = await supabase.from("habit_logs").insert({
      habit_id: habitId,
      user_id: user.id,
      date: today,
      count: 1,
    });
    if (error) throw new Error(`체크 저장 실패: ${error.message}`);
  }

  revalidatePath("/today");
}

/**
 * 오늘자 habit_log의 메모(note) 저장 — "오늘의 한 줄" 기능.
 * 로그가 없으면 자동 생성 (count=1).
 * 빈 문자열이면 null로 저장.
 */
export async function saveHabitNote(
  habitId: string,
  note: string,
): Promise<void> {
  const { supabase, user } = await requireUser();
  const today = getTodayKST();

  const trimmed = note.trim();

  const { error } = await supabase
    .from("habit_logs")
    .upsert(
      {
        habit_id: habitId,
        user_id: user.id,
        date: today,
        count: 1,
        note: trimmed || null,
      },
      { onConflict: "habit_id,date" },
    );

  if (error) throw new Error(`메모 저장 실패: ${error.message}`);
  revalidatePath("/today");
}
