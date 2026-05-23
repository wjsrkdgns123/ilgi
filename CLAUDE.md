# CLAUDE.md — 삐롱(Bbirong) 프로젝트 합의 명세

> 이 문서는 Claude Code가 이 프로젝트를 이어 받아 작업하기 위한 **단일 진실 공급원(Single Source of Truth)** 이다.
> 작업 시작 전 반드시 전체를 읽고, 의문점이 있으면 사용자에게 먼저 확인할 것.

---

## 0. 프로젝트 한 줄

**"안 챙기면 삐지는 습관 앱, 삐롱"** — 수달 마스코트가 사용자를 기다리며 감정 표현하는 PWA 기반 습관 트래커.

- 프로젝트 폴더: `C:\Users\wjsrk\Desktop\루틴`
- 사용자: 비개발자 (Claude Code가 전 구현 담당)
- 목표: 시장 출시 + 수익 (개인용 아님)

---

## 1. 브랜딩 결정 사항 (변경 금지)

| 항목 | 값 |
|---|---|
| **앱 이름 (한)** | 삐롱 |
| **앱 이름 (영)** | Bbirong |
| **백업 이름** | 호잇 / Hoit (사용 안 함, 기록용) |
| **태그라인 (한)** | 안 챙기면 삐지는 습관 앱 |
| **태그라인 (영)** | Bbirong gets upset when you skip a day. |
| **마스코트 종족** | 수달 (Otter) |
| **마스코트 이름** | 삐롱이 |
| **마스코트 톤** | 어리광 + 반말. "삐롱~ 나 여기 있는데...!" |
| **그림체** | 카카오 프렌즈 느낌의 동그란 파스텔 톤, 2.5등신 |
| **색상 메인** | `#F5E6D3` (크림 베이지) |
| **색상 서브** | `#C9956C` (따뜻한 갈색) |
| **색상 포인트** | `#FFB5C0` (분홍) |

### 마스코트 감정 8종 (`/public/bbirong/` 에 PNG로 저장 예정)

| 파일명 | 상황 | 디자인 포인트 |
|---|---|---|
| `normal.png` | 평소 | 정면, 살짝 미소, 눈 반달 |
| `happy.png` | 체크 완료 | 두 팔 들고 환호, 눈 별 모양 |
| `pouting.png` | 1일 결석 | 살짝 시무룩, 눈 처짐 |
| `sad.png` | 3일 결석 | 눈물 흘리기, 입 ㅠ |
| `away.png` | 5일 결석 | 등 돌리고 토라짐, 뒷모습 |
| `angry.png` | 7일 결석 | 화남 (귀엽게), 양손 허리 |
| `sleep.png` | 잠 | 누워서 자기, Z 표시 |
| `celebrate.png` | 7일 streak | 폭죽 + 점프 |

### 차별점 (시장 포지셔닝)

- **다른 습관 앱과의 차이**: 마스코트가 감정으로 사용자를 챙긴다. "비난"이 아니라 "안쓰러움" 유발 구조 (듀오링고 부엉이 패턴).
- **타겟**: 일반 사용자 (ADHD 타겟 아님 — 톤 자유롭게)
- **v1.0 시점에서는 마스코트가 핵심 차별점**. AI 코치는 v1.1.

---

## 2. 핵심 기술 결정 (변경 금지)

| 항목 | 결정 |
|---|---|
| 프레임워크 | Next.js 14 App Router (정적 export 아님) |
| 인증/DB | Supabase + `@supabase/ssr`, 이메일/비밀번호 |
| UI | shadcn/ui + Tailwind + lucide-react |
| 상태 | TanStack Query + React Hook Form + Zod |
| 시간 | date-fns + date-fns-tz, **KST 단일 진입점** |
| PWA | Serwist (next-pwa 아님) |
| 배포 | Vercel + GitHub 자동 연동 |

### 의도적으로 안 쓰는 것

Prisma/Drizzle, Redux/Zustand, Sentry, next-pwa

---

## 3. 폴더 구조

