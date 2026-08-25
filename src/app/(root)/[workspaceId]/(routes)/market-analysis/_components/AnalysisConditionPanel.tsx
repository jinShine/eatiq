"use client";

import { type AnalysisConditionFormValues } from "./analysisConditionSchema";
import {
  ANALYSIS_CITY_OPTIONS,
  ANALYSIS_COUNTRY_OPTIONS,
  AREA_TYPE_OPTIONS,
  IMPORTANCE_OPTIONS,
} from "./analysisOptions";

type Option = { value: string; label: string };

/** 코드값 → 표시 라벨. 못 찾으면 시안처럼 "-" */
const toLabel = (options: Option[], value: string) => options.find(option => option.value === value)?.label ?? "-";

/** "40 ~ 60 평형" 처럼 범위를 합친다. 양쪽 다 비었으면 "-" */
const toRange = (min: string, max: string, format: (value: string) => string) => {
  if (!min && !max) {
    return "-";
  }
  if (min && max) {
    return `${format(min)} ~ ${format(max)}`;
  }
  return format(min || max);
};

/** 평형은 시안처럼 단위를 끝에 한 번만 붙인다 ("40 ~ 60 평형") */
const toPyRange = (min: string, max: string) => {
  if (!min && !max) {
    return "-";
  }
  return min && max ? `${min} ~ ${max} 평형` : `${min || max} 평형`;
};

/**
 * 임대료는 원(KRW) 단위로 입력받고 시안처럼 "월 200 만원"으로 보여준다.
 * 만원으로 안 떨어지면 원 단위 그대로 표기한다.
 */
const toRent = (value: string) => {
  const won = Number(value);
  if (!Number.isFinite(won)) {
    return value;
  }
  return won % 10_000 === 0 ? `월 ${(won / 10_000).toLocaleString()} 만원` : `월 ${won.toLocaleString()} 원`;
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-text-tertiary shrink-0 text-sm font-medium tracking-[-0.7px]">{label}</span>
      <span className="text-text-primary text-right text-sm font-medium tracking-[-0.7px]">{value}</span>
    </div>
  );
}

type AnalysisConditionPanelProps = {
  condition: AnalysisConditionFormValues;
  /** 분석을 실행한 시각 (표시용 문자열) */
  analyzedAt: string;
};

export default function AnalysisConditionPanel({ condition, analyzedAt }: AnalysisConditionPanelProps) {
  const countryLabel = toLabel(ANALYSIS_COUNTRY_OPTIONS, condition.country);
  const cityLabel = toLabel(ANALYSIS_CITY_OPTIONS[condition.country] ?? [], condition.city);

  const importanceRows = [
    { label: "간판 노출 중요도", value: condition.signageImportance },
    { label: "매장 노출 중요도", value: condition.storeSizeImportance },
    { label: "주차 필요 여부", value: condition.parkingImportance },
    { label: "대기공간 필요 여부", value: condition.waitingSpaceImportance },
    { label: "점심 매출 중요도", value: condition.lunchSalesImportance },
    { label: "저녁 매출 중요도", value: condition.dinnerSalesImportance },
    { label: "주중 매출 중요도", value: condition.weekdaySalesImportance },
    { label: "주말 매출 중요도", value: condition.weekendSalesImportance },
  ];

  const preferredAreas = [condition.preferredArea1st, condition.preferredArea2nd, condition.preferredArea3rd];
  const hasPreferredArea = preferredAreas.some(Boolean);

  return (
    <aside className="flex w-[354px] shrink-0 flex-col gap-6 px-6 py-4">
      <section className="flex flex-col gap-3">
        <h2 className="text-text-primary text-lg font-bold tracking-[-0.9px]">분석 조건</h2>
        <div className="flex flex-col gap-2">
          <Row label="분석일시" value={analyzedAt} />
          <Row label="국가 및 도시" value={`${countryLabel} · ${cityLabel}`} />
          <Row label="기준 평형" value={toPyRange(condition.sizeMinPy, condition.sizeMaxPy)} />
          <Row label="기준 임대료" value={toRange(condition.rentMinKrw, condition.rentMaxKrw, toRent)} />
        </div>
      </section>

      <div className="bg-border h-px" />

      <section className="flex flex-col gap-3">
        <h2 className="text-text-primary text-lg font-bold tracking-[-0.9px]">상세 조건</h2>

        <div className="flex flex-col gap-2">
          {/* 선호 상권만 3줄로 나간다 */}
          <div className="flex items-start justify-between gap-4">
            <span className="text-text-tertiary shrink-0 text-sm font-medium tracking-[-0.7px]">선호 상권</span>
            <div className="flex flex-col items-end gap-1">
              {hasPreferredArea ? (
                preferredAreas.map((area, index) => (
                  <span
                    key={`${index}-${area}`}
                    className="text-text-primary text-right text-sm font-medium tracking-[-0.7px]"
                  >
                    {index + 1}순위 · {toLabel(AREA_TYPE_OPTIONS, area)}
                  </span>
                ))
              ) : (
                <span className="text-text-primary text-sm font-medium tracking-[-0.7px]">-</span>
              )}
            </div>
          </div>

          {importanceRows.map(row => (
            <Row key={row.label} label={row.label} value={toLabel(IMPORTANCE_OPTIONS, row.value)} />
          ))}
        </div>
      </section>
    </aside>
  );
}
