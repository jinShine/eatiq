import { type Metadata } from "next";

const TITLE = "EATIQ LINK";
const DESCRIPTION = "한국 F&B 브랜드의 해외 진출을 지원하는 B2B 플랫폼 — 바이어 매칭부터 계약까지 한 곳에서.";
const BASE_URL = "https://eatiq-nine.vercel.app";

/**
 * SEO Metadata Configuration
 */
export const seoMetadata: Metadata = {
  // 메타데이터의 기본 URL을 설정 (상대 URL을 절대 URL로 변환할 때 사용)
  metadataBase: new URL(BASE_URL),

  title: {
    // 기본 페이지 제목
    default: TITLE,
    // 동적 페이지 제목 템플릿 (%s 위치에 각 페이지 제목이 들어감)
    template: `%s | ${TITLE}`,
  },

  // 페이지 설명 (검색 결과에 표시됨)
  description: DESCRIPTION,

  // 검색 엔진 키워드
  keywords: ["EATIQ", "EATIQ LINK", "이팁", "F&B", "프랜차이즈", "해외 진출", "바이어 매칭", "상권 분석"],

  // 페이지 작성자 정보
  authors: [{ name: "EATIQ" }],

  // Open Graph 메타데이터 (소셜 미디어 공유 시 표시되는 정보)
  // 참고: OG 이미지는 추후 디자인 준비 후 images 필드로 추가
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    locale: "ko_KR", // 페이지 언어 설정
    type: "website", // 콘텐츠 타입
    url: BASE_URL, // 페이지의 표준 URL
    siteName: TITLE, // 웹사이트 이름
  },

  // Twitter 카드 메타데이터 (이미지 없으므로 summary 카드 사용)
  twitter: {
    card: "summary",
    title: TITLE,
    description: DESCRIPTION,
  },
};

/**
 * SEO 메타데이터를 동적으로 구성하는 메서드
 * @param metadata - 기본 메타데이터를 오버라이드할 부분적 메타데이터
 * @returns 완성된 메타데이터 객체
 */
export const configureSEOMetadata = (metadata?: Partial<Metadata>): Metadata => {
  return { ...seoMetadata, ...metadata };
};
