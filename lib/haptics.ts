/**
 * 모바일 햅틱 피드백 (vibrate API).
 * iOS PWA에서도 동작 (사용자 제스처 직후 호출 필수).
 * 데스크탑 / 미지원 브라우저에선 no-op.
 */

function canVibrate(): boolean {
  if (typeof navigator === "undefined") return false;
  return "vibrate" in navigator;
}

/** 짧은 탭 (체크 토글, 버튼 누름) */
export function hapticTap(): void {
  if (!canVibrate()) return;
  navigator.vibrate(10);
}

/** 성공 (저장 완료, 7일 streak 달성 등) */
export function hapticSuccess(): void {
  if (!canVibrate()) return;
  navigator.vibrate([15, 30, 15]);
}

/** 에러 (실패 toast 직전) */
export function hapticError(): void {
  if (!canVibrate()) return;
  navigator.vibrate([50, 80, 50]);
}
