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
  // 홈 디렉토리의 lockfile 때문에 워크스페이스 루트가 잘못 잡히는 것을 막는다
  turbopack: { root: import.meta.dirname },

  /**
   * 백엔드 프록시 — 브라우저는 같은 출처(/backend/*)로 요청하고, Next(Vercel) 서버가 백엔드로 넘긴다.
   * 백엔드가 HTTP뿐이라 HTTPS 배포 사이트에서 직접 부르면 브라우저가 막는다(Mixed Content).
   * 배포 환경 변수: NEXT_PUBLIC_API_URL=/backend, BACKEND_ORIGIN=http://<백엔드 주소>
   * 로컬처럼 NEXT_PUBLIC_API_URL에 백엔드 주소를 직접 넣으면 이 규칙은 쓰이지 않는다.
   * TODO(백엔드): HTTPS가 붙으면 NEXT_PUBLIC_API_URL을 그 주소로 바꾸고 프록시를 걷어낸다
   */
  // 회사 정보 설정 주소가 brand-settings → company-settings로 바뀌었다(바이어도 같은 화면을 쓴다). 옛 링크·북마크용. ?tab= 쿼리는 그대로 넘어간다
  async redirects() {
    return [{ source: "/:workspaceId/brand-settings", destination: "/:workspaceId/company-settings", permanent: false }];
  },

  async rewrites() {
    const backendOrigin = process.env.BACKEND_ORIGIN;
    if (!backendOrigin) {
      return [];
    }
    return [{ source: "/backend/:path*", destination: `${backendOrigin}/:path*` }];
  },
};

export default withPWA(nextConfig);
