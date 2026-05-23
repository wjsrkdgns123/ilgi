import { createClient } from "@/lib/supabase/server";
import {
  getTodayKST,
  getGreetingKST,
  isHabitDueToday,
  formatKoreanDateLong,
} from "@/lib/date";
import { calculateStreak } from "@/lib/streak";
import { TodayHeader } from "@/components/today/today-header";
import { TodayHabits } from "@/components/today/today-habits";

export default async function TodayPage() {
  const supabase = createClient();
  const today = getTodayKST();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null; // layout이 /login으로 리다이렉트함

  // 활성 습관 (전체)
  const { data: habitsAll } = await supabase
    .from("habits")
    .select("*")
    .eq("user_id", user.id)
    .eq("active", true)
    .is("archived_at", null)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  // 오늘자 로그 (select("*")는 Supabase 타입 추론이 잘 됨)
  const { data: todayLogs } = await supabase
    .from("habit_logs")
    .select("*")
    .eq("user_id", user.id)
    .eq("date", today);

  // streak 계산용 — 사용자의 모든 로그 날짜
  const { data: allLogDates } = await supabase
    .from("habit_logs")
    .select("*")
    .eq("user_id", user.id);

  const todayHabits = (habitsAll ?? []).filter(isHabitDueToday);
  const logMap = new Map(
    (todayLogs ?? []).map((l) => [l.habit_id, l] as const),
  );

  const completed = todayHabits.filter((h) => logMap.has(h.id)).length;
  const total = todayHabits.length;

  const uniqueDates = Array.from(
    new Set((allLogDates ?? []).map((l) => l.date)),
  );
  const streak = calculateStreak(uniqueDates, today);

  return (
    <main className="max-w-md mx-auto px-4 pb-8">
      <TodayHeader
        greeting={getGreetingKST()}
        date={formatKoreanDateLong(today)}
        completed={completed}
        total={total}
        streak={streak}
      />
      <TodayHabits
        habits={todayHabits.map((h) => ({
          id: h.id,
          title: h.title,
          emoji: h.emoji,
        }))}
        logs={logMap}
      />
    </main>
  );
}
