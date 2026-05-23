"use client";

import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

/**
 * TanStack Query Provider.
 * 각 사용자 세션마다 1개의 QueryClient 인스턴스를 유지.
 * Next.js App Router에선 서버 컴포넌트에서 매번 생성될 수 있으므로
 * useState로 한 번만 생성되도록 잠근다.
 */
export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [client] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30 * 1000, // 30초 — 짧은 화면 이동엔 캐시 사용
            refetchOnWindowFocus: false,
            retry: 1,
          },
          mutations: {
            retry: 0,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
}