```
C:\Users\wjsrk\Desktop\루틴\
├── app\
│   ├── layout.tsx                    전역 레이아웃, fonts, ThemeProvider
│   ├── page.tsx                      / → /today 리다이렉트
│   ├── globals.css                   Tailwind base + 디자인 토큰 CSS 변수
│   ├── sw.ts                         ★ Serwist service worker
│   ├── (auth)\
│   │   ├── login\page.tsx
│   │   └── callback\route.ts
│   └── (app)\
│       ├── layout.tsx                세션 가드 + BottomNav
│       ├── today\page.tsx            ★ MVP 심장
│       ├── week\page.tsx             "준비 중"
│       ├── goals\page.tsx            "준비 중"
│       ├── habits\page.tsx           습관 CRUD
│       ├── stats\page.tsx            "준비 중"
│       └── settings\page.tsx
├── components\
│   ├── ui\                           shadcn 자동 생성
│   ├── nav\{BottomNav,TopBar}.tsx
│   ├── habits\{HabitRow,HabitList,HabitForm}.tsx
│   ├── today\{TodayHeader,TodayHabits}.tsx
│   ├── auth\AuthForm.tsx
│   └── theme\{ThemeProvider,ThemeToggle}.tsx
├── lib\
│   ├── supabase\
│   │   ├── client.ts
│   │   ├── server.ts                 ★ import 'server-only'
│   │   ├── middleware.ts
│   │   └── types.ts
│   ├── date.ts                       ★ KST 단일 진입점
│   ├── streak.ts
│   ├── habits.ts                     server actions
│   └── utils.ts
├── types\db.ts
├── public\
│   ├── icon-{192,512}.png
│   ├── apple-touch-icon.png
│   ├── manifest.webmanifest
│   └── bbirong\                      ★ 마스코트 8종
│       ├── normal.png
│       ├── happy.png
│       ├── pouting.png
│       ├── sad.png
│       ├── away.png
│       ├── angry.png
│       ├── sleep.png
│       └── celebrate.png
├── supabase\migrations\0001_init.sql
├── middleware.ts                     ★ 세션 쿠키 갱신
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
├── package.json
├── .env.local
├── .env.local.example
├── .gitignore
├── README.md
└── CLAUDE.md                         ← 이 문서
```

---

## 4. 진행 상태 (현재 위치)

### ✅ 완료
- Step 0: Supabase 프로젝트 + Vercel + GitHub repo
- Step 1: Next.js + Tailwind + shadcn 셋업
- Step 2: Supabase 연결 + 스키마 + RLS
- Step 3: 인증 (이메일/비밀번호) + 세션 가드
- Step 4: BottomNav + 빈 페이지 5개
- Step 5: 습관 CRUD (/habits) — 추가/수정/삭제(soft delete)

### 🔄 다음 작업
- **Step 6: 오늘 뷰 (/today)** ← 여기부터 시작
- Step 7: PWA
- Step 8: Settings 최소
- Step 9: 배포 + 7일 실사용 검증

### 🚫 v1.0에서 안 하는 것
- 한 줄 메모는 **v1.0 스코프에 포함** (스키마 `habit_logs.note` 이미 있음, UI 노출까지)
- 주간/목표/통계 페이지는 "준비 중" placeholder만
- 드래그 정렬, OAuth, 푸시 알림은 v1.1
- AI 코치 기능은 v1.1

---

## 5. Step 6: 오늘 뷰 구현 가이드 ★

### 5-1. `lib/date.ts` (KST 단일 진입점)

