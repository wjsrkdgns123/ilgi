import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * 모든 요청에서 호출되어 Supabase 세션 쿠키를 갱신한다.
 * 이걸 빠뜨리면 사용자가 일정 시간 뒤 갑자기 로그아웃되는 현상이 발생.
 *
 * project root의 `middleware.ts`에서 호출.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // 중요: createServerClient와 supabase.auth.getUser() 사이에 어떤 코드도 두지 말 것.
  // 세션 검사가 가장 먼저 이뤄져야 함.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // (참고) 추후 보호 라우트 자동 리다이렉트를 여기서 처리할 수 있음.
  // 현재는 (app) layout에서 직접 가드를 둠.
  void user;

  return supabaseResponse;
}
