import Link from "next/link";
import type { Metadata } from "next";
import { MascotImage } from "@/components/mascot-image";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "찾을 수 없는 페이지 · 삐롱",
};

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 pt-safe pb-safe text-center">
      <MascotImage mood="away" size={140} priority />

      <h1 className="text-2xl font-bold mt-6 mb-1">
        삐롱이도 이 곳은 모르겠대
      </h1>
      <p className="text-sm text-muted-foreground mb-1">
        주소가 잘못됐거나, 페이지가 사라졌어.
      </p>
      <p className="text-xs text-muted-foreground/70 mb-8">404 · Not Found</p>

      <div className="flex flex-col gap-2 w-full max-w-xs">
        <Button asChild className="w-full">
          <Link href="/today">오늘로 돌아가기</Link>
        </Button>
        <Button asChild variant="ghost" className="w-full">
          <Link href="/login">로그인 페이지로</Link>
        </Button>
      </div>
    </main>
  );
}
