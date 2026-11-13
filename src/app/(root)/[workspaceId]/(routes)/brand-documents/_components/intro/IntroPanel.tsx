import { Button } from "@components/ui";

import { type CompanyIntroDocument } from "@services/api/document/document.type";

import { formatDate } from "@utils/functions";

import RequirementGroup from "../draft/RequirementGroup";
import { type DraftRequirements } from "../draft/draftRequirements";
import IntroStatusBadge from "./IntroStatusBadge";

type IntroPanelProps = {
  /** 이미 만든 문서 — 없으면 null */
  document: CompanyIntroDocument | null;
  isLoading: boolean;
  /** 회사 정보를 받기 전에는 null */
  requirements: DraftRequirements | null;
  isGenerating: boolean;
  onGenerate: () => void;
};

/**
 * 소개 문서 왼쪽 패널 (피그마 2262:10034) — 필수 → 선택 → 업데이트 상태 → 생성하기 → 안내.
 * 필수가 하나라도 비면 생성하기를 막는다(설계 노트 3)
 */
export default function IntroPanel({ document, isLoading, requirements, isGenerating, onGenerate }: IntroPanelProps) {
  const status = document?.meta_data.document_status ?? null;
  const modifiedTime = document?.meta_data.data_modified_time;
  const missingCount = requirements?.missingRequiredCount ?? 0;
  const canGenerate = !isLoading && Boolean(requirements) && missingCount === 0 && !isGenerating;

  return (
    // 필수 묶음은 맨 위라 구분선 없이 시작한다
    <div className="flex flex-col gap-5 p-6 [&>section:first-child]:border-t-0 [&>section:first-child]:pt-0">
      {requirements && (
        <>
          <RequirementGroup
            title="필수 자료"
            description="모두 있어야 소개 자료를 만들 수 있어요"
            rows={requirements.required}
            isRequired
          />
          <RequirementGroup
            title="선택 자료"
            description="없으면 그 쪽은 빼고 만들어요"
            rows={requirements.optional}
            isRequired={false}
          />
        </>
      )}

      {/* 업데이트 상태 */}
      <section className="border-border flex flex-col gap-3 border-t pt-5">
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
        <Button className="w-full" disabled={!canGenerate} isLoading={isGenerating} onClick={onGenerate}>
          {document ? "다시 생성하기" : "생성하기"}
        </Button>
        <p className="text-text-secondary text-sm whitespace-pre-line break-keep">
          {isGenerating
            ? "소개 자료를 만들고 있어요.\n20초쯤 걸려요. 이 화면을 떠나도 계속 만들어요."
            : missingCount > 0
              ? `필수 자료 ${missingCount}개가 비어 있어요.\n채우면 소개 자료를 만들 수 있어요.`
              : "필수 자료가 모두 채워졌어요.\n선택 자료가 없는 쪽은 빼고 만들어요."}
        </p>
      </section>
    </div>
  );
}
