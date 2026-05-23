# 삐롱 (Bbirong)

> **갓생 말고 평범한 매일.** 삐롱이가 매일 너를 기다려.

비난하지 않는 수달 마스코트가 감정으로 챙겨주는 PWA 기반 습관 트래커.

| 영역 | 결정 |
|---|---|
| 프레임워크 | Next.js 14 (App Router) |
| 스타일 | Tailwind v4 + shadcn/ui (base-nova) |
| 인증/DB | Supabase + `@supabase/ssr` |
| 상태 | TanStack Query + React Hook Form + Zod v4 |
| 시간 | date-fns + date-fns-tz (KST 단일 진입점) |
| PWA | Serwist |
| 배포 | Vercel |

---

## 핵심 기능 (v1.0)

- **이메일 회원가입/로그인** + 세션 자동 갱신 미들웨어
- **습관 CRUD** — 제목, 이모지, 매일/특정 요일 빈도
- **오늘 뷰** — 마스코트 감정 + 큰 체크박스 + 낙관적 업데이트 + 한 줄 메모 + streak
- **PWA 설치** — Android 자동 프롬프트, iOS 「홈 화면에 추가」 안내
- **데이터 내보내기** — 본인 habits + habit_logs 전체를 JSON 으로
- **다크/라이트 테마** — system 따라가기 기본
- **RLS 데이터 격리** — 모든 테이블 24개 정책으로 본인 데이터만

---

## 로컬 개발 시작하기

### 사전 준비

- Node.js 20+ (24 권장)
- npm 10+
- Supabase 프로젝트 (URL + Publishable key)

### 셋업

```bash
# 1. 의존성 설치
npm install

# 2. 환경 변수 입력
cp .env.local.example .env.local
# .env.local 을 열어 NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY 채우기

# 3. Supabase 스키마 적용
# Supabase 대시보드 → SQL Editor → supabase/migrations/0001_init.sql 내용 실행

# 4. 개발 서버
npm run dev
```

브라우저에서 http://localhost:3000 접속.

### 환경 변수

| 키 | 설명 |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxx.supabase.co` 형식 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `sb_publishable_...` (신형) 또는 `eyJ...` (구형 anon JWT) |

⚠️ Service Role Key는 **절대** `NEXT_PUBLIC_*` 으로 노출하지 말 것.

### 주요 스크립트

```bash
npm run dev      # 개발 서버 (Serwist 비활성)
npm run build    # 프로덕션 빌드 (Service Worker 생성)
npm run start    # 프로덕션 서버 (PWA 동작 검증용)
npm run lint     # ESLint (톤 규칙 자동 검증 포함)
```

---

## 프로젝트 구조

```
.
├── app/                    Next.js App Router
│   ├── (auth)/login        이메일 로그인/회원가입
│   ├── (app)/              로그인 필요 라우트 (BottomNav + 세션 가드)
│   │   ├── today           ★ MVP 심장 — 오늘 습관 체크
│   │   ├── habits          습관 CRUD
│   │   └── settings        계정/테마/데이터 내보내기
│   ├── auth/callback       Supabase PKCE
│   └── sw.ts               Service Worker (Serwist)
├── components/             UI 컴포넌트 (shadcn/ui + 도메인)
├── lib/
│   ├── supabase/           브라우저/서버/미들웨어 클라이언트 (분리)
│   ├── date.ts             KST 단일 진입점
│   ├── streak.ts           연속일 계산
│   ├── habits.ts           Server Actions
│   └── auth-errors.ts      Supabase 에러 한국어 매핑
├── public/bbirong/         마스코트 PNG 8종
├── supabase/migrations/    DB 스키마 + RLS
├── middleware.ts           세션 쿠키 자동 갱신
├── CLAUDE.md               합의 명세 (Single Source of Truth)
└── docs/business-plan.md   사업계획 + 타겟 + 톤 규칙
```

---

## 데이터 모델

```
auth.users (Supabase)
   └─ goals ── milestones
        └─ routines ──┬─ schedule_blocks
                      └─ habits ── habit_logs (note 컬럼 = "오늘의 한 줄")
```

모든 테이블에 `user_id` + RLS 4종 정책(SELECT/INSERT/UPDATE/DELETE). 부모 조인 RLS 안 씀 — 단순 `auth.uid() = user_id`.

---

## 톤 규칙 (자동 검증)

ESLint `no-restricted-syntax` 가 다음 단어를 코드/JSX/템플릿에서 자동 경고:

- ❌ **갓생 / 성공 / 완벽 / 달성 / 화이팅**
- ✅ **괜찮아 / 다시 / 오늘만 / 조금씩**

의도된 사용(예: "갓생 *말고* 평범한 매일")은 `// eslint-disable-next-line` 으로 예외.

---

## 배포 (Vercel)

1. https://vercel.com/new → Import `wjsrkdgns123/ilgi`
2. Environment Variables 등록 — Production/Preview/Development 3환경 모두
3. Deploy
4. Supabase 대시보드 → Authentication → URL Configuration 에 배포 도메인 등록
   - Site URL: `https://<your-domain>`
   - Redirect URLs: `https://<your-domain>/**`, `https://<your-domain>/auth/callback`

자세한 단계는 `CLAUDE.md` §8 참고.

---

## v1.1 이후 (의도적 분리)

- 한 줄 메모 회상 뷰 + 일기 모드 확장
- 주간 루틴 / 목표·마일스톤 / 통계·히트맵
- 푸시 알림 (iOS 16.4+ PWA)
- OAuth (구글/카카오)
- AI 코치 (사업계획 §4)
- 평생 결제 14,900원 — 토스페이먼츠/포트원 (사업계획 §4)

---

## 라이선스

MIT (예정). 마스코트 일러스트는 별도 IP.

---

## 문서

- [`CLAUDE.md`](./CLAUDE.md) — 작업 합의 명세 (모든 결정의 단일 진실)
- [`docs/business-plan.md`](./docs/business-plan.md) — 사업계획, 페르소나, GTM