```ts
import { formatInTimeZone, toZonedTime } from 'date-fns-tz';
import { format } from 'date-fns';

const KST = 'Asia/Seoul';

export function getTodayKST(): string {
  return formatInTimeZone(new Date(), KST, 'yyyy-MM-dd');
}

export function getTodayWeekdayKST(): number {
  return toZonedTime(new Date(), KST).getDay();
}

export function getYesterdayKST(): string {
  const now = toZonedTime(new Date(), KST);
  now.setDate(now.getDate() - 1);
  return format(now, 'yyyy-MM-dd');
}

export function getGreetingKST(): string {
  const hour = toZonedTime(new Date(), KST).getHours();
  if (hour < 5) return '아직 안 자?';
  if (hour < 12) return '좋은 아침';
  if (hour < 18) return '오늘도 화이팅';
  if (hour < 22) return '저녁이야';
  return '늦었어, 얼른 자';
}

export function isHabitDueToday(habit: {
  frequency: 'daily' | 'weekly';
  weekdays?: number[] | null;
}): boolean {
  if (habit.frequency === 'daily') return true;
  if (habit.frequency === 'weekly' && habit.weekdays) {
    return habit.weekdays.includes(getTodayWeekdayKST());
  }
  return false;
}
```

### 5-2. `lib/streak.ts`

```ts
import { differenceInDays, parseISO } from 'date-fns';

/**
 * 연속 streak 계산
 * dates: 체크된 날짜 배열 ('YYYY-MM-DD')
 * today: KST 기준 오늘
 * 어제까지 연속이면 오늘 안 해도 streak 유지
 */
export function calculateStreak(dates: string[], today: string): number {
  if (dates.length === 0) return 0;

  const sorted = [...dates].sort().reverse();
  const todayDate = parseISO(today);

  let streak = 0;
  let expectedDate = new Date(todayDate);

  for (const dateStr of sorted) {
    const date = parseISO(dateStr);
    const diff = differenceInDays(expectedDate, date);

    if (diff === 0) {
      streak++;
      expectedDate.setDate(expectedDate.getDate() - 1);
    } else if (diff === 1 && streak === 0) {
      streak++;
      expectedDate.setDate(expectedDate.getDate() - 2);
    } else {
      break;
    }
  }

  return streak;
}
```

### 5-3. `lib/habits.ts` (server actions)

```ts
'use server';

import { createClient } from '@/lib/supabase/server';
import { getTodayKST } from '@/lib/date';
import { revalidatePath } from 'next/cache';

export async function toggleHabitLog(habitId: string) {
  const supabase = await createClient();
  const today = getTodayKST();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const { data: existing } = await supabase
    .from('habit_logs')
    .select('id, count')
    .eq('habit_id', habitId)
    .eq('date', today)
    .maybeSingle();

  if (existing) {
    await supabase.from('habit_logs').delete().eq('id', existing.id);
  } else {
    await supabase.from('habit_logs').insert({
      habit_id: habitId,
      user_id: user.id,
      date: today,
      count: 1,
    });
  }

  revalidatePath('/today');
  return { success: true };
}

export async function saveHabitNote(habitId: string, note: string) {
  const supabase = await createClient();
  const today = getTodayKST();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  await supabase.from('habit_logs').upsert({
    habit_id: habitId,
    user_id: user.id,
    date: today,
    count: 1,
    note: note.trim() || null,
  }, {
    onConflict: 'habit_id,date',
  });

  revalidatePath('/today');
  return { success: true };
}
```

### 5-4. `app/(app)/today/page.tsx`

```tsx
import { createClient } from '@/lib/supabase/server';
import { getTodayKST, getGreetingKST, isHabitDueToday } from '@/lib/date';
import { TodayHabits } from '@/components/today/TodayHabits';
import { TodayHeader } from '@/components/today/TodayHeader';

export default async function TodayPage() {
  const supabase = await createClient();
  const today = getTodayKST();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: habits } = await supabase
    .from('habits')
    .select('*')
    .eq('user_id', user.id)
    .eq('active', true)
    .is('archived_at', null)
    .order('sort_order');

  const { data: todayLogs } = await supabase
    .from('habit_logs')
    .select('habit_id, count, note')
    .eq('user_id', user.id)
    .eq('date', today);

  const todayHabits = (habits ?? []).filter(isHabitDueToday);
  const logMap = new Map((todayLogs ?? []).map(l => [l.habit_id, l]));

  const completed = todayHabits.filter(h => logMap.has(h.id)).length;
  const total = todayHabits.length;

  return (
    <main className="container max-w-md mx-auto px-4 pb-24">
      <TodayHeader
        greeting={getGreetingKST()}
        date={today}
        completed={completed}
        total={total}
      />
      <TodayHabits habits={todayHabits} logs={logMap} />
    </main>
  );
}
```

