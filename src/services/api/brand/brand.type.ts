import { type components, type operations } from "@services/openapi";

/************************************
 * 브랜드 탐색 — 목록·상세 조회
 ************************************/
export type BrandListQuery = NonNullable<operations["GetBrandListController_execute"]["parameters"]["query"]>;
export type BrandDetail = components["schemas"]["BrandDetailResponseDto"];
export type BrandListItem = components["schemas"]["BrandListItemDto"];
export type BrandListResponse = components["schemas"]["GetBrandListResponseDto"];

/************************************
 * 브랜드 정보 설정 — 섹션별 저장
 *
 * 이전 PATCH 한 방에 보내던 구조가 섹션별 PUT으로 나뉘었다.
 * (basic / intro / status / contact / contract / contract-policy /
 *  commission / location-standard / size-criteria / facility-req / menu / signature / visual)
 *
 * 2026-11-19부터 모든 필드가 선택이고 부분 업데이트다 — 보내지 않은 필드는 서버가 그대로 둔다.
 * 값을 지우려면 null을 보낸다(테스트 워크스페이스로 실측. 선택값에 ""를 보내면 400).
 * 스펙의 요청 타입에는 null이 없어 Clearable로 넓힌다
 ************************************/

/** 모든 필드에 null(지우기)을 허용한 요청 타입 */
type Clearable<T> = { [K in keyof T]?: T[K] | null };

/************************************
 * 브랜드 정보 설정 — 섹션별 저장값 (읽기)
 *
 * 워크스페이스 상세의 brand.* 섹션과 저장 응답이 같은 *DataDto를 쓴다(빈 칸은 null로 온다).
 ************************************/
export type BrandBasicData = components["schemas"]["BrandBasicDataDto"];
export type BrandIntroData = components["schemas"]["BrandIntroDataDto"];
export type BrandStatusData = components["schemas"]["BrandStatusDataDto"];
export type BrandContactData = components["schemas"]["BrandContactDataDto"];
export type BrandContractData = components["schemas"]["BrandContractDataDto"];
export type BrandSignatureData = components["schemas"]["BrandSignatureDataDto"];
export type BrandContractPolicyData = components["schemas"]["BrandContractPolicyDataDto"];
export type BrandCommissionData = components["schemas"]["BrandCommissionDataDto"];
export type BrandLocationStandardData = components["schemas"]["BrandLocationStandardDataDto"];
export type BrandSizeCriteriaData = components["schemas"]["BrandSizeCriteriaDataDto"];
export type BrandFacilityReqData = components["schemas"]["BrandFacilityReqDataDto"];
export type BrandVisualData = components["schemas"]["BrandVisualDataDto"];
export type BrandMenuItem = components["schemas"]["MenuItemResponseDto"];
export type BrandStoreData = components["schemas"]["BrandStoreDataDto"];

/** 기본 정보 — 브랜드명·런칭 연도·대표자·본사 연락처 */
export type UpdateBrandBasicRequest = Clearable<components["schemas"]["UpdateBrandBasicDto"]>;
export type UpdateBrandBasicResponse = components["schemas"]["UpdateBrandBasicResponseDto"];

/** 브랜드 소개 — 한 줄·상세 소개, 업종, 가격대, 강점 */
export type UpdateBrandIntroRequest = Clearable<components["schemas"]["UpdateBrandIntroDto"]>;
export type UpdateBrandIntroResponse = components["schemas"]["UpdateBrandIntroResponseDto"];

/** 운영 현황 — 매장 수·매출·객단가·평형 (이전 operation) */
export type UpdateBrandStatusRequest = Clearable<components["schemas"]["UpdateBrandStatusDto"]>;
export type UpdateBrandStatusResponse = components["schemas"]["UpdateBrandStatusResponseDto"];

/** 브랜드 담당자 연락처 */
export type UpdateBrandContactRequest = Clearable<components["schemas"]["UpdateBrandContactDto"]>;
export type UpdateBrandContactResponse = components["schemas"]["UpdateBrandContactResponseDto"];

