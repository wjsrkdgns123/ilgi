import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { BottomNav } from "@/components/nav/bottom-nav";
import { QueryProvider } from "@/components/providers/query-provider";

// Supabase 쿠키 사용 — 그룹 전체 SSR 강제
export const dynamic = "force-dynamic";

/**
 * 로그인 필요 라우트 그룹.
 * 서버에서 세션 검사. 없으면 /login 으로.
 * 로그인된 사용자에겐 TanStack Query Provider + BottomNav 제공.
 */
export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <QueryProvider>
      <div className="min-h-screen flex flex-col bg-background">
        <div className="flex-1 pb-20">{children}</div>
        <BottomNav />
      </div>
    </QueryProvider>
  );
}
