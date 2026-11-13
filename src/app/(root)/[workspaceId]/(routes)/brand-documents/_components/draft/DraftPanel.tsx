import Link from "next/link";

import { Button, Select, SelectItem, Skeleton } from "@components/ui";

import { type CrmSummaryItem, type DraftDocType } from "@services/api/document/document.type";

import { formatDate } from "@utils/functions";

import RequirementGroup from "./RequirementGroup";
import { type DraftRequirements } from "./draftRequirements";

/** 문서 종류별 화면 문구 */
export const DRAFT_DOC_LABEL: Record<DraftDocType, string> = {
  mou: "업무협약서",
  loi: "의향서",
};

/** 진행 기록 한 줄 — 「상대 | 국가 · 도시 | 계약 방식」, 빈 칸은 건너뛴다 */
const toCrmLabel = (crm: CrmSummaryItem) =>
  [crm.company_name, [crm.country, crm.city].filter(Boolean).join(" · "), crm.contract_type]
    .filter(Boolean)
    .join(" | ");

type DraftPanelProps = {
  workspaceId: string;
  docType: DraftDocType;
  crmList: CrmSummaryItem[] | undefined;
  isCrmListLoading: boolean;
  selectedCrm: CrmSummaryItem | undefined;
  onSelectCrm: (crmUid: number) => void;
  requirements: DraftRequirements | null;
  isGenerating: boolean;
  onGenerate: () => void;
};

/** MOU·LOI 왼쪽 패널 (피그마 2262:10364) — 진행 기록 → 필수 → 선택 → 문서 언어 → 생성하기 → 안내 */
export default function DraftPanel({
  workspaceId,
  docType,
  crmList,
  isCrmListLoading,
  selectedCrm,
  onSelectCrm,
  requirements,
  isGenerating,
  onGenerate,
}: DraftPanelProps) {
  const docLabel = DRAFT_DOC_LABEL[docType];
  const hasNoCrm = !isCrmListLoading && crmList?.length === 0;
  const missingCount = requirements?.missingRequiredCount ?? 0;
  const canGenerate = Boolean(selectedCrm && requirements) && missingCount === 0 && !isGenerating;

  return (
    <div className="flex flex-col gap-5 p-6">
      {/* 진행 기록 선택 */}
      <section className="flex flex-col gap-3">
        <div className="flex flex-col gap-2">
          <h2 className="text-text-primary text-lg font-bold">진행 기록 선택</h2>
          <p className="text-text-secondary text-sm break-keep">
            <Link href={`/${workspaceId}/company-settings?tab=policy`} className="text-info hover:underline">
              문서 · 계약 참고 정보
            </Link>
            와{" "}
            <Link href={`/${workspaceId}/progress`} className="text-info hover:underline">
              진행 기록
            </Link>
            의 데이터를 기반으로 {docLabel} 초안을 만듭니다
          </p>
        </div>

        {isCrmListLoading && <Skeleton className="h-10 w-full rounded-md" />}

        {hasNoCrm && (
          // 진행 건이 0건이면 드롭다운 대신 진행 관리로 보낸다(피그마 「진행 건 미선택」)
          <div className="border-border flex flex-col gap-2 rounded-xl border border-dashed p-4 text-sm break-keep">
            <p className="text-text-secondary">진행 관리에서 상대를 먼저 추가하세요.</p>
            <Link href={`/${workspaceId}/progress`} className="text-info font-semibold hover:underline">
              진행 관리로 가기
            </Link>
          </div>
        )}

        {crmList && crmList.length > 0 && (
          <>
            <Select
              aria-label="진행 기록 선택"
              size="md"
              value={selectedCrm ? String(selectedCrm.crm_uid) : undefined}
              placeholder="진행 건을 골라 주세요"
              onValueChange={value => onSelectCrm(Number(value))}
            >
              {crmList.map(crm => (
                <SelectItem key={crm.crm_uid} value={String(crm.crm_uid)}>
                  {toCrmLabel(crm)}
                </SelectItem>
              ))}
            </Select>
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-tertiary">마지막 협의일</span>
              <span className="text-text-primary font-bold">
                {selectedCrm?.last_date ? formatDate(selectedCrm.last_date, "YYYY. MM. DD.") : "-"}
              </span>
            </div>
          </>
        )}
      </section>

      {requirements && (
        <>
          <RequirementGroup
            title="필수 자료"
            description={`모두 있어야 ${docLabel}를 만들 수 있어요`}
            rows={requirements.required}
            isRequired
          />
          <RequirementGroup
            title="선택 자료"
            description="없으면 문서에 빈칸으로 남겨요"
            rows={requirements.optional}
            isRequired={false}
          />
        </>
      )}

      {/* 문서 언어 — 영문 정본 전까지 한국어만(피그마 변수 표 signing_language) */}
      <section className="border-border flex flex-col gap-3 border-t pt-5">
        <h2 className="text-text-primary text-lg font-bold">문서 언어</h2>
        <Select aria-label="문서 언어" size="md" value="ko" disabled>
          <SelectItem value="ko">한국어</SelectItem>
        </Select>
      </section>

      <section className="flex flex-col gap-3">
        <Button className="w-full" disabled={!canGenerate} isLoading={isGenerating} onClick={onGenerate}>
          생성하기
        </Button>
        {selectedCrm && requirements && (
          <p className="text-text-secondary text-sm whitespace-pre-line break-keep">
            {missingCount > 0
              ? `필수 자료 ${missingCount}개가 비어 있어요.\n채우면 ${docLabel}를 만들 수 있어요.`
              : "필수 자료가 모두 채워졌어요.\n빈칸은 DOCX에서 채워 주세요."}
          </p>
        )}
        <p className="text-text-tertiary text-xs leading-relaxed break-keep">
          본 문서는 입력된 데이터를 기반으로 생성된 초안으로, EATIQ LINK는 그 법적 적정성을 보증하지 않습니다. 실제 사용
          및 서명 전 반드시 법무 전문가의 검토를 받으시기 바랍니다.
        </p>
      </section>
    </div>
  );
}
