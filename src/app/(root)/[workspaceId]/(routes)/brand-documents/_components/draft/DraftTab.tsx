"use client";

import { useState } from "react";

import { Toast } from "@components/ui";

import { useBrandSection } from "@services/api/brand/brand.query";
import { useCreateDocumentDraftMutation, useCrmSummaryList } from "@services/api/document/document.query";
import { type DraftDocType } from "@services/api/document/document.type";

import DraftPanel, { DRAFT_DOC_LABEL } from "./DraftPanel";
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

  // 고르기 전에는 첫 진행 건 — 대부분 하나를 두고 쓰고, 빈 드롭다운보다 바로 판정이 보이는 편이 낫다
  const [pickedCrmUid, setPickedCrmUid] = useState<number | null>(null);
  const selectedCrm = crmList?.find(crm => crm.crm_uid === pickedCrmUid) ?? crmList?.[0];

  const requirements = selectedCrm
    ? buildDraftRequirements({ workspaceId, docType, crm: selectedCrm, basic, signature })
    : null;

  const handleGenerate = () => {
    if (!selectedCrm) {
      return;
    }
    generate(
      { crm_uid: selectedCrm.crm_uid, doc_type: docType, language: DRAFT_LANGUAGE },
      {
        onSuccess: () => Toast.success(`${DRAFT_DOC_LABEL[docType]} 초안을 만들었어요.`),
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

      {/* 미리보기 — 다음 단계(react-pdf) */}
      <section className="flex min-h-[480px] flex-1 flex-col">
        <div className="border-border flex h-14 items-center border-b px-5">
          <h2 className="text-text-primary text-lg font-bold">미리보기</h2>
        </div>
        <div className="text-text-tertiary flex flex-1 items-center justify-center p-6 text-sm">
          미리보기는 다음 단계에서 붙여요
        </div>
      </section>
    </div>
  );
}
