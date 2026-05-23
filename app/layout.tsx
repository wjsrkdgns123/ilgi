/* eslint-disable no-restricted-syntax -- 의도된 사용: OG/메타에 "갓생 말고" 슬로건 (사업계획 §2 메인 슬로건) */
import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

// 프로덕션 도메인.
// 우선순위: NEXT_PUBLIC_SITE_URL (env) > 하드코딩 fallback.
// 커스텀 도메인 적용 시 fallback도 같이 갱신 권장.
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://ilgi-lime.vercel.app";
const OG_DESCRIPTION =
  "삐롱이가 매일 너를 기다려. 수달 마스코트가 감정으로 챙겨주는 습관 트래커.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "삐롱 — 안 챙기면 삐지는 습관 앱",
    template: "%s · 삐롱",
  },
  description: OG_DESCRIPTION,
  applicationName: "삐롱",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "삐롱",
    startupImage: ["/apple-touch-icon.png"],
  },
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "삐롱",
    title: "삐롱 — 갓생 말고 평범한 매일",
    description: OG_DESCRIPTION,
    url: SITE_URL,
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "삐롱 — 갓생 말고 평범한 매일",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "삐롱 — 갓생 말고 평범한 매일",
    description: OG_DESCRIPTION,
    images: ["/og.png"],
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F5E6D3" },
    { media: "(prefers-color-scheme: dark)", color: "#2A1F18" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css"
        />
        {/* iOS standalone PWA 추가 메타 */}
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster richColors position="top-center" />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
