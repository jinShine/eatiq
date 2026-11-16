"use client";

import { Toast } from "@components/ui";

import { useBrandSection } from "@services/api/brand/brand.query";
import {
  useCompanyIntro,
  useExportDocumentMutation,
  useGenerateCompanyIntroMutation,
  useIsGeneratingCompanyIntro,
} from "@services/api/document/document.query";

import IntroPanel from "./IntroPanel";
import IntroPreview from "./IntroPreview";
import { buildIntroRequirements } from "./introRequirements";

type IntroTabProps = {
  workspaceId: string;
};

/** 소개 문서 생성 탭 — 워크스페이스당 문서 하나, 다시 만들면 덮어쓴다 */
export default function IntroTab({ workspaceId }: IntroTabProps) {
  const { data: document = null, isLoading } = useCompanyIntro(workspaceId);
  const { mutate: generate, error: generateError } = useGenerateCompanyIntroMutation(workspaceId);
  // 이 화면이 다시 마운트돼도 진행 중인 생성을 이어서 보여준다
  const isGenerating = useIsGeneratingCompanyIntro(workspaceId);
  const { mutate: download, isPending: isDownloading } = useExportDocumentMutation(workspaceId);

  // 같은 워크스페이스 상세 한 번을 섹션별로 나눠 읽는다(요청은 하나)
  const { data: visual, isSuccess: isBrandLoaded } = useBrandSection(workspaceId, "brand_visual");
  const { data: menu } = useBrandSection(workspaceId, "brand_menu");
  const { data: status } = useBrandSection(workspaceId, "brand_status");
  const { data: contractPolicy } = useBrandSection(workspaceId, "brand_contract_policy");
  const { data: intro } = useBrandSection(workspaceId, "brand_intro");
  const { data: store } = useBrandSection(workspaceId, "brand_store");

  const requirements = isBrandLoaded
    ? buildIntroRequirements({ workspaceId, visual, menu, status, contractPolicy, intro, store })
    : null;

  const handleGenerate = () => {
    generate(undefined, {
      onSuccess: () => Toast.success("소개 자료를 만들었어요."),
      onError: error => Toast.error(error.message || "소개 자료를 만들지 못했어요. 다시 시도해주세요."),
    });
  };

  const handleDownload = (documentId: number) => {
    download(
      { documentId, format: "pdf" },
      { onError: error => Toast.error(error.message || "파일을 받지 못했어요. 다시 시도해주세요.") },
    );
  };

  return (
    // MOU·LOI와 같은 틀 — 왼쪽 패널 고정 폭(피그마 354px), 오른쪽 미리보기. 좁은 화면에선 위아래로 쌓는다
    <div className="flex flex-1 flex-col lg:flex-row">
      <aside className="border-border w-full shrink-0 border-b lg:w-[354px] lg:border-r lg:border-b-0">
        <IntroPanel
          document={document}
          isLoading={isLoading}
          requirements={requirements}
          isGenerating={isGenerating}
          onGenerate={handleGenerate}
        />
      </aside>

      <IntroPreview
        document={document}
        isLoading={isLoading}
        isGenerating={isGenerating}
        generateError={generateError ? generateError.message || "잠시 후 다시 시도해 주세요." : null}
        isDownloading={isDownloading}
        onDownload={handleDownload}
      />
    </div>
  );
}
