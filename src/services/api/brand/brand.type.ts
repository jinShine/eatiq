import { type components } from "@services/openapi";

/************************************
 * 조회
 ************************************/
export type BrandDetail = components["schemas"]["BrandDetailResponseDto"];
export type BrandListItem = components["schemas"]["BrandListItemDto"];
export type BrandListResponse = components["schemas"]["GetBrandListResponseDto"];

/************************************
 * 브랜드 정보 설정 — 섹션별 저장
 *
 * 이전 PATCH 한 방에 보내던 구조가 섹션별 PUT으로 나뉘었다.
 * (basic / intro / status / contact / contract / contract-policy /
 *  commission / location-standard / size-criteria / facility-req / menu / signature / visual)
 ************************************/

/************************************
 * 브랜드 정보 설정 — 섹션별 저장값 (읽기)
 *
 * 워크스페이스 상세의 brand.* 섹션은 스펙에 아직 Record<string, never>로 나온다.
 * 저장 응답에 붙는 *DataDto가 실제 저장값과 같은 모양이라 읽기에도 이걸 쓴다
 * (brand_basic은 실제 응답과 대조해 확인 — 빈 칸은 null로 온다).
 ************************************/
export type BrandBasicData = components["schemas"]["BrandBasicDataDto"];
export type BrandIntroData = components["schemas"]["BrandIntroDataDto"];
export type BrandStatusData = components["schemas"]["BrandStatusDataDto"];
export type BrandContactData = components["schemas"]["BrandContactDataDto"];

/** 기본 정보 — 브랜드명·런칭 연도·대표자·본사 연락처 */
export type UpdateBrandBasicRequest = components["schemas"]["UpdateBrandBasicDto"];
export type UpdateBrandBasicResponse = components["schemas"]["UpdateBrandBasicResponseDto"];

/** 브랜드 소개 — 한 줄·상세 소개, 업종, 가격대, 강점 */
export type UpdateBrandIntroRequest = components["schemas"]["UpdateBrandIntroDto"];
export type UpdateBrandIntroResponse = components["schemas"]["UpdateBrandIntroResponseDto"];

/** 운영 현황 — 매장 수·매출·객단가·평형 (이전 operation) */
export type UpdateBrandStatusRequest = components["schemas"]["UpdateBrandStatusDto"];
export type UpdateBrandStatusResponse = components["schemas"]["UpdateBrandStatusResponseDto"];

/** 브랜드 담당자 연락처 */
export type UpdateBrandContactRequest = components["schemas"]["UpdateBrandContactDto"];
export type UpdateBrandContactResponse = components["schemas"]["UpdateBrandContactResponseDto"];

/** 계약 담당자 */
export type UpdateBrandContractRequest = components["schemas"]["UpdateBrandContractDto"];
export type UpdateBrandContractResponse = components["schemas"]["UpdateBrandContractResponseDto"];

/** 계약 정책 — 독점권·현지화·상표·매뉴얼 */
export type UpdateBrandContractPolicyRequest = components["schemas"]["UpdateBrandContractPolicyDto"];
export type UpdateBrandContractPolicyResponse = components["schemas"]["UpdateBrandContractPolicyResponseDto"];

/** 수수료 — 가맹비·로열티 (이전 fee) */
export type UpdateBrandCommissionRequest = components["schemas"]["UpdateBrandCommissionDto"];
export type UpdateBrandCommissionResponse = components["schemas"]["UpdateBrandCommissionResponseDto"];

/** 입지 기준 — 선호 상권·임대료·층수·중요도 (이전 areaCriteria 일부) */
export type UpdateBrandLocationStandardRequest = components["schemas"]["UpdateBrandLocationStandardDto"];
export type UpdateBrandLocationStandardResponse = components["schemas"]["UpdateBrandLocationStandardResponseDto"];

/** 면적 기준 — 권장·최소·최대 평형, 최소 전면 폭 */
export type UpdateBrandSizeCriteriaRequest = components["schemas"]["UpdateBrandSizeCriteriaDto"];
export type UpdateBrandSizeCriteriaResponse = components["schemas"]["UpdateBrandSizeCriteriaResponseDto"];

/** 설비 요건 — 가스·급배수·직화·환기·냉장 */
export type UpdateBrandFacilityReqRequest = components["schemas"]["UpdateBrandFacilityReqDto"];
export type UpdateBrandFacilityReqResponse = components["schemas"]["UpdateBrandFacilityReqResponseDto"];

/** 대표 메뉴 */
export type UpdateBrandMenuRequest = components["schemas"]["UpdateBrandMenuDto"];
export type UpdateBrandMenuResponse = components["schemas"]["UpdateBrandMenuResponseDto"];

/** 시그니처 */
export type UpdateBrandSignatureRequest = components["schemas"]["UpdateBrandSignatureDto"];
export type UpdateBrandSignatureResponse = components["schemas"]["UpdateBrandSignatureResponseDto"];

/************************************
 * 브랜드 비주얼
 ************************************/
export type UpdateBrandLogoRequest = components["schemas"]["UpdateBrandLogoDto"];
export type UpdateBrandLogoResponse = components["schemas"]["UpdateBrandLogoResponseDto"];
export type UpdateBrandFeaturedImagesRequest = components["schemas"]["UpdateBrandFeaturedImagesDto"];
export type UpdateBrandFeaturedImagesResponse = components["schemas"]["UpdateBrandFeaturedImagesResponseDto"];
export type UpdateBrandFeaturedVideosRequest = components["schemas"]["UpdateBrandFeaturedVideosDto"];
export type UpdateBrandFeaturedVideosResponse = components["schemas"]["UpdateBrandFeaturedVideosResponseDto"];

/************************************
 * 정보 완성 현황 (저니 패널)
 *
 * 탭마다 별도 엔드포인트지만 패널이 쓰는 최상위 필드는 넷 다 같다.
 * 섹션별 세부(sections)만 탭마다 모양이 다르다.
 ************************************/
export type BrandCompletionScope = "basic" | "visual" | "contract" | "commercial";

export type BrandCompletionResponse =
  | components["schemas"]["GetBrandCompletionBasicResponseDto"]
  | components["schemas"]["GetBrandCompletionVisualResponseDto"]
  | components["schemas"]["GetBrandCompletionContractResponseDto"]
  | components["schemas"]["GetBrandCompletionCommercialResponseDto"];

export type BrandCompletionStep = components["schemas"]["BrandCompletionStageDto"]["step"];

/** 다음 할 일·남은 항목 한 칸 */
export type BrandCompletionTask = {
  title: string;
  description: string;
  isRequired: boolean;
  /**
   * 이동할 섹션. 화면 섹션의 id로 쓴다.
   * 기본 정보 탭은 저장 DTO 이름과 같지만(brand_basic) 다른 탭은 다르다(contract_manager 등)
   */
  sectionKey: components["schemas"]["BrandCompletionTaskDto"]["section_key"];
  /** 포커스할 필드 — 폼 필드 이름(DTO 필드명)과 같다 */
  fieldKey: string;
};

/** 저니 패널 뷰모델 */
export type BrandCompletion = {
  rate: number;
  totalFields: number;
  completedFields: number;
  step: BrandCompletionStep;
  /** 단계별 안내 문구 — 서버가 준다 */
  stepMessage: string;
  nextTask: BrandCompletionTask | null;
  remainingTasks: BrandCompletionTask[];
};
