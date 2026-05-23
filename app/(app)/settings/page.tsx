import Image from "next/image";
import { TopBar } from "@/components/nav/top-bar";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { LogoutButton } from "@/components/settings/logout-button";
import { ExportDataButton } from "@/components/settings/export-data-button";
import { InstallGuide } from "@/components/settings/install-guide";
import { createClient } from "@/lib/supabase/server";

export default async function SettingsPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <>
      <TopBar title="설정" />
      <main className="max-w-md mx-auto px-4 py-4 flex flex-col gap-8">
        {/* 잠자는 삐롱이 — 설정 화면의 시그니처 */}
        <div className="flex flex-col items-center gap-2 pt-4">
          <Image
            src="/bbirong/sleep.png"
            alt="자고 있는 삐롱이"
            width={100}
            height={100}
            priority
            className="select-none"
          />
          <p className="text-xs text-muted-foreground">
            삐롱이는 여기서 자고 있어
          </p>
        </div>

        {/* 계정 */}
        <section className="flex flex-col gap-2">
          <p className="text-xs text-muted-foreground uppercase tracking-wider px-1">
            계정
          </p>
          <div className="rounded-lg border border-border bg-card px-4 py-3">
            <p className="text-xs text-muted-foreground">로그인 이메일</p>
            <p className="text-sm font-medium mt-0.5 break-all">
              {user?.email ?? "—"}
            </p>
          </div>
        </section>

        {/* 화면 */}
        <section className="flex flex-col gap-2">
          <p className="text-xs text-muted-foreground uppercase tracking-wider px-1">
            화면
          </p>
          <div className="rounded-lg border border-border bg-card px-4 py-3 flex items-center justify-between">
            <p className="text-sm">다크 / 라이트 모드</p>
            <ThemeToggle />
          </div>
        </section>

        {/* 설치 */}
        <section className="flex flex-col gap-2">
          <p className="text-xs text-muted-foreground uppercase tracking-wider px-1">
            앱 설치
          </p>
          <InstallGuide />
        </section>

        {/* 데이터 */}
        <section className="flex flex-col gap-2">
          <p className="text-xs text-muted-foreground uppercase tracking-wider px-1">
            데이터
          </p>
          <ExportDataButton />
          <p className="text-xs text-muted-foreground px-1 mt-1">
            모든 습관과 기록을 JSON 파일로 받을 수 있어. 너의 데이터는 너의 것.
          </p>
        </section>

        {/* 세션 */}
        <section className="flex flex-col gap-2">
          <p className="text-xs text-muted-foreground uppercase tracking-wider px-1">
            세션
          </p>
          <LogoutButton />
        </section>

        <p className="text-center text-xs text-muted-foreground/60 mt-4 pb-4">
          삐롱 · v1.0
        </p>
      </main>
    </>
  );
}
