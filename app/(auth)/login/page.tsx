import Image from "next/image";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { AuthForm } from "@/components/auth/auth-form";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex flex-col px-6 pt-safe pb-safe">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="flex-1 flex flex-col justify-center max-w-sm w-full mx-auto">
        <div className="flex flex-col items-center gap-3 mb-10 text-center">
          {/* 마스코트 자리 — 사용자가 PNG 준비 후 자동 표시 */}
          <Image
            src="/bbirong/normal.png"
            alt="삐롱이"
            width={100}
            height={100}
            priority
            // 파일 없으면 alt 텍스트만 표시되고 레이아웃은 유지
          />
          <div>
            <h1 className="text-4xl font-bold tracking-tight font-heading">
              삐롱
            </h1>
            {/* eslint-disable-next-line no-restricted-syntax -- 의도된 사용: "갓생 말고" 슬로건은 갓생을 반대하는 포지셔닝 */}
            <p className="text-base text-foreground/80 mt-2 font-medium">
              갓생 말고 평범한 매일
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              삐롱이가 매일 너를 기다려요
            </p>
          </div>
        </div>

        <AuthForm />
      </div>
    </main>
  );
}
