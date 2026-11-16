import { useIsMutating, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useInvalidateQueries } from "@hooks/commons";

import { downloadFromResponse } from "@utils/functions";

import { IS_MOCK } from "../mock";
import {
  createDocumentDraft,
  exportDocument,
  generateCompanyIntro,
  getCompanyIntro,
  getCrmSummaryList,
} from "./document.api";
import { type CompanyIntroResponse, type CreateDocumentDraftRequest, type ExportDocumentFormat } from "./document.type";

export const documentKeys = {
  all: ["document"] as const,
  crmSummaryList: (workspaceId: string) => [...documentKeys.all, "crm-summary", workspaceId] as const,
  companyIntro: (workspaceId: string) => [...documentKeys.all, "company-intro", workspaceId] as const,
  generateCompanyIntro: (workspaceId: string) => [...documentKeys.all, "generate-company-intro", workspaceId] as const,
};

/** MOU·LOI 작성용 진행 기록 목록 — 진행 기록마다 이미 만든 문서가 함께 온다 */
export function useCrmSummaryList(workspaceId: string) {
  return useQuery({
    queryKey: documentKeys.crmSummaryList(workspaceId),
    queryFn: () => getCrmSummaryList(workspaceId),
    select: response => response.items,
    enabled: Boolean(workspaceId) && !IS_MOCK,
  });
}

/**
 * MOU·LOI 초안 생성.
 * 만든 문서는 진행 기록 목록의 documents에 실리므로 목록을 다시 받는다 —
 * 다른 진행 기록을 골랐다 돌아와도 방금 만든 문서가 보이게
 */
export function useCreateDocumentDraftMutation(workspaceId: string) {
  const invalidateQueries = useInvalidateQueries();

  return useMutation({
    mutationFn: (body: Omit<CreateDocumentDraftRequest, "workspace_uid">) => createDocumentDraft(workspaceId, body),
    onSuccess: () => invalidateQueries.single(documentKeys.crmSummaryList(workspaceId)),
  });
}

/** 문서 파일 받기 — 받은 파일을 서버가 정한 파일명으로 바로 내려받는다 */
export function useExportDocumentMutation(workspaceId: string) {
  return useMutation({
    mutationFn: ({ documentId, format }: { documentId: number; format: ExportDocumentFormat }) =>
      exportDocument(workspaceId, documentId, format),
    onSuccess: response => downloadFromResponse(response),
  });
}

/**
 * 회사 소개 문서 — 없으면 null.
 * 문서 상태(최신·업데이트필요)는 회사 정보 설정을 저장할 때 서버에서 바뀐다.
 * 설정을 고치고 돌아온 사용자가 바로 보도록 탭에 들어올 때마다 다시 받는다
 */
export function useCompanyIntro(workspaceId: string) {
  return useQuery({
    queryKey: documentKeys.companyIntro(workspaceId),
    queryFn: () => getCompanyIntro(workspaceId),
    select: response => response.data,
    staleTime: 0,
    enabled: Boolean(workspaceId) && !IS_MOCK,
  });
}

/** 회사 소개 문서 생성 — 응답이 조회와 같은 모양이라 다시 받지 않고 캐시에 바로 넣는다 */
export function useGenerateCompanyIntroMutation(workspaceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    // 탭을 떠났다 돌아와도 진행 중인 생성을 찾을 수 있게 이름을 붙인다(useIsGeneratingCompanyIntro)
    mutationKey: documentKeys.generateCompanyIntro(workspaceId),
    mutationFn: () => generateCompanyIntro(workspaceId),
    onSuccess: response =>
      queryClient.setQueryData<CompanyIntroResponse>(documentKeys.companyIntro(workspaceId), {
        statusCode: response.statusCode,
        message: response.message,
        data: response.data,
      }),
  });
}

/**
 * 소개 문서를 만드는 중인지 — 이 화면에서 누른 것뿐 아니라, 누르고 떠났다 돌아온 경우도 잡는다.
 * 생성은 20초쯤 걸리고 화면을 떠나도 요청은 계속되므로, 돌아와서 또 누르면 같은 생성이 두 번 돈다
 */
export function useIsGeneratingCompanyIntro(workspaceId: string) {
  return useIsMutating({ mutationKey: documentKeys.generateCompanyIntro(workspaceId) }) > 0;
}
