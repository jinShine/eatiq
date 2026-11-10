"use client";

import { useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { useResizeObserver } from "usehooks-ts";

import { cn } from "@utils/shadcn";

import PdfSkeleton from "./PdfSkeleton";

// pdf.js는 렌더링을 워커에서 한다. 번들러가 워커 파일을 따로 내보내도록 URL로 넘긴다
pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();

/** 페이지 번호 버튼은 최대 5개 — 넘치면 현재 페이지가 가운데 오도록 민다 */
const VISIBLE_PAGE_COUNT = 5;

export type PdfDocumentProps = {
  /** PDF 주소 — CORS가 열려 있어야 한다(CloudFront 문서 버킷은 11-09부터 열림) */
  url: string;
  /** 페이지 최대 폭(px). 영역이 더 좁으면 영역에 맞춘다 */
  maxPageWidth: number;
};

/**
 * PDF 미리보기 본체 — 한 쪽씩 보여주고 아래에 쪽 넘김을 둔다(피그마 MOU 미리보기 2262:10417).
 * pdf.js가 브라우저 전용 API를 써서 서버에서 그릴 수 없다. PdfPreview가 dynamic(ssr:false)으로 불러온다.
 * 글자 선택·링크 층은 그리지 않는다 — 미리보기라 필요 없고, 층마다 CSS와 렌더 비용이 붙는다
 */
export default function PdfDocument({ url, maxPageWidth }: PdfDocumentProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { width = 0 } = useResizeObserver({ ref: containerRef as React.RefObject<HTMLDivElement> });
  const [pageCount, setPageCount] = useState(0);
  const [page, setPage] = useState(1);
  const [hasError, setHasError] = useState(false);

  const pageWidth = Math.min(width, maxPageWidth);

  if (hasError) {
    return (
      <div className="flex flex-col items-center gap-2 py-20 text-center text-sm break-keep">
        <p className="text-text-secondary">미리보기를 불러오지 못했어요.</p>
        <a href={url} target="_blank" rel="noreferrer" className="text-info font-semibold hover:underline">
          새 창에서 열기
        </a>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="flex w-full flex-col items-center gap-6">
      {pageWidth > 0 && (
        <Document
          file={url}
          loading={<PdfSkeleton width={pageWidth} />}
          onLoadSuccess={({ numPages }) => {
            setPageCount(numPages);
            setPage(1);
          }}
          onLoadError={() => setHasError(true)}
        >
          <Page
            pageNumber={page}
            width={pageWidth}
            renderTextLayer={false}
            renderAnnotationLayer={false}
            loading={<PdfSkeleton width={pageWidth} />}
            className="border-border overflow-hidden rounded-sm border shadow-sm"
          />
        </Document>
      )}

      {pageCount > 1 && <PageNav page={page} pageCount={pageCount} onChange={setPage} />}
    </div>
  );
}

type PageNavProps = {
  page: number;
  pageCount: number;
  onChange: (page: number) => void;
};

function PageNav({ page, pageCount, onChange }: PageNavProps) {
  const visibleCount = Math.min(VISIBLE_PAGE_COUNT, pageCount);
  const start = Math.min(Math.max(1, page - Math.floor(visibleCount / 2)), pageCount - visibleCount + 1);
  const pages = Array.from({ length: visibleCount }, (_, i) => start + i);

  const isFirst = page === 1;
  const isLast = page === pageCount;

  return (
    <nav aria-label="미리보기 쪽 넘김" className="flex items-center gap-1">
      <NavButton label="첫 쪽" disabled={isFirst} onClick={() => onChange(1)}>
        <ChevronsLeft className="size-4" />
      </NavButton>
      <NavButton label="이전 쪽" disabled={isFirst} onClick={() => onChange(page - 1)}>
        <ChevronLeft className="size-4" />
      </NavButton>
      {pages.map(pageNumber => (
        <button
          key={pageNumber}
          type="button"
          aria-current={pageNumber === page ? "page" : undefined}
          onClick={() => onChange(pageNumber)}
          className={cn(
            "flex size-8 items-center justify-center rounded-full text-sm transition-colors",
            pageNumber === page
              ? "bg-secondary-background text-text-primary font-semibold"
              : "text-text-secondary hover:bg-secondary-background",
          )}
        >
          {pageNumber}
        </button>
      ))}
      <NavButton label="다음 쪽" disabled={isLast} onClick={() => onChange(page + 1)}>
        <ChevronRight className="size-4" />
      </NavButton>
      <NavButton label="마지막 쪽" disabled={isLast} onClick={() => onChange(pageCount)}>
        <ChevronsRight className="size-4" />
      </NavButton>
    </nav>
  );
}

type NavButtonProps = {
  label: string;
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
};

function NavButton({ label, disabled, onClick, children }: NavButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="text-text-secondary hover:bg-secondary-background flex size-8 items-center justify-center rounded-full transition-colors disabled:pointer-events-none disabled:opacity-40"
    >
      {children}
    </button>
  );
}
