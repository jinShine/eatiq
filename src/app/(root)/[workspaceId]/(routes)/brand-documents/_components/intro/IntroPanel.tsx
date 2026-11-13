import { Button } from "@components/ui";

import { type CompanyIntroDocument } from "@services/api/document/document.type";

import { formatDate } from "@utils/functions";

import IntroStatusBadge from "./IntroStatusBadge";

type IntroPanelProps = {
  /** 이미 만든 문서 — 없으면 null */
  document: CompanyIntroDocument | null;
  isLoading: boolean;
  isGenerating: boolean;
  onGenerate: () => void;
};

/**
 * 소개 문서 왼쪽 패널 (피그마 2262:10034) — 필수 → 선택 → 업데이트 상태 → 생성하기 → 안내.
 * 필수·선택 자료 목록은 다음 단계에서 붙인다
 */
export default function IntroPanel({ document, isLoading, isGenerating, onGenerate }: IntroPanelProps) {
  const status = document?.meta_data.document_status ?? null;
  const modifiedTime = document?.meta_data.data_modified_time;

  return (
    <div className="flex flex-col gap-5 p-6">
      {/* 업데이트 상태 */}
      <section className="flex flex-col gap-3">
        <h2 className="text-text-primary text-lg font-bold">업데이트 상태</h2>
        <dl className="flex flex-col gap-2.5 text-sm">
          <div className="flex items-center justify-between">
            <dt className="text-text-tertiary">문서 상태</dt>
            <dd>{isLoading ? "-" : <IntroStatusBadge status={status} />}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-text-tertiary">마지막 생성</dt>
            <dd className="text-text-primary font-bold">
              {document ? formatDate(document.updated_time, "YYYY. MM. DD. HH:mm") : "-"}
            </dd>
          </div>
        </dl>
        {status === "업데이트필요" && (
          <p className="text-warning text-sm break-keep">
            {modifiedTime ? `${formatDate(modifiedTime, "YYYY. MM. DD. HH:mm")}에 ` : ""}회사 정보가 바뀌었어요. 다시
            생성하면 반영돼요.
          </p>
        )}
      </section>

      <section className="border-border flex flex-col gap-3 border-t pt-5">
        <Button className="w-full" disabled={isLoading || isGenerating} isLoading={isGenerating} onClick={onGenerate}>
          {document ? "다시 생성하기" : "생성하기"}
        </Button>
        <p className="text-text-secondary text-sm whitespace-pre-line break-keep">
          {isGenerating
            ? "소개 자료를 만들고 있어요.\n20초쯤 걸려요. 이 화면을 떠나도 계속 만들어요."
            : "회사 정보 설정의 내용으로 16:9 소개 자료를 만들어요.\n자료가 없는 쪽은 빼고 만들어요."}
        </p>
      </section>
    </div>
  );
}