### 5-5. `components/today/TodayHeader.tsx`

```tsx
'use client';

import Image from 'next/image';

interface Props {
  greeting: string;
  date: string;
  completed: number;
  total: number;
}

export function TodayHeader({ greeting, date, completed, total }: Props) {
  // 진행률에 따라 삐롱이 감정 변경
  const mood =
    total === 0 ? 'normal' :
    completed === total ? 'happy' :
    completed >= total / 2 ? 'normal' :
    'pouting';

  return (
    <header className="pt-8 pb-6 text-center">
      <Image
        src={`/bbirong/${mood}.png`}
        alt="삐롱이"
        width={120}
        height={120}
        className="mx-auto mb-3"
        priority
      />
      <h1 className="text-2xl font-bold mb-1">{greeting}</h1>
      <p className="text-sm text-muted-foreground">
        {date} · {completed}/{total} 완료
      </p>
    </header>
  );
}
```

### 5-6. `components/today/TodayHabits.tsx` (낙관적 업데이트)

```tsx
'use client';

import { useState, useTransition, useOptimistic } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { MessageSquare, MessageSquareText } from 'lucide-react';
import { toggleHabitLog, saveHabitNote } from '@/lib/habits';
import { toast } from 'sonner';

interface Habit {
  id: string;
  title: string;
  emoji: string | null;
}

interface Log {
  habit_id: string;
  count: number;
  note: string | null;
}

interface Props {
  habits: Habit[];
  logs: Map<string, Log>;
}

export function TodayHabits({ habits, logs }: Props) {
  const [isPending, startTransition] = useTransition();
  const [optimisticLogs, addOptimistic] = useOptimistic(
    logs,
    (state, habitId: string) => {
      const newState = new Map(state);
      if (newState.has(habitId)) newState.delete(habitId);
      else newState.set(habitId, { habit_id: habitId, count: 1, note: null });
      return newState;
    }
  );

  if (habits.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>오늘 할 습관이 없어요</p>
        <p className="text-xs mt-2">습관 탭에서 추가해보세요</p>
      </div>
    );
  }

  return (
    <ul className="space-y-2">
      {habits.map(habit => {
        const log = optimisticLogs.get(habit.id);
        const checked = !!log;
        const hasNote = !!log?.note;

        return (
          <li
            key={habit.id}
            className="flex items-center gap-3 p-4 rounded-xl bg-card border"
          >
            <Checkbox
              checked={checked}
              onCheckedChange={() => {
                startTransition(async () => {
                  addOptimistic(habit.id);
                  try {
                    await toggleHabitLog(habit.id);
                  } catch (e) {
                    toast.error('실패했어요. 다시 시도해주세요');
                  }
                });
              }}
              disabled={isPending}
            />
            <span className="text-xl">{habit.emoji ?? '✨'}</span>
            <span className={`flex-1 ${checked ? 'line-through opacity-50' : ''}`}>
              {habit.title}
            </span>
            <NoteButton
              habitId={habit.id}
              initialNote={log?.note ?? ''}
              hasNote={hasNote}
            />
          </li>
        );
      })}
    </ul>
  );
}

function NoteButton({
  habitId,
  initialNote,
  hasNote,
}: {
  habitId: string;
  initialNote: string;
  hasNote: boolean;
}) {
  const [note, setNote] = useState(initialNote);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          className="p-2 rounded-lg hover:bg-muted"
          aria-label="메모"
        >
          {hasNote
            ? <MessageSquareText className="w-4 h-4 text-primary" />
            : <MessageSquare className="w-4 h-4 text-muted-foreground" />
          }
        </button>
      </SheetTrigger>
      <SheetContent side="bottom" className="rounded-t-2xl">
        <SheetHeader>
          <SheetTitle>오늘의 한 줄</SheetTitle>
        </SheetHeader>
        <div className="py-4 space-y-3">
          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="어땠어?"
            maxLength={200}
            rows={3}
          />
          <Button
            className="w-full"
            disabled={saving}
            onClick={async () => {
              setSaving(true);
              try {
                await saveHabitNote(habitId, note);
                toast.success('저장됐어');
                setOpen(false);
              } catch (e) {
                toast.error('실패');
              } finally {
                setSaving(false);
              }
            }}
          >
            저장
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
```

