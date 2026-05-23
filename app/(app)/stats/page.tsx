import { TopBar } from "@/components/nav/top-bar";

export default function StatsPage() {
  return (
    <>
      <TopBar title="통계" />
      <main className="max-w-md mx-auto px-4 py-8">
        <div className="rounded-xl border border-dashed border-border p-8 text-center">
          <p className="text-muted-foreground text-sm">준비 중</p>
          <p className="text-muted-foreground/60 text-xs mt-2">
            히트맵 / streak / 한 달 흐름을 v1.1에서 보여줄 거예요.
          </p>
        </div>
      </main>
    </>
  );
}
