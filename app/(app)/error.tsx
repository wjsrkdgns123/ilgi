"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { MascotImage } from "@/components/mascot-image";

/**
 * (app) 그룹에서 발생한 예외를 잡는 경계.
 * 한 페이지가 깨져도 전체 앱은 살아있도록.
 * BottomNav 등 레이아웃은 유지된 상태로 이 컴포넌트가 children 자리에 렌더링됨.
 */
export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    // 개발 콘솔에 원본 에러 로그 (디지스트가 있으면 같이)
    console.error("App error:", error, error.digest);
  }, [error]);

  return (
    <main className="max-w-md mx-auto px-6 py-12 flex flex-col items-center text-center min-h-[60vh] justify-center">
      <MascotImage mood="sad" size={120} priority />
      <h2 className="text-xl font-bold mt-6 mb-1">앗, 뭔가 잘못됐어</h2>
      <p className="text-sm text-muted-foreground mb-1">
        삐롱이도 당황했어. 잠시 후 다시 시도해줘.
      </p>
      {error.digest && (
        <p className="text-xs text-muted-foreground/60 mb-6 font-mono">
          {error.digest}
        </p>
      )}
      <div className="flex flex-col gap-2 w-full max-w-xs mt-4">
        <Button onClick={reset} className="w-full">
          다시 시도
        </Button>
        <Button
          variant="ghost"
          onClick={() => (window.location.href = "/today")}
          className="w-full"
        >
          오늘로 돌아가기
        </Button>
      </div>
    </main>
  );
}
