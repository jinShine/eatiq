import { type Metadata } from "next";

const TITLE = "";
const DESCRIPTION = "";
const BASE_URL = "https://app.store-watch.ai"; // 예) https://app.store-watch.ai/

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

  // 검색 엔진 키워드 (현재는 대부분의 검색 엔진이 무시하지만, 참고용으로 포함)
  keywords: [
    "Watch",
    "데이터 퓨레, forSPACElab",
    "포스페이스랩",
    "프렌차이즈",
    "매장 영업",
    "가맹 영업",
    "가맹 본부",
    "가맹 관리",
    "퓨레링크",
    "pureelink",
    "AI",
    "계약관리",
    "전자계약",
  ],

  // 페이지 작성자 정보
  authors: [{ name: "forSPACElab, inc." }],

  // 파비콘 설정
  icons: {
    icon: "/favicon.png",
  },

  verification: {
    google: "",
    other: {
      "naver-site-verification": "",
    },
  },

  // Open Graph 메타데이터 (소셜 미디어 공유 시 표시되는 정보)
  openGraph: {
    title: TITLE, // 공유 시 표시될 제목
    description: DESCRIPTION, // 공유 시 표시될 설명
    images: [
      {
        url: "/og-image.png", // 공유 시 표시될 이미지 URL
        width: 800, // 이미지 너비
        height: 400, // 이미지 높이
        type: "image/png", // 이미지 타입
        alt: `${TITLE}-og-image`, // 이미지 대체 텍스트
      },
    ],
    locale: "ko_KR", // 페이지 언어 설정
    type: "website", // 콘텐츠 타입 (website, article, product 등)
    url: BASE_URL, // 페이지의 표준 URL
    siteName: DESCRIPTION, // 웹사이트 이름
  },

  // Twitter 카드 메타데이터 (트위터 공유 시 표시되는 정보)
  twitter: {
    title: TITLE, // 트위터 공유 시 표시될 제목
    description: DESCRIPTION, // 트위터 공유 시 표시될 설명
    images: [
      {
        url: "/og-image.png", // 트위터 카드 이미지 URL
        width: 800, // 이미지 너비
        height: 400, // 이미지 높이
      },
    ],
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
