import Link from "next/link";
import { ArrowLeft } from "lucide-react";

/**
 * 법적 문서 (개인정보처리방침, 이용약관) 라우트 그룹.
 * 인증 무관하게 접근 가능. BottomNav 없음. 단순 chrome.
 */
export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b border-border pt-safe">
        <div className="flex items-center gap-2 px-4 h-14 max-w-2xl mx-auto">
          <Link
            href="/today"
            className="p-2 -ml-2 rounded-lg hover:bg-muted transition-colors"
            aria-label="돌아가기"
          >
            <ArrowLeft className="size-5" />
          </Link>
          <span className="text-sm text-muted-foreground">삐롱</span>
        </div>
      </header>
      <main className="max-w-2xl mx-auto px-4 py-8 pb-12">{children}</main>
    </div>
  );
}
