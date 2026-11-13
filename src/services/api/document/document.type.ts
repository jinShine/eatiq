import { type components, type operations } from "@services/openapi";

/************************************
 * 회사 문서 작성(MOU·LOI 초안) — 요청·응답 타입은 스펙에서 가져온다
 * 응답은 { statusCode, message, data | items }로 한 번 감싸져 온다(다른 API와 다르다)
 ************************************/

/** 문서 작성용 진행 기록 목록 — 진행 기록마다 이미 만든 MOU·LOI(ko/en)가 함께 온다 */
export type CrmSummaryListResponse = components["schemas"]["GetDocumentCrmSummaryListResponseDto"];
export type CrmSummaryItem = components["schemas"]["CrmSummaryItemDto"];
export type CrmDocumentSummary = components["schemas"]["CrmDocumentSummaryDetailDto"];

/** 초안 생성 — 같은 진행 기록·종류·언어로 다시 만들면 덮어쓴다 */
export type CreateDocumentDraftRequest = components["schemas"]["CreateDocumentDraftDto"];
export type CreateDocumentDraftResponse = components["schemas"]["CreateDocumentDraftResponseDto"];
export type DocumentDraft = CreateDocumentDraftResponse["data"];

export type DraftDocType = CreateDocumentDraftRequest["doc_type"];
export type DocumentLanguage = CreateDocumentDraftRequest["language"];

/** 내보내기 형식 — MOU·LOI는 docx·pdf */
export type ExportDocumentFormat = NonNullable<
  operations["ExportDocumentController_exportDocument"]["parameters"]["query"]["format"]
>;

/************************************
 * 회사 소개 문서 — 워크스페이스당 하나, 다시 만들면 덮어쓴다
 ************************************/

/** 조회 — 아직 만들지 않았으면 data가 null */
export type CompanyIntroResponse = components["schemas"]["GetCompanyIntroDocumentResponseDto"];
/** 생성 — 20초 안팎 걸리는 동기 처리, 조회와 같은 모양의 data가 온다 */
export type GenerateCompanyIntroResponse = components["schemas"]["GenerateCompanyIntroDocumentResponseDto"];
export type CompanyIntroDocument = components["schemas"]["CompanyIntroDocumentDetailDto"];
/** 최신 · 업데이트필요 — 만든 뒤 회사 정보가 바뀌면 업데이트필요 */
export type CompanyIntroStatus = CompanyIntroDocument["meta_data"]["document_status"];
