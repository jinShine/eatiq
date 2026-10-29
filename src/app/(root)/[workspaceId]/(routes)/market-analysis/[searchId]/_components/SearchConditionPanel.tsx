import dayjs from "dayjs";

import { type StoreSearchCondition } from "@services/api/store-search/store-search.type";

import {
  EMPTY_CELL,
  FLOOR_OPTIONS,
  formatAreaRange,
  formatMoneyRange,
  formatRentRange,
} from "../../_components/storeSearchView";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 text-sm tracking-[-0.7px]">
      <dt className="text-text-disabled shrink-0 font-medium">{label}</dt>
      <dd className="text-text-primary text-right font-bold">{value}</dd>
    </div>
  );
}

type SearchConditionPanelProps = {
  condition: StoreSearchCondition;
  createdTime: string | null;
};

/**
 * 리포트 왼쪽 「탐색 조건」(피그마 961:12020).
 * 시안의 「상세 조건」은 서버가 쓰지 않아 두지 않는다.
 * 시안에 두 번 그려진 「기준 임대료」의 둘째 줄은 현지 통화 환산으로 채운다(서버가 실제로 찾은 범위)
 */
export default function SearchConditionPanel({ condition, createdTime }: SearchConditionPanelProps) {
  const hasConversion =
    condition.converted_rent_currency !== null &&
    condition.converted_rent_currency !== condition.rent_currency &&
    (condition.converted_rent_fee_min !== null || condition.converted_rent_fee_max !== null);

  return (
    <aside className="border-border flex shrink-0 flex-col gap-3 border-b px-6 py-6 lg:w-[354px] lg:border-r lg:border-b-0">
      <h3 className="text-text-primary text-lg font-bold tracking-[-0.9px]">탐색 조건</h3>
      <dl className="flex flex-col gap-3">
        <Row label="탐색 일시" value={createdTime ? dayjs(createdTime).format("YYYY.MM.DD HH시 mm분") : EMPTY_CELL} />
        <Row label="국가 및 도시" value={`${condition.country} · ${condition.city}`} />
        <Row
          label="허용 층수"
          value={FLOOR_OPTIONS.find(option => option.value === condition.target_floor)?.label ?? "전체"}
        />
        <Row label="기준 평형" value={formatAreaRange(condition.area_min, condition.area_max, condition.area_unit)} />
        <Row
          label="기준 임대료"
          value={formatRentRange(condition.rent_fee_min, condition.rent_fee_max, condition.rent_currency)}
        />
        {hasConversion && (
          <>
            <Row
              label="현지 통화 환산"
              value={formatMoneyRange(
                condition.converted_rent_fee_min,
                condition.converted_rent_fee_max,
                condition.converted_rent_currency,
              )}
            />
            {condition.exchange_rate !== null && (
              <Row
                label="적용 환율"
                // 소수 둘째 자리까지 의미가 있어 통화 기호 대신 코드로 쓴다(「118.95 JPY」)
                value={`1,000원 = ${condition.exchange_rate} ${condition.converted_rent_currency}`}
              />
            )}
          </>
        )}
      </dl>
    </aside>
  );
}
