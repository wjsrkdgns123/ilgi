import { ThemeToggle } from "@/components/theme/theme-toggle";
import { AuthForm } from "@/components/auth/auth-form";
import { MascotImage } from "@/components/mascot-image";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex flex-col px-6 pt-safe pb-safe">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="flex-1 flex flex-col justify-center max-w-sm w-full mx-auto">
        <div className="flex flex-col items-center gap-4 mb-10 text-center">
          {/* 마스코트 — 첫 인상의 핵심 */}
          <div className="relative">
            <div
              className="absolute inset-0 rounded-full bg-accent/30 blur-2xl"
              aria-hidden
            />
            <div className="relative animate-bbirong-breathe">
              <MascotImage mood="normal" size={140} priority />
            </div>
          </div>
          <div>
            <h1 className="text-5xl font-bold tracking-tight font-heading">
              삐롱
            </h1>
            {/* eslint-disable-next-line no-restricted-syntax -- 의도된 사용: "갓생 말고" 슬로건은 갓생을 반대하는 포지셔닝 */}
            <p className="text-lg text-foreground/85 mt-3 font-semibold">
              갓생 말고 평범한 매일
            </p>
            <p className="text-xs text-muted-foreground mt-1.5">
              삐롱이가 매일 너를 기다려요
            </p>
          </div>
        </div>

        <AuthForm />
      </div>
    </main>
  );
}
