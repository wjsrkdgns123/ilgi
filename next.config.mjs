import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
  cacheOnNavigation: true,
  reloadOnOnline: true,
  // 개발 모드에선 service worker 비활성화 (Hot Reload 충돌 방지)
  disable: process.env.NODE_ENV === "development",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 향후 이미지 도메인 추가 필요 시 여기
};

export default withSerwist(nextConfig);
