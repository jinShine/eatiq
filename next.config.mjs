import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public", // 서비스 워커 파일이 생성될 위치
  cacheOnFrontEndNav: true, // 프론트엔드 내비게이션 시 캐싱 여부
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  swcMinify: true,
  disable: process.env.NODE_ENV === "development", // 개발 환경에서는 비활성화 권장
  // disable: false,
  workboxOptions: {
    disableDevLogs: true,
    importScripts: ["/firebase-messaging-sw.js"],
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  turbopack: {},
};

export default withPWA(nextConfig);
