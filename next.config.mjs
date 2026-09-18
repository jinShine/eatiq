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
   * 개발용 API 프록시.
   *
   * 백엔드에 CORS 설정이 없어(OPTIONS 404, Access-Control-Allow-Origin 없음)
   * 브라우저에서 직접 호출할 수 없다. Next 서버가 대신 호출하면 브라우저 입장에서는
   * 같은 오리진이라 프리플라이트 자체가 발생하지 않는다.
   *
   * TODO(백엔드): CORS가 적용되면 이 프록시를 걷어내고 API_URL로 직접 호출한다.
   */
  async rewrites() {
    const target = process.env.API_PROXY_TARGET;

    if (!target) {
      return [];
    }

    return [{ source: "/api/:path*", destination: `${target}/api/:path*` }];
  },
};

export default withPWA(nextConfig);
