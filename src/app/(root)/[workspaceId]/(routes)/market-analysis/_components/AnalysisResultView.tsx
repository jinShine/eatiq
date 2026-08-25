"use client";

import { Download, MoreVertical } from "lucide-react";

import { Button } from "@components/ui";

import AnalysisConditionPanel from "./AnalysisConditionPanel";
import PropertyCard from "./PropertyCard";
import { type AnalysisConditionFormValues } from "./analysisConditionSchema";
import { type PropertyCandidate } from "./analysisResultMock";

type AnalysisResultViewProps = {
  /** 헤더에 표시할 "일본 · 도쿄 | 2026.03.18" */
  title: string;
  condition: AnalysisConditionFormValues;
  analyzedAt: string;
  properties: PropertyCandidate[];
  onDownloadReport: () => void;
  onOpenDetail: (propertyId: string) => void;
};

export default function AnalysisResultView({
  title,
  condition,
  analyzedAt,
  properties,
  onDownloadReport,
  onOpenDetail,
}: AnalysisResultViewProps) {
  return (
    <div className="flex flex-1 flex-col">
      {/* 분석 회차 헤더 */}
      <div className="border-border flex h-16 items-center justify-between gap-4 border-b px-6">
        <div className="flex items-center gap-1">
          <h2 className="text-text-primary text-lg font-bold tracking-[-0.9px]">{title}</h2>
          <button
            type="button"
            aria-label="분석 회차 메뉴"
            className="text-text-disabled hover:text-text-primary focus-visible:ring-ring rounded transition-colors focus-visible:ring-2 focus-visible:outline-none"
          >
            <MoreVertical className="size-4" />
          </button>
        </div>

        <Button size="sm" className="gap-1.5" onClick={onDownloadReport}>
          <Download className="size-4" />
          상권 리포트 다운로드
        </Button>
      </div>

      {/* 좌: 분석 조건 요약 · 우: 후보 매물 그리드 */}
      <div className="flex flex-1 items-start">
        <AnalysisConditionPanel condition={condition} analyzedAt={analyzedAt} />

        <div className="grid flex-1 grid-cols-1 gap-6 p-6 xl:grid-cols-2">
          {properties.map(property => (
            <PropertyCard key={property.id} property={property} onOpenDetail={onOpenDetail} />
          ))}
        </div>
      </div>
    </div>
  );
}
