"use client";

import { useState } from "react";

import dayjs from "dayjs";
import { Radar } from "lucide-react";

import BaseContainerLayout from "@components/layout/base/BaseContainerLayout";
import BaseContentLayout from "@components/layout/base/BaseContentLayout";
import PageHeader from "@components/layout/header/PageHeader";
import { Button, Toast } from "@components/ui";

import AnalysisResultView from "../_components/AnalysisResultView";
import PropertyDetailSheet from "../_components/PropertyDetailSheet";
import StartAnalysisModal from "../_components/StartAnalysisModal";
import { type AnalysisConditionFormValues } from "../_components/analysisConditionSchema";
import { PROPERTY_DETAIL_MOCK, buildFallbackPropertyDetail } from "../_components/analysisDetailMock";
import { ANALYSIS_CITY_OPTIONS, ANALYSIS_COUNTRY_OPTIONS } from "../_components/analysisOptions";
import { ANALYSIS_PROPERTIES } from "../_components/analysisResultMock";

/** 실행한 분석 1회차 */
type AnalysisResult = {
  condition: AnalysisConditionFormValues;
  analyzedAt: string;
  title: string;
};

const findLabel = (options: { value: string; label: string }[], value: string) =>
  options.find(option => option.value === value)?.label ?? "-";

type MarketAnalysisContainerProps = {
  workspaceId: string;
};

export default function MarketAnalysisContainer({ workspaceId }: MarketAnalysisContainerProps) {
  const [isStartModalOpen, setIsStartModalOpen] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  // TODO(API): 분석 실행 API가 연결되면 응답으로 결과를 채운다. 지금은 입력 조건 + 목업 매물로 결과 화면을 구성한다.
  const handleSubmitted = (condition: AnalysisConditionFormValues) => {
    const now = dayjs();
    const countryLabel = findLabel(ANALYSIS_COUNTRY_OPTIONS, condition.country);
    const cityLabel = findLabel(ANALYSIS_CITY_OPTIONS[condition.country] ?? [], condition.city);

    setResult({
      condition,
      analyzedAt: now.format("YYYY.MM.DD HH시 mm분"),
      title: `${countryLabel} · ${cityLabel} | ${now.format("YYYY.MM.DD")}`,
    });
    setIsStartModalOpen(false);
  };

  // TODO(API): 리포트 생성 API 연결
  const handleDownloadReport = () => {
    Toast.success("리포트 다운로드는 API 연결 후 동작합니다.");
  };

  // 드로어는 선택된 id만 들고 있고, 상세는 목업에서 찾는다
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);

  // TODO(API): 매물 상세 API가 준비되면 useQuery(propertyId)로 교체한다
  const selectedDetail = (() => {
    if (!selectedPropertyId) {
      return null;
    }
    const property = ANALYSIS_PROPERTIES.find(item => item.id === selectedPropertyId);
    return (
      PROPERTY_DETAIL_MOCK[selectedPropertyId] ?? buildFallbackPropertyDetail(selectedPropertyId, property?.name ?? "")
    );
  })();

  // TODO(API): 중개인 연락처가 응답에 포함되면 tel:·sms:로 연결한다
  const handleContact = (method: "call" | "message") => {
    Toast.success(`${method === "call" ? "전화" : "메시지"} 연결은 연락처 API 연결 후 동작합니다.`);
  };

  return (
    <BaseContainerLayout
      header={
        <PageHeader title="AI 상권 분석" description="국가·도시와 매장 조건을 입력해 AI 상권분석을 실행합니다." />
      }
      content={
        <BaseContentLayout>
          {result ? (
            <AnalysisResultView
              title={result.title}
              condition={result.condition}
              analyzedAt={result.analyzedAt}
              properties={ANALYSIS_PROPERTIES}
              onDownloadReport={handleDownloadReport}
              onOpenDetail={setSelectedPropertyId}
            />
          ) : (
            <div className="flex flex-1 items-center justify-center p-8">
              <div className="border-border flex flex-col items-center rounded-2xl border border-dashed bg-white px-6 py-20 text-center">
                <div className="bg-secondary-background text-text-disabled flex size-12 items-center justify-center rounded-2xl">
                  <Radar className="size-5" strokeWidth={1.5} />
                </div>

                <p className="text-text-primary mt-5 text-sm font-semibold">아직 실행한 상권 분석이 없어요</p>
                <p className="text-text-tertiary mt-1.5 max-w-[38ch] text-xs leading-relaxed">
                  진출하려는 국가·도시와 매장 조건을 입력하면 AI가 후보 매물을 찾아 분석해드려요.
                </p>

                <Button size="sm" className="mt-6" onClick={() => setIsStartModalOpen(true)}>
                  AI 상권분석 시작
                </Button>
              </div>
            </div>
          )}

          <PropertyDetailSheet
            detail={selectedDetail}
            isOpen={selectedPropertyId !== null}
            onOpenChange={open => !open && setSelectedPropertyId(null)}
            onContact={handleContact}
          />

          <StartAnalysisModal
            workspaceId={workspaceId}
            isOpen={isStartModalOpen}
            onOpenChange={setIsStartModalOpen}
            onSubmitted={handleSubmitted}
          />
        </BaseContentLayout>
      }
    />
  );
}
