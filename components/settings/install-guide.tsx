"use client";

import * as React from "react";
import { Smartphone, Share, Plus } from "lucide-react";

/**
 * 「홈 화면에 추가」 안내 카드.
 * - 이미 standalone(PWA로 설치된 상태)이면 카드 자체 숨김
 * - iOS 사파리에는 자동 프롬프트가 없으므로 단계별 안내
 * - Android Chrome도 안내 (자동 프롬프트가 가끔 안 뜸)
 */

type Platform = "ios" | "android" | "desktop" | "unknown";

function detectPlatform(): Platform {
  if (typeof navigator === "undefined") return "unknown";
  const ua = navigator.userAgent;
  if (/iPad|iPhone|iPod/.test(ua)) return "ios";
  if (/Android/.test(ua)) return "android";
  if (/Mac|Win|Linux/.test(ua)) return "desktop";
  return "unknown";
}

export function InstallGuide() {
  const [mounted, setMounted] = React.useState(false);
  const [isStandalone, setIsStandalone] = React.useState(false);
  const [platform, setPlatform] = React.useState<Platform>("unknown");

  React.useEffect(() => {
    setMounted(true);
    setPlatform(detectPlatform());
    // standalone 모드 감지 (PWA 설치 후 실행 중)
    const mql = window.matchMedia("(display-mode: standalone)");
    const checkStandalone = () => {
      const isS =
        mql.matches ||
        // iOS Safari는 별도 API
        (window.navigator as Navigator & { standalone?: boolean }).standalone ===
          true;
      setIsStandalone(isS);
    };
    checkStandalone();
    mql.addEventListener("change", checkStandalone);
    return () => mql.removeEventListener("change", checkStandalone);
  }, []);

  if (!mounted) return null;
  if (isStandalone) {
    return (
      <div className="rounded-lg border border-border bg-secondary/40 px-4 py-3 flex items-center gap-2 text-sm">
        <Smartphone className="size-4 text-primary shrink-0" />
        <p>홈 화면 앱으로 잘 쓰고 있어요. 멋져요!</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card px-4 py-4 flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Smartphone className="size-4 text-primary" />
        <p className="text-sm font-medium">홈 화면에 추가</p>
      </div>

      {platform === "ios" && (
        <ol className="text-xs text-muted-foreground space-y-1.5 ml-1">
          <li className="flex items-start gap-2">
            <span className="inline-flex size-4 shrink-0 rounded-full bg-muted items-center justify-center text-[10px] font-bold text-foreground">
              1
            </span>
            <span>
              사파리 하단의{" "}
              <Share className="inline size-3 mb-0.5" /> 공유 버튼 탭
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="inline-flex size-4 shrink-0 rounded-full bg-muted items-center justify-center text-[10px] font-bold text-foreground">
              2
            </span>
            <span>
              <Plus className="inline size-3 mb-0.5" /> 「홈 화면에 추가」 선택
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="inline-flex size-4 shrink-0 rounded-full bg-muted items-center justify-center text-[10px] font-bold text-foreground">
              3
            </span>
            <span>오른쪽 위 「추가」 탭 — 끝!</span>
          </li>
        </ol>
      )}

      {platform === "android" && (
        <ol className="text-xs text-muted-foreground space-y-1.5 ml-1">
          <li className="flex items-start gap-2">
            <span className="inline-flex size-4 shrink-0 rounded-full bg-muted items-center justify-center text-[10px] font-bold text-foreground">
              1
            </span>
            <span>크롬 우상단 메뉴(⋮) 탭</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="inline-flex size-4 shrink-0 rounded-full bg-muted items-center justify-center text-[10px] font-bold text-foreground">
              2
            </span>
            <span>「앱 설치」 또는 「홈 화면에 추가」 선택</span>
          </li>
        </ol>
      )}

      {(platform === "desktop" || platform === "unknown") && (
        <p className="text-xs text-muted-foreground">
          모바일(아이폰/안드로이드)에서 접속하면 홈 화면에 앱처럼 설치할 수
          있어요.
        </p>
      )}
    </div>
  );
}
