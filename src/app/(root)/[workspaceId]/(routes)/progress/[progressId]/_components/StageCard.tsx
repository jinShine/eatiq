"use client";

import { Select, SelectItem } from "@components/ui";

import { type StageCode } from "../../_components/progressOptions";
import { STAGE_SELECT_OPTIONS } from "./recordOptions";

type StageCardProps = {
  stage: StageCode;
  onChange: (stage: StageCode) => void;
};

/**
 * 현재 단계 (피그마 693:2216).
 * 시안의 「마지막 AI 분류 · 근거」는 AI 단계 판정이 없어(API 없음) 그리지 않는다.
 */
export default function StageCard({ stage, onChange }: StageCardProps) {
  return (
    <section className="flex flex-col gap-3">
      <h3 className="text-text-primary text-lg font-bold tracking-[-0.9px]">현재 단계</h3>

      <Select size="sm" value={stage} onValueChange={value => onChange(value as StageCode)} aria-label="현재 단계">
        {STAGE_SELECT_OPTIONS.map(option => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </Select>
    </section>
  );
}
