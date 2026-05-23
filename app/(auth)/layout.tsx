import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Supabase 쿠키 사용 — 그룹 전체 SSR 강제
export const dynamic = "force-dynamic";

/**
 * 로그인되지 않은 사용자만 접근 가능한 라우트 그룹.
 * 이미 로그인된 사용자가 /login에 들어오면 /today로 리다이렉트.
 */
export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) redirect("/today");

  return <>{children}</>;
}
