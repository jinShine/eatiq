"use client";

import { useState } from "react";

import { Toast } from "@components/ui";

import { useBrandSection } from "@services/api/brand/brand.query";
import {
  useCreateDocumentDraftMutation,
  useCrmSummaryList,
  useExportDocumentMutation,
} from "@services/api/document/document.query";
import { type DraftDocType } from "@services/api/document/document.type";

import DraftPanel, { DRAFT_DOC_LABEL } from "./DraftPanel";
import DraftPreview from "./DraftPreview";
import { buildDraftRequirements } from "./draftRequirements";

type DraftTabProps = {
  workspaceId: string;
  docType: DraftDocType;
};

/** 문서 언어 — 영문 정본 전까지 한국어만 */
const DRAFT_LANGUAGE = "ko";

/** MOU · LOI 탭 — 둘은 화면이 같고 문서 종류와 자료 항목만 다르다 */
export default function DraftTab({ workspaceId, docType }: DraftTabProps) {
  const { data: crmList, isLoading: isCrmListLoading } = useCrmSummaryList(workspaceId);
  const { data: basic } = useBrandSection(workspaceId, "brand_basic");
  const { data: signature } = useBrandSection(workspaceId, "brand_signature");
  const { mutate: generate, isPending: isGenerating } = useCreateDocumentDraftMutation(workspaceId);
  const { mutate: download, isPending: isDownloading } = useExportDocumentMutation(workspaceId);

  // 고르기 전에는 첫 진행 건 — 대부분 하나를 두고 쓰고, 빈 드롭다운보다 바로 판정이 보이는 편이 낫다
  const [pickedCrmUid, setPickedCrmUid] = useState<number | null>(null);
  const selectedCrm = crmList?.find(crm => crm.crm_uid === pickedCrmUid) ?? crmList?.[0];

  const requirements = selectedCrm
    ? buildDraftRequirements({ workspaceId, docType, crm: selectedCrm, basic, signature })
    : null;

  const docLabel = DRAFT_DOC_LABEL[docType];
  // 같은 진행 건·종류·언어로 다시 만들면 서버가 덮어쓴다 — 목록의 이 칸이 늘 최신 문서다
  const document = selectedCrm?.documents[docType][DRAFT_LANGUAGE] ?? null;
  const emptyMessage = !selectedCrm
    ? `진행 건을 고르면 ${docLabel} 초안을 만들 수 있어요`
    : requirements && requirements.missingRequiredCount > 0
      ? `필수 자료를 채우면 ${docLabel}를 만들 수 있어요`
      : "생성하기를 누르면 여기에 초안이 보여요";

  const handleDownload = (documentId: number) => {
    download(
      { documentId, format: "docx" },
      { onError: error => Toast.error(error.message || "파일을 받지 못했어요. 다시 시도해주세요.") },
    );
  };

  const handleGenerate = () => {
    if (!selectedCrm) {
      return;
    }
    generate(
      { crm_uid: selectedCrm.crm_uid, doc_type: docType, language: DRAFT_LANGUAGE },
      {
        onSuccess: () => Toast.success(`${docLabel} 초안을 만들었어요.`),
        onError: error => Toast.error(error.message || "초안을 만들지 못했어요. 다시 시도해주세요."),
      },
    );
  };

  return (
    // 왼쪽 패널 고정 폭(피그마 354px), 오른쪽 미리보기. 좁은 화면에선 위아래로 쌓는다
    <div className="flex flex-1 flex-col lg:flex-row">
      <aside className="border-border w-full shrink-0 border-b lg:w-[354px] lg:border-r lg:border-b-0">
        <DraftPanel
          workspaceId={workspaceId}
          docType={docType}
          crmList={crmList}
          isCrmListLoading={isCrmListLoading}
          selectedCrm={selectedCrm}
          onSelectCrm={setPickedCrmUid}
          requirements={requirements}
          isGenerating={isGenerating}
          onGenerate={handleGenerate}
        />
      </aside>

      <DraftPreview
        docLabel={docLabel}
        document={document}
        isGenerating={isGenerating}
        emptyMessage={emptyMessage}
        isDownloading={isDownloading}
        onDownload={handleDownload}
      />
    </div>
  );
}
