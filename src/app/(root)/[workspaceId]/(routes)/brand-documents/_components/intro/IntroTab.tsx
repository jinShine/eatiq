"use client";

import { Toast } from "@components/ui";

import {
  useCompanyIntro,
  useExportDocumentMutation,
  useGenerateCompanyIntroMutation,
} from "@services/api/document/document.query";

import IntroPanel from "./IntroPanel";
import IntroPreview from "./IntroPreview";

type IntroTabProps = {
  workspaceId: string;
};

/** 소개 문서 생성 탭 — 워크스페이스당 문서 하나, 다시 만들면 덮어쓴다 */
export default function IntroTab({ workspaceId }: IntroTabProps) {
  const { data: document = null, isLoading } = useCompanyIntro(workspaceId);
  const {
    mutate: generate,
    isPending: isGenerating,
    error: generateError,
  } = useGenerateCompanyIntroMutation(workspaceId);
  const { mutate: download, isPending: isDownloading } = useExportDocumentMutation(workspaceId);

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
        <IntroPanel document={document} isLoading={isLoading} isGenerating={isGenerating} onGenerate={handleGenerate} />
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
