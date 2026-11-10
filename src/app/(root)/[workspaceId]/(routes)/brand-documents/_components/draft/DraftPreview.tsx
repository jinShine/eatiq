import { PdfPreview, PdfSkeleton } from "@components/custom/pdf";
import { Button } from "@components/ui";

import { type CrmDocumentSummary } from "@services/api/document/document.type";

/** 미리보기 쪽 최대 폭 — 피그마 A4 카드 560px */
const PAGE_MAX_WIDTH = 560;

type DraftPreviewProps = {
  docLabel: string;
  /** 고른 진행 건에 이미 만든 문서 */
  document: CrmDocumentSummary | null;
  isGenerating: boolean;
  /** 비어 있을 때 안내 */
  emptyMessage: string;
  isDownloading: boolean;
  onDownload: (documentId: number) => void;
};

/** MOU·LOI 오른쪽 — 미리보기와 DOCX 다운로드 (피그마 2262:10417 · 10429) */
export default function DraftPreview({
  docLabel,
  document,
  isGenerating,
  emptyMessage,
  isDownloading,
  onDownload,
}: DraftPreviewProps) {
  return (
    <section className="flex min-w-0 flex-1 flex-col">
      <div className="border-border flex h-14 items-center justify-between gap-3 border-b px-5">
        <h2 className="text-text-primary text-lg font-bold">미리보기</h2>
        <Button
          size="sm"
          disabled={!document || isGenerating}
          isLoading={isDownloading}
          onClick={() => document && onDownload(document.document_uid)}
        >
          DOCX 다운로드
        </Button>
      </div>

      <div className="flex flex-1 justify-center px-5 py-10">
        <div className="w-full" style={{ maxWidth: PAGE_MAX_WIDTH }}>
          {isGenerating ? (
            // 생성은 1~2초 걸린다. 이전 문서를 그대로 두면 바뀐 줄 모르고 받을 수 있어 비운다
            <PdfSkeleton />
          ) : document?.pdf_url ? (
            <PdfPreview url={document.pdf_url} maxPageWidth={PAGE_MAX_WIDTH} />
          ) : (
            <div className="border-border text-text-primary flex aspect-[1/1.414] w-full items-center justify-center rounded-sm border bg-white p-6 text-center text-sm break-keep shadow-sm">
              {document ? `${docLabel} 미리보기를 만들지 못했어요. DOCX로 받아 확인해 주세요.` : emptyMessage}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
