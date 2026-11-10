import { useMutation, useQuery } from "@tanstack/react-query";

import { useInvalidateQueries } from "@hooks/commons";

import { downloadFromResponse } from "@utils/functions";

import { IS_MOCK } from "../mock";
import { createDocumentDraft, exportDocument, getCrmSummaryList } from "./document.api";
import { type CreateDocumentDraftRequest, type ExportDocumentFormat } from "./document.type";

export const documentKeys = {
  all: ["document"] as const,
  crmSummaryList: (workspaceId: string) => [...documentKeys.all, "crm-summary", workspaceId] as const,
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
