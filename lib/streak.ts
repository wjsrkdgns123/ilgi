import { differenceInDays, parseISO } from "date-fns";

/**
 * 연속 streak 계산
 *
 * @param dates 체크된 날짜 배열 ('yyyy-MM-dd' 형식), 중복 없을 것
 * @param today KST 기준 오늘 ('yyyy-MM-dd')
 * @returns 연속 일수
 *
 * 규칙:
 *  - 오늘 체크했고 어제도 체크했으면 streak 누적
 *  - 어제까지만 연속이면 오늘 안 했어도 streak 유지 (오늘 아직 안 한 것 뿐)
 *  - 어제 빠뜨렸으면 streak = 0
 */
export function calculateStreak(dates: string[], today: string): number {
  if (dates.length === 0) return 0;

  const sorted = [...dates].sort().reverse();
  const todayDate = parseISO(today);

  let streak = 0;
  const expectedDate = new Date(todayDate);

  for (const dateStr of sorted) {
    const date = parseISO(dateStr);
    const diff = differenceInDays(expectedDate, date);

    if (diff === 0) {
      // 기대한 날짜에 체크함
      streak++;
      expectedDate.setDate(expectedDate.getDate() - 1);
    } else if (diff === 1 && streak === 0) {
      // 오늘 안 했지만 어제는 했으면 streak 시작 (어제부터 누적)
      streak++;
      expectedDate.setDate(expectedDate.getDate() - 2);
    } else {
      // 끊김
      break;
    }
  }

  return streak;
}