### 5-7. Step 6 완료 정의

- [ ] 어제/오늘 분리 (KST 자정 기준)
- [ ] 체크박스 즉시 반응 (낙관적 업데이트)
- [ ] 실패 시 롤백 + toast
- [ ] 한 줄 메모 저장/조회
- [ ] 마스코트 감정이 진행률에 따라 변화
- [ ] 23:55에 체크한 습관이 00:05에 "오늘"에서 사라지고 어제로 분류됨

---

## 6. Step 7: PWA 구현

### 6-1. 설치

```bash
npm install @serwist/next serwist
```

### 6-2. `next.config.mjs`

```js
import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
});

export default withSerwist({});
```

### 6-3. `app/sw.ts`

```ts
import { defaultCache } from "@serwist/next/worker";
import { Serwist } from "serwist";

declare const self: ServiceWorkerGlobalScope;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: defaultCache,
});

serwist.addEventListeners();
```

### 6-4. `public/manifest.webmanifest`

```json
{
  "name": "삐롱 - 안 챙기면 삐지는 습관 앱",
  "short_name": "삐롱",
  "description": "삐롱이가 매일 너를 기다려",
  "start_url": "/today",
  "display": "standalone",
  "background_color": "#FFFFFF",
  "theme_color": "#F5E6D3",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" },
    { "src": "/apple-touch-icon.png", "sizes": "180x180", "type": "image/png" }
  ]
}
```

### 6-5. `app/layout.tsx` 메타데이터

```tsx
export const metadata = {
  title: '삐롱',
  description: '안 챙기면 삐지는 습관 앱',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: '삐롱',
  },
  themeColor: '#F5E6D3',
};
```

### 6-6. Step 7 완료 정의

- [ ] Android Chrome에서 "홈 화면에 추가" 프롬프트 자동 표시
- [ ] iOS Safari에서 수동 설치 → standalone 모드로 실행
- [ ] 오프라인에서 앱이 열림 (HTML은 NetworkFirst라 새 콘텐츠는 못 보지만 앱 셸은 열림)

---

## 7. Step 8: Settings 페이지

### 요구사항

```
1. 상단에 삐롱이 잠자는 일러스트 (/bbirong/sleep.png, 100x100)
2. 사용자 이메일 표시 (Supabase auth.getUser)
3. 테마 토글 (next-themes useTheme)
4. "내 데이터 내보내기" 버튼
   - habits + habit_logs 전부 가져와서 JSON 파일 다운로드
   - 파일명: bbirong-export-YYYY-MM-DD.json
5. 로그아웃 버튼 (이미 존재)
```

### 데이터 내보내기 함수 예시

```ts
async function exportData() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const [habitsRes, logsRes] = await Promise.all([
    supabase.from('habits').select('*').eq('user_id', user.id),
    supabase.from('habit_logs').select('*').eq('user_id', user.id),
  ]);

  const exported = {
    exported_at: new Date().toISOString(),
    email: user.email,
    habits: habitsRes.data ?? [],
    habit_logs: logsRes.data ?? [],
  };

  const blob = new Blob([JSON.stringify(exported, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `bbirong-export-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
```

---

## 8. Step 9: 배포 + 검증

### 8-1. Vercel 환경변수

Vercel Dashboard → Settings → Environment Variables → **3개 환경 모두 체크**:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

### 8-2. Supabase Auth URL 설정

Authentication → URL Configuration:

```
Site URL: https://bbirong.vercel.app (또는 실제 도메인)

