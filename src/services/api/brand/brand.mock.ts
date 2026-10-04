import { type components } from "@services/openapi";

/**
 * 백엔드 서버 부재(2026-08-24 확인: eatiqlink-dev.onrender.com 전체 404) 중
 * UI 작업을 이어가기 위한 목 데이터.
 *
 * 새 백엔드 URL·스펙이 오면 `NEXT_PUBLIC_USE_MOCK`을 끄고 이 파일을 삭제한다.
 * 타입은 실제 DTO(`brand.type.ts`)를 그대로 쓰므로, 스펙이 바뀌면 타입 에러로 드러난다.
 */
import { type BrandSettingsView } from "./brand.view";

type GetBrandCompletionBasicResponseDto = components["schemas"]["GetBrandCompletionBasicResponseDto"];

/** 목 설정에서 폼이 저장하는 섹션들 */
type MockSettingsSection = "brandContract" | "brandPolicy" | "brandFee" | "brandAreaCriteria";

export const mockBrandSettings: BrandSettingsView = {
  brandType: "franchise",
};

/**
 * 목 저장 — 실제 서버처럼 값이 유지되도록 목 설정에 병합한다.
 */
export const mergeMockSettings = (section: MockSettingsSection, patch: object) => {
  mockBrandSettings[section] = {
    ...(mockBrandSettings[section] ?? {}),
    ...patch,
  } as BrandSettingsView[typeof section];
};

/**
 * 정보 완성 현황 — 실제 응답(2026-10-02, 기본 정보 탭, 아무것도 입력 안 한 상태)을 옮겼다.
 * 목에서는 탭이 달라도 이 값 하나로 패널을 그린다.
 */
export const mockBrandCompletion: GetBrandCompletionBasicResponseDto = {
  workspace_uid: 1,
  completion_rate: 0,
  total_fields: 29,
  completed_fields: 0,
  stage: { step: "시작", message: "회사 소개 자료를 브랜드의 말로 쓸 수 있어요" },
  next_task: {
    priority: 1,
    section_key: "brand_basic",
    field_key: "brand_name_ko",
    title: "브랜드 이름(한국어)",
    is_required: true,
    description: "해외 바이어가 브랜드를 찾을 때 쓰는 이름이에요",
  },
  remaining_tasks: [
    {
      priority: 2,
      section_key: "brand_basic",
      field_key: "brand_name_en",
      title: "브랜드 이름(영어)",
      is_required: true,
      description: "해외 바이어가 브랜드를 찾을 때 쓰는 이름이에요",
    },
    {
      priority: 3,
      section_key: "brand_contact",
      field_key: "name_ko",
      title: "담당자 이름(한국어)",
      is_required: true,
      description: "우리 회사 담당자를 알려줍니다",
    },
    {
      priority: 4,
      section_key: "brand_contact",
      field_key: "email",
      title: "담당자 이메일",
      is_required: true,
      description: "바이어의 회신이 도착할 주소입니다",
    },
  ],
  sections: {
    brand_basic: {
      title: "브랜드 기본 정보",
      completion_rate: 0,
      total_fields: 8,
      completed_fields: 0,
      fields: {
        brand_name_ko: false,
        brand_name_en: false,
        launch_year: false,
        ceo_name_ko: false,
        ceo_name_en: false,
        homepage_url: false,
        official_email: false,
        official_address: false,
      },
    },
    brand_intro: {
      title: "브랜드 소개",
      completion_rate: 0,
      total_fields: 7,
      completed_fields: 0,
      fields: {
        short_intro: false,
        detail_intro: false,
        category: false,
        price_positioning: false,
        key_point_01: false,
        key_point_02: false,
        key_point_03: false,
      },
    },
    brand_status: {
      title: "운영 현황",
      completion_rate: 0,
      total_fields: 9,
      completed_fields: 0,
      fields: {
        domestic_store_total_cnt: false,
        domestic_store_direct_cnt: false,
        overseas_store_total_cnt: false,
        avg_monthly_sales: false,
        avg_cost_per_customer: false,
        avg_store_area: false,
        avg_seat_cnt: false,
        target_audience: false,
        usage_context: false,
      },
    },
    brand_contact: {
      title: "연락처",
      completion_rate: 0,
      total_fields: 5,
      completed_fields: 0,
      fields: { name_ko: false, name_en: false, position: false, email: false, languages: false },
    },
  },
};
