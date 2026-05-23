/**
 * /habits 첫 진입 시 보이는 스켈레톤.
 */
export default function HabitsLoading() {
  return (
    <>
      {/* TopBar 영역 */}
      <header className="sticky top-0 z-30 bg-background/95 border-b border-border pt-safe">
        <div className="px-4 h-14 max-w-md mx-auto flex items-center">
          <div className="h-6 w-16 rounded-md bg-muted animate-pulse" />
        </div>
      </header>
      <main
        className="max-w-md mx-auto px-4 py-6 flex flex-col gap-2.5"
        aria-busy="true"
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3.5"
          >
            <div className="size-12 rounded-full bg-muted animate-pulse shrink-0" />
            <div className="flex-1 flex flex-col gap-2">
              <div className="h-4 w-3/4 rounded-md bg-muted animate-pulse" />
              <div className="h-3 w-1/3 rounded-md bg-muted/70 animate-pulse" />
            </div>
          </div>
        ))}
      </main>
    </>
  );
}
