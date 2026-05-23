import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Supabase 쿠키 사용 — 정적 프리렌더 불가, 요청 시 SSR
export const dynamic = "force-dynamic";

/**
 * 루트 페이지 — 세션 유무에 따라 분기.
 * - 로그인됨 → /today
 * - 로그인 안 됨 → /login
 */
export default async function Home() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) redirect("/today");
  redirect("/login");
}