Redirect URLs:
  - https://bbirong.vercel.app/**
  - https://bbirong.vercel.app/callback
  - http://localhost:3000/**
  - http://localhost:3000/callback
```

### 8-3. Lighthouse 목표

| 항목 | 목표 |
|---|---|
| Performance | > 80 |
| Accessibility | > 90 |
| Best Practices | > 90 |
| SEO | > 90 |
| PWA Installable | ✅ |

### 8-4. 7일 실사용 검증

```
Day 1: 본인 휴대폰에 PWA 설치 → 습관 3개 추가 → 체크
Day 2: 자정 넘어서 새 날짜 작동 확인
Day 3: 다른 디바이스(가족 폰)로 로그인 → 데이터 동기화
Day 4: 메모 기능 사용
Day 5: 오프라인에서 앱 열기
Day 6: 친구 1명 회원가입 → 데이터 격리 확인
Day 7: 일주일 streak 달성 → 삐롱이 축하 애니메이션 확인
```

---

## 9. Critical Files (절대 빠뜨리지 말 것)

| 파일 | 역할 |
|---|---|
| `supabase/migrations/0001_init.sql` | 스키마 + RLS, 모든 보안의 출발점 |
| `middleware.ts` | 세션 쿠키 갱신, 빠뜨리면 자꾸 로그아웃 |
| `lib/supabase/server.ts` | 서버 클라이언트, `import 'server-only'` 필수 |
| `app/(app)/layout.tsx` | 세션 가드 + BottomNav |
| `app/(app)/today/page.tsx` | MVP 심장 |
| `lib/date.ts` | KST 단일 진입점 |
| `public/bbirong/*.png` | 마스코트 8종 (없으면 UI 깨짐) |

---

## 10. 1인 개발자 함정 (Claude Code가 미리 방어)

1. **RLS 정책 누락** → 본인 데이터 안 보임. 모든 테이블에 4종(SELECT/INSERT/UPDATE/DELETE) 정책 일괄 작성.
2. **서버/클라이언트 컴포넌트 혼동** → `'use client'` 명시, `lib/supabase/server.ts`는 `import 'server-only'`.
3. **미들웨어 누락** → JWT refresh 안 되어 자꾸 로그아웃.
4. **자정/시간대 버그** → `lib/date.ts`의 `getTodayKST()` 단일 진입점만 사용.
5. **PWA + OAuth 충돌** → v1.0은 이메일/비밀번호만.
6. **service worker stale 캐싱** → HTML은 NetworkFirst.
7. **.env.local commit** → `.gitignore`에 `.env*.local`.
8. **Vercel 환경 변수 누락** → 3개 환경 모두 입력 후 재배포.
9. **shadcn 다크모드 어긋남** → next-themes의 `attribute="class"`.
10. **마스코트 PNG 누락** → `/public/bbirong/` 폴더에 8개 파일 모두 있어야 UI 안 깨짐. 임시로 동일 이미지 8개 복사라도 둘 것.

---

## 11. v1.1 이후 (의도적 분리, 지금은 안 함)

- AI 코치 기능 ("못 지킬 것 같아요" 버튼 + 대화형 재조정)
- 주간 루틴 → 시간표 자동 생성
- 목표/마일스톤 CRUD
- 히트맵 + 통계
- 푸시 알림 (마스코트 감정 톤으로 "삐롱이가 슬퍼해요...")
- 앱 아이콘 동적 변경 (PWA 한계 — 네이티브 전환 시)
- OAuth (구글/카카오)
- 드래그 정렬

---

## 12. Claude Code 작업 시 주의사항

1. **이 문서의 결정 사항은 변경 금지.** 의문 있으면 사용자에게 확인 먼저.
2. **단계 건너뛰지 말 것.** Step 6 → 7 → 8 → 9 순서 유지.
3. **한 단계 완료될 때마다 사용자에게 보고 + 완료 정의 체크리스트 확인.**
4. **마스코트 PNG는 사용자가 별도 준비 중.** 코드에서는 경로(`/bbirong/normal.png`)만 참조하고, 파일 누락 시 placeholder 처리하지 말 것 — 사용자에게 알릴 것.
5. **모든 mutation은 server action.** 클라이언트는 TanStack Query로 invalidate.
6. **shadcn 컴포넌트는 미리 추가:** button, input, checkbox, sheet, toast, dialog, textarea.
7. **사용자는 비개발자.** 에러 발생 시 친절하게 무엇이 왜 잘못됐는지 설명. 명령어는 복붙 가능한 형태로.

---

## 13. 다음 작업 (Claude Code에게 명시적 지시)

지금 시작할 것:

```
1. lib/date.ts 작성 (위 코드 그대로)
2. lib/streak.ts 작성 (위 코드 그대로)
3. lib/habits.ts 에 toggleHabitLog, saveHabitNote server action 추가
4. shadcn에 sheet, textarea 컴포넌트 추가 (npx shadcn-ui@latest add sheet textarea)
5. components/today/TodayHeader.tsx 작성
6. components/today/TodayHabits.tsx 작성 (메모 기능 포함)
7. app/(app)/today/page.tsx 작성
8. /public/bbirong/ 폴더 만들고 사용자에게 마스코트 PNG 8장 준비 요청
9. 로컬에서 동작 확인 → 사용자에게 보고
```

완료되면 → Step 7 (PWA) 진행 허락 요청.

---

## 14. 사업계획 + 톤 규칙 (2026-05-23 추가)

### 사업계획 위치
`docs/business-plan.md` — 타겟 페르소나, 가격 전략(평생 14,900원), GTM, 검증 지표, Plan B/C, 죽음의 지표까지 모두 포함. **새 기능/카피 결정 시 먼저 참조.**

### 톤 규칙 (사업계획 §7) — 자동 검증됨

| ❌ 금지어 (ESLint 경고) | ✅ 권장어 |
|---|---|
| 갓생 | 평범한 매일 |
| 성공 | 다시 |
| 완벽 | 조금씩 |
| 달성 | 오늘만 |
| 화이팅 | 괜찮아 |

- `.eslintrc.json`의 `no-restricted-syntax` 규칙이 `Literal` / `JSXText` / `TemplateElement` 노드를 스캔.
- 의도된 사용(예: "갓생 *말고* 평범한 매일" 슬로건)은 인라인 `eslint-disable-next-line` 주석으로 예외.

### 메인 카피 (사업계획 §2)

| 위치 | 카피 |
|---|---|
| **메인 슬로건** (로그인 등 첫 인상) | "갓생 말고 평범한 매일" |
| **서브 카피** | "삐롱이가 매일 너를 기다려요" 또는 "또 못 지켜도 괜찮아요. 삐롱이는 화내지 않거든요." |
| **기능 태그라인** | "안 챙기면 삐지는 습관 앱" (CLAUDE.md §1과 동일) |

### 페르소나 (사업계획 §1) — UX 결정 시 누구를 위해 만드는지 떠올릴 것

- **1차**: 27세 직장인 3년차, 갓생에 지침, 챌린저스 환불 트라우마
- **2차**: 34세 워킹맘, 본인 챙기기 죄책감
- **타겟 아님**: 시험준비생 (열품타가 더 맞음)

### 죽음의 지표 (사업계획 §10) — 출시 후 모니터링

- M3 MAU < 300 → 컨셉 재검토
- M3 7일 retention < 20% → 마스코트 임팩트 약함
- M6 유료 전환 < 2% → 평생 결제 모델 실패
- M12 MRR < 100만원 → 종료 고려

### 가장 큰 위협 (사업계획 §14)

> **본인 번아웃.** 주 40시간 사이드는 무리. 매주 컨디션 체크 필수. Claude Code가 작업 부담을 가능한 한 가져갈 것.

---

*문서 끝.*
