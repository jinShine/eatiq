import { type AxiosResponse } from "axios";

import axiosClientInstance from "@services/axios.client";

import {
  type CompanyIntroResponse,
  type CreateDocumentDraftRequest,
  type CreateDocumentDraftResponse,
  type CrmSummaryListResponse,
  type ExportDocumentFormat,
  type GenerateCompanyIntroResponse,
} from "./document.type";

const BASE_PATH = "/api/document";

const ENDPOINTS = {
  crmSummaryList: `${BASE_PATH}/crm-summary/list`,
  draft: `${BASE_PATH}/draft`,
  export: (documentId: number) => `${BASE_PATH}/${documentId}/export`,
  companyIntro: `${BASE_PATH}/company-intro`,
  generateCompanyIntro: `${BASE_PATH}/generate/company-intro`,
};

/** 서버 최대치 — 진행 기록 선택 드롭다운에 한 번에 다 담는다 */
const CRM_SUMMARY_LIMIT = 100;

/** 문서 작성용 진행 기록 목록 */
export async function getCrmSummaryList(workspaceId: string): Promise<CrmSummaryListResponse> {
  const res = await axiosClientInstance.get<CrmSummaryListResponse>(ENDPOINTS.crmSummaryList, {
    params: { workspace_uid: Number(workspaceId), limit: CRM_SUMMARY_LIMIT },
  });
  return res.data;
}

/** MOU·LOI 초안 생성 — 동기 처리, 응답에 PDF 주소가 바로 온다 */
export async function createDocumentDraft(
  workspaceId: string,
  body: Omit<CreateDocumentDraftRequest, "workspace_uid">,
): Promise<CreateDocumentDraftResponse> {
  const res = await axiosClientInstance.post<CreateDocumentDraftResponse>(ENDPOINTS.draft, {
    ...body,
    workspace_uid: Number(workspaceId),
  });
  return res.data;
}

/** 문서 파일 받기 — 파일명은 응답 헤더(Content-Disposition)에 온다 */
export async function exportDocument(
  workspaceId: string,
  documentId: number,
  format: ExportDocumentFormat,
): Promise<AxiosResponse<Blob>> {
  return axiosClientInstance.get<Blob>(ENDPOINTS.export(documentId), {
    params: { workspace_uid: Number(workspaceId), format },
    responseType: "blob",
  });
}

/** 회사 소개 문서 조회 — 아직 만들지 않았으면 data가 null */
export async function getCompanyIntro(workspaceId: string): Promise<CompanyIntroResponse> {
  const res = await axiosClientInstance.get<CompanyIntroResponse>(ENDPOINTS.companyIntro, {
    params: { workspace_uid: Number(workspaceId) },
  });
  return res.data;
}

/** 회사 소개 문서 생성 — 동기 처리라 20초 안팎 걸린다. 다시 만들면 덮어쓴다 */
export async function generateCompanyIntro(workspaceId: string): Promise<GenerateCompanyIntroResponse> {
  const res = await axiosClientInstance.post<GenerateCompanyIntroResponse>(ENDPOINTS.generateCompanyIntro, {
    workspace_uid: Number(workspaceId),
    doc_type: "pdf",
  });
  return res.data;
}
