"use client";

import { Select, SelectItem } from "@components/ui";

import { type StageCode } from "../../_components/progressOptions";
import { STAGE_SELECT_OPTIONS } from "./recordOptions";

type StageCardProps = {
  stage: StageCode;
  classifiedAt: string;
  classifiedReason: string;
  onChange: (stage: StageCode) => void;
};

export default function StageCard({ stage, classifiedAt, classifiedReason, onChange }: StageCardProps) {
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

      {/* 단계는 자동 분류되므로 언제·왜 그렇게 됐는지 근거를 함께 보여준다 */}
      <div className="flex flex-col gap-0.5 text-[11px] font-medium tracking-[-0.55px]">
        <p className="text-[#6b7280]">마지막 AI 분류: {classifiedAt}</p>
        <p className="text-text-disabled">근거: {classifiedReason}</p>
      </div>
    </section>
  );
}
