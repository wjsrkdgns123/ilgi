import { TopBar } from "@/components/nav/top-bar";

export default function GoalsPage() {
  return (
    <>
      <TopBar title="목표" />
      <main className="max-w-md mx-auto px-4 py-8">
        <div className="rounded-xl border border-dashed border-border p-8 text-center">
          <p className="text-muted-foreground text-sm">준비 중</p>
          <p className="text-muted-foreground/60 text-xs mt-2">
            장기 목표 + 마일스톤을 v1.1에서 추가합니다.
          </p>
        </div>
      </main>
    </>
  );
}
