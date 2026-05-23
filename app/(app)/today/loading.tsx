/**
 * /today 첫 진입 시 보이는 스켈레톤.
 * 마스코트 자리 + 진행률 텍스트 자리 + 3개 행 더미.
 */
export default function TodayLoading() {
  return (
    <main className="max-w-md mx-auto px-4 pb-8" aria-busy="true">
      <header className="flex flex-col items-center pt-8 pb-6 gap-3">
        <div className="size-[140px] rounded-full bg-muted animate-pulse" />
        <div className="h-7 w-32 rounded-md bg-muted animate-pulse" />
        <div className="h-4 w-44 rounded-md bg-muted/70 animate-pulse" />
      </header>
      <ul className="flex flex-col gap-2">
        {[0, 1, 2].map((i) => (
          <li
            key={i}
            className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-4"
          >
            <div className="size-7 rounded-full bg-muted animate-pulse shrink-0" />
            <div className="size-9 rounded-full bg-muted animate-pulse shrink-0" />
            <div className="flex-1 h-5 rounded-md bg-muted animate-pulse" />
          </li>
        ))}
      </ul>
    </main>
  );
}
