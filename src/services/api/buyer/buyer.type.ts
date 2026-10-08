import { type components } from "@services/openapi";

/************************************
 * 회사 정보 설정 — 바이어 섹션별 저장값 (읽기)
 *
 * 워크스페이스 상세의 buyer.* 섹션과 저장 응답이 같은 *DataDto를 쓴다(빈 칸은 null로 온다).
 ************************************/
export type BuyerBasicData = components["schemas"]["BuyerBasicDataDto"];
export type BuyerStatusData = components["schemas"]["BuyerStatusDataDto"];
export type BuyerIntroData = components["schemas"]["BuyerIntroDataDto"];
export type BuyerContractPolicyData = components["schemas"]["BuyerContractPolicyDataDto"];
export type BuyerContactData = components["schemas"]["BuyerContactDataDto"];

/************************************
 * 회사 정보 설정 — 바이어 섹션별 저장 (PUT, 전체 치환)
 ************************************/
/** 회사 기본 정보 */
export type UpdateBuyerBasicRequest = components["schemas"]["UpdateBuyerBasicDto"];
export type UpdateBuyerBasicResponse = components["schemas"]["UpdateBuyerBasicResponseDto"];

/** 현재 운영 현황 */
export type UpdateBuyerStatusRequest = components["schemas"]["UpdateBuyerStatusDto"];
export type UpdateBuyerStatusResponse = components["schemas"]["UpdateBuyerStatusResponseDto"];

/**
 * 운영 현황 요청 본문 — 스펙 타입에서 두 선택 항목만 null을 허용하도록 넓힌다.
 *
 * 이 두 필드만 동작이 다르다(400·200 응답으로 확인, 2026-10-08): 보내지 않으면 서버가 기존 값을 그대로 두고,
 * null을 보내야 비워진다. 다른 섹션의 선택 항목은 보내지 않으면 비워진다(전체 치환).
 * 스펙은 null을 허용하지 않아(brand_count?: number) 비울 방법이 타입에 없다.
 * TODO(백엔드): 다른 섹션처럼 빼면 비우거나, 스펙에 null을 허용해 달라고 요청함 — 반영되면 이 타입을 지운다
 */
export type UpdateBuyerStatusBody = Omit<UpdateBuyerStatusRequest, "korean_brand_experience" | "brand_count"> & {
  korean_brand_experience?: boolean | null;
  brand_count?: number | null;
};

/** 회사 소개 */
export type UpdateBuyerIntroRequest = components["schemas"]["UpdateBuyerIntroDto"];
export type UpdateBuyerIntroResponse = components["schemas"]["UpdateBuyerIntroResponseDto"];

/** 계약 정책 정보 */
export type UpdateBuyerContractPolicyRequest = components["schemas"]["UpdateBuyerContractPolicyDto"];
export type UpdateBuyerContractPolicyResponse = components["schemas"]["UpdateBuyerContractPolicyResponseDto"];

/** 연락처 */
export type UpdateBuyerContactRequest = components["schemas"]["UpdateBuyerContactDto"];
export type UpdateBuyerContactResponse = components["schemas"]["UpdateBuyerContactResponseDto"];

/************************************
 * 정보 완성 현황
 ************************************/
export type BuyerCompletionResponse = components["schemas"]["GetBuyerCompletionResponseDto"];

export type BuyerCompletionStep = components["schemas"]["BuyerCompletionStageDto"]["step"];

/** 다음 할 일·남은 항목 한 칸 → BrandCompletionTask 주석 참고 */
export type BuyerCompletionTask = {
  title: string;
  description: string;
  isRequired: boolean;
  /** 이동할 섹션 — 화면 섹션의 id(buyer_basic 등) */
  sectionKey: string;
  /** 포커스할 필드 — 폼 필드 이름(DTO 필드명)과 같다 */
  fieldKey: string;
};

/** 저니 패널 뷰모델 */
export type BuyerCompletion = {
  rate: number;
  totalFields: number;
  completedFields: number;
  step: BuyerCompletionStep;
  /** 단계별 안내 문구 — 서버가 준다(줄바꿈 \n 포함) */
  stepMessage: string;
  nextTask: BuyerCompletionTask | null;
  remainingTasks: BuyerCompletionTask[];
};
