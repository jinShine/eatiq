import { PdfPreview, PdfSkeleton, toVersionedPdfUrl } from "@components/custom/pdf";
import { Button } from "@components/ui";

import { type CompanyIntroDocument } from "@services/api/document/document.type";

/** 소개 자료는 16:9 가로 슬라이드 — 미리보기 영역(818px)에 좌우 여백만 두고 채운다 */
const PAGE_MAX_WIDTH = 760;
const PAGE_ASPECT_RATIO = 16 / 9;

type IntroPreviewProps = {
  document: CompanyIntroDocument | null;
  isLoading: boolean;
  isGenerating: boolean;
  /** 마지막 생성 실패 사유 — 다시 생성하기 전까지 보여준다 */
  generateError: string | null;
  isDownloading: boolean;
  onDownload: (documentId: number) => void;
};

/** 소개 문서 오른쪽 — 미리보기와 PDF 다운로드 (피그마 2262:10083 · 10089) */
export default function IntroPreview({
  document,
  isLoading,
  isGenerating,
  generateError,
  isDownloading,
  onDownload,
}: IntroPreviewProps) {
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
          PDF 다운로드
        </Button>
      </div>

      <div className="flex flex-1 justify-center px-5 py-10">
        <div className="w-full" style={{ maxWidth: PAGE_MAX_WIDTH }}>
          {isLoading || isGenerating ? (
            <PdfSkeleton aspectRatio={PAGE_ASPECT_RATIO} />
          ) : generateError ? (
            <EmptyPage>
              <p className="text-text-primary font-semibold">소개 자료를 만들지 못했어요.</p>
              <p className="text-text-secondary whitespace-pre-line">{generateError}</p>
              <p className="text-text-tertiary">왼쪽의 생성하기로 다시 시도해 주세요.</p>
            </EmptyPage>
          ) : document?.pdf_url ? (
            <PdfPreview
              url={toVersionedPdfUrl(document.pdf_url, document.updated_time)}
              maxPageWidth={PAGE_MAX_WIDTH}
              aspectRatio={PAGE_ASPECT_RATIO}
            />
          ) : (
            <EmptyPage>
              <p className="text-text-primary">
                {document
                  ? "미리보기를 만들지 못했어요. PDF로 받아 확인해 주세요."
                  : "생성하기를 누르면 여기에 소개 자료가 보여요"}
              </p>
            </EmptyPage>
          )}
        </div>
      </div>
    </section>
  );
}

function EmptyPage({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="border-border flex w-full flex-col items-center justify-center gap-1 rounded-sm border bg-white p-6 text-center text-sm break-keep shadow-sm"
      style={{ aspectRatio: PAGE_ASPECT_RATIO }}
    >
      {children}
    </div>
  );
}