/** 계약 담당자 */
export type UpdateBrandContractRequest = Clearable<components["schemas"]["UpdateBrandContractDto"]>;
export type UpdateBrandContractResponse = components["schemas"]["UpdateBrandContractResponseDto"];

/** 계약 정책 — 독점권·현지화·상표·매뉴얼 */
export type UpdateBrandContractPolicyRequest = Clearable<components["schemas"]["UpdateBrandContractPolicyDto"]>;
export type UpdateBrandContractPolicyResponse = components["schemas"]["UpdateBrandContractPolicyResponseDto"];

/** 수수료 — 가맹비·로열티 (이전 fee) */
export type UpdateBrandCommissionRequest = Clearable<components["schemas"]["UpdateBrandCommissionDto"]>;
export type UpdateBrandCommissionResponse = components["schemas"]["UpdateBrandCommissionResponseDto"];

/** 입지 기준 — 선호 상권·임대료·층수·중요도 (이전 areaCriteria 일부) */
export type UpdateBrandLocationStandardRequest = Clearable<components["schemas"]["UpdateBrandLocationStandardDto"]>;
export type UpdateBrandLocationStandardResponse = components["schemas"]["UpdateBrandLocationStandardResponseDto"];

/** 면적 기준 — 권장·최소·최대 평형, 최소 전면 폭 */
export type UpdateBrandSizeCriteriaRequest = Clearable<components["schemas"]["UpdateBrandSizeCriteriaDto"]>;
export type UpdateBrandSizeCriteriaResponse = components["schemas"]["UpdateBrandSizeCriteriaResponseDto"];

/** 설비 요건 — 가스·급배수·직화·환기·냉장 */
export type UpdateBrandFacilityReqRequest = Clearable<components["schemas"]["UpdateBrandFacilityReqDto"]>;
export type UpdateBrandFacilityReqResponse = components["schemas"]["UpdateBrandFacilityReqResponseDto"];

/** 대표 메뉴 */
export type UpdateBrandMenuRequest = components["schemas"]["UpdateBrandMenuDto"];
export type UpdateBrandMenuResponse = components["schemas"]["UpdateBrandMenuResponseDto"];

/** 대표 매장 */
export type UpdateBrandStoreRequest = Clearable<components["schemas"]["UpdateBrandStoreDto"]>;
export type UpdateBrandStoreResponse = components["schemas"]["UpdateBrandStoreResponseDto"];

/** 시그니처 */
export type UpdateBrandSignatureRequest = Clearable<components["schemas"]["UpdateBrandSignatureDto"]>;
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

/************************************
 * 대시보드 — GET /api/workspace/{workspace_uid}/brand/dashboard
 ************************************/
export type BrandDashboardResponse = components["schemas"]["GetBrandDashboardResponseDto"];

/** 자동완성 — 진행 관리 「검색해서 추가」. 2글자 이상부터(미만은 400) */
export type BrandAutocompleteResponse = components["schemas"]["AutocompleteBrandResponseDto"];
export type BrandAutocompleteItem = components["schemas"]["BrandAutocompleteItemDto"];

/************************************
 * 브랜드 소개 영상 — 비동기 생성. 생성 요청 뒤 조회로 상태를 확인한다
 * 응답은 { code, message, data }로 감싸져 온다(문서 API의 statusCode와 다르다)
 ************************************/
export type BrandVideoResponse = components["schemas"]["GetBrandVideoResponseDto"];
export type BrandVideoData = components["schemas"]["GetBrandVideoDataDto"];
export type BrandVideoInfo = components["schemas"]["BrandVideoInfoDto"];
/** NONE(미생성) · QUEUED · PROCESSING · COMPLETED · FAILED */
export type BrandVideoStatus = BrandVideoInfo["status"];
/** 영상 재료 사진·영상 등록 개수 — 메뉴 개수는 모든 메뉴의 합이다 */
export type BrandMediaCounts = components["schemas"]["BrandMediaCountsDto"];
export type GenerateBrandVideoResponse = components["schemas"]["GenerateBrandVideoResponseDto"];
