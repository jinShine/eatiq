import { IBM_Plex_Mono, IBM_Plex_Sans_KR } from "next/font/google";

/**
 * 본문·제목 폰트 — IBM Plex Sans KR
 * 디자인 시스템: 300/400/500/600/700 weight 사용
 */
export const sansFont = IBM_Plex_Sans_KR({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

/**
 * 숫자·금액·코드 폰트 — IBM Plex Mono
 * 디자인 시스템: 점수·금액·코드를 또렷하게 표현
 */
export const monoFont = IBM_Plex_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});
