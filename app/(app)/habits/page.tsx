import { TopBar } from "@/components/nav/top-bar";
import { HabitsManager } from "@/components/habits/habits-manager";
import { listActiveHabits } from "@/lib/habits";

export default async function HabitsPage() {
  const habits = await listActiveHabits();

  return (
    <>
      <TopBar
        title="습관"
        subtitle={
          habits.length === 0
            ? "매일 반복할 작은 약속을 만들어요"
            : `${habits.length}개의 습관`
        }
      />
      <main className="max-w-md mx-auto px-4 py-6">
        <HabitsManager initialHabits={habits} />
      </main>
    </>
  );
}
