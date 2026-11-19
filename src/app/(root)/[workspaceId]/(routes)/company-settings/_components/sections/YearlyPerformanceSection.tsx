import { useState } from "react";
import { Controller, type FieldErrors, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, ChevronRight } from "lucide-react";
import z from "zod";

import { SettingsSection } from "@components/custom/settings";
import { CommaNumberInput, Toast } from "@components/ui";

import { useBrandSection, useUpdateBrandStatus } from "@services/api/brand/brand.query";
import { type BrandStatusData, type UpdateBrandStatusRequest } from "@services/api/brand/brand.type";

import { cn } from "@utils/shadcn";

import useClearOnFormChange from "../../_hooks/useClearOnFormChange";
import { toNumberText } from "./numberText";

/**
 * 연도별 실적 (피그마 「Card · 연도별 실적」 2419:1040).
 *
 * 저장은 운영 현황과 같은 PUT …/brand/status에 yearly_sales만 보낸다(기획 합의: 가맹점 수·연평균 매출·평당 연매출).
 * 서버는 보내지 않은 필드를 유지하지만(2026-11-19), yearly_sales는 배열째 바꾼다 — 보낸 연도만 남고
 * 한 해 안에서 빠진 항목은 비워진다(실측). 그래서 이 카드에 없는 항목(신규 개점·계약 종료·계약 해지)과
 * 범위 밖 연도는 저장된 값을 그대로 실어 보낸다.
 * 공정위 정보공개서 값 자동 채움·잠금도 나중 작업이다 — 지금은 모든 칸을 직접 입력한다.
 */

/** 2020년부터 올해까지. 올해 칸은 지금 기준(가맹점 수는 현재 수, 매출은 올해 평균) */
const FIRST_YEAR = 2020;
const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: CURRENT_YEAR - FIRST_YEAR + 1 }, (_, i) => FIRST_YEAR + i);
/** 한 번에 보이는 연도 수 — 시안 6칸 */
const VISIBLE_YEARS = 6;

/** 만 원 ↔ 원 */
const MANWON = 10_000;

/** 필드 이름은 저장 DTO(BrandYearlySalesDto)와 같다. 매출 두 칸은 화면에서만 만 원 단위다 */
const ROWS = [
  {
    name: "franchise_count",
    title: "가맹점 수 (개)",
    caption: "그해 말 · 직영점 제외",
    max: { value: 100_000, label: "10만 개" },
  },
  {
    name: "avg_annual_sales",
    title: "가맹점 연평균 매출 (만 원)",
    caption: "가맹점 한 곳 기준",
    // 운영 현황 매출 상한(1조 원)과 같다
    max: { value: 100_000_000, label: "1조 원" },
  },
  {
    name: "sales_per_area",
    title: "평당 연매출 (만 원)",
    caption: "3.3㎡(1평)당 · 가맹점 평균",
    max: { value: 100_000_000, label: "1조 원" },
  },
] as const;

type RowName = (typeof ROWS)[number]["name"];

const INTEGER = /^\d+$/;

// 빈칸은 「그해 값 없음」이라 허용한다
const cellField = ({ value, label }: (typeof ROWS)[number]["max"]) =>
  z
    .string()
    .refine(input => input === "" || INTEGER.test(input), "0 이상의 정수를 입력해주세요")
    .refine(input => !INTEGER.test(input) || Number(input) <= value, `${label} 이하로 입력해주세요`);

// 세 칸 모두 선택 입력이다(2026-11-19 서버 필수 해제). 한 해에 아는 값만 적어도 된다
const yearSchema = z.object(
  Object.fromEntries(ROWS.map(row => [row.name, cellField(row.max)])) as Record<RowName, ReturnType<typeof cellField>>,
);

/** 키에 「y」를 붙인다 — 「2021」처럼 숫자만 있는 키는 RHF가 배열 위치로 읽는다 */
const yearKey = (year: number) => `y${year}` as const;
type YearKey = ReturnType<typeof yearKey>;

const yearlySchema = z.object({
  years: z.object(
    Object.fromEntries(YEARS.map(year => [yearKey(year), yearSchema])) as Record<YearKey, typeof yearSchema>,
  ),
});

type YearlyFormValues = z.infer<typeof yearlySchema>;
type YearValues = z.infer<typeof yearSchema>;

const EMPTY_YEAR: YearValues = { franchise_count: "", avg_annual_sales: "", sales_per_area: "" };

/** 원 → 만 원 문자열. 화면은 정수만 받아 반올림한다(저장할 때 바뀌지 않은 칸은 원래 원 값을 보낸다) */
const toManwonText = (won: number) => String(Math.round(won / MANWON));

/**
 * 만 원 문자열 → 원. 반올림해 보여 준 값을 그대로 두었으면 원래 값을 보내 원 단위 끝자리를 지킨다.
 * 빈칸은 undefined — 배열째 바뀌는 yearly_sales 안에서는 빠진 항목이 비워진다
 */
const toWon = (text: string, original?: number | null) => {
  if (text === "") {
    return undefined;
  }
  return original !== undefined && original !== null && toManwonText(original) === text
    ? original
    : Number(text) * MANWON;
};

/** 저장된 숫자 → 요청 값. 비어(null) 있으면 뺀다 */
const keepNumber = (value: number | null | undefined) => (value === null ? undefined : value);

type SavedYearly = NonNullable<BrandStatusData["yearly_sales"]>[number];
type YearlyRequest = NonNullable<UpdateBrandStatusRequest["yearly_sales"]>[number];

/** 이 카드에 없는 항목 — 저장된 값을 그대로 실어 보낸다(빠뜨리면 배열째 바뀌며 지워진다) */
const keepOtherFields = (item?: SavedYearly) => ({
  new_open: keepNumber(item?.new_open),
  contract_end: keepNumber(item?.contract_end),
  contract_cancel: keepNumber(item?.contract_cancel),
});

const toYearlyRequest = (values: YearlyFormValues, saved?: BrandStatusData | null): YearlyRequest[] => {
  // 연도가 빈 항목은 어느 해인지 알 수 없어 다루지 않는다
  const savedItems = (saved?.yearly_sales ?? []).filter(
    (item): item is SavedYearly & { year: number } => item.year != null,
  );
  const byYear = new Map(savedItems.map(item => [item.year, item]));

  const inRange = YEARS.flatMap(year => {
    const row = values.years[yearKey(year)];
    // 세 칸이 모두 비면 그해는 보내지 않는다
    if (ROWS.every(({ name }) => row[name] === "")) {
      return [];
    }
    const prev = byYear.get(year);
    return [
      {
        year,
        avg_annual_sales: toWon(row.avg_annual_sales, prev?.avg_annual_sales),
        sales_per_area: toWon(row.sales_per_area, prev?.sales_per_area),
        franchise_count: row.franchise_count === "" ? undefined : Number(row.franchise_count),
        ...keepOtherFields(prev),
      },
    ];
  });

  // 2020년 이전처럼 화면에 없는 연도는 손대지 않고 그대로 보낸다
  const outOfRange = savedItems
    .filter(item => !YEARS.includes(item.year))
    .map(item => ({
      year: item.year,
      avg_annual_sales: keepNumber(item.avg_annual_sales),
      sales_per_area: keepNumber(item.sales_per_area),
      franchise_count: keepNumber(item.franchise_count),
      ...keepOtherFields(item),
    }));

  return [...outOfRange, ...inRange].sort((a, b) => a.year - b.year);
};

/** yearly_sales만 보낸다 — 운영 현황 필드는 보내지 않으면 서버가 그대로 둔다 */
const toRequest = (values: YearlyFormValues, saved?: BrandStatusData | null): UpdateBrandStatusRequest => ({
  yearly_sales: toYearlyRequest(values, saved),
});

const toFormValues = (saved?: BrandStatusData | null): YearlyFormValues => {
  const byYear = new Map((saved?.yearly_sales ?? []).map(item => [item.year, item]));
  return {
    years: Object.fromEntries(
      YEARS.map(year => {
        const item = byYear.get(year);
        const values: YearValues = item
          ? {
              // 가맹점 수는 선택 항목이라 비어(null) 올 수 있다
              franchise_count: toNumberText(item.franchise_count),
              avg_annual_sales: item.avg_annual_sales == null ? "" : toManwonText(item.avg_annual_sales),
              sales_per_area: item.sales_per_area == null ? "" : toManwonText(item.sales_per_area),
            }
          : EMPTY_YEAR;
        return [yearKey(year), values];
      }),
    ) as YearlyFormValues["years"],
  };
};

/** ‹ › — 시안 28px 원. 끝에 닿으면 흐린 회색 */
function YearNavButton({
  direction,
  disabled,
  onClick,
}: {
  direction: "prev" | "next";
  disabled: boolean;
  onClick: () => void;
}) {
  const Icon = direction === "prev" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "prev" ? "이전 연도 보기" : "다음 연도 보기"}
      className={cn(
        "focus-visible:ring-ring flex size-7 items-center justify-center rounded-full border transition-colors focus-visible:ring-2 focus-visible:outline-none",
        disabled
          ? "bg-secondary-background border-border/60 text-text-disabled cursor-not-allowed"
          : "border-border text-text-secondary hover:bg-accent cursor-pointer bg-white",
      )}
    >
      <Icon aria-hidden className="size-4" />
    </button>
  );
}

type YearlyPerformanceSectionProps = {
  workspaceId: string;
};

export default function YearlyPerformanceSection({ workspaceId }: YearlyPerformanceSectionProps) {
  // OperationSection과 같은 이유로 React Compiler 제외(RHF reset 후 입력칸 갱신)
  "use no memo";

  const { data: saved } = useBrandSection(workspaceId, "brand_status");

  const { mutate: updateBrandStatus, isPending, error, reset: clearSaveError } = useUpdateBrandStatus(workspaceId);

  const {
    control,
    reset,
    watch,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<YearlyFormValues>({
    resolver: zodResolver(yearlySchema),
    // 칸마다 오류 문구 자리가 없어, 고치는 즉시 빨간 표시가 풀리게 입력하면서 검사한다
    mode: "onChange",
    values: toFormValues(saved),
  });

  useClearOnFormChange(watch, clearSaveError);

  const onSubmit = (values: YearlyFormValues) => {
    updateBrandStatus(toRequest(values, saved), {
      onSuccess: response => {
        // 서버가 저장한 모양으로 폼을 맞춘다(목 모드는 보낸 값). 이걸 해야 dirty가 풀린다
        reset(response ? toFormValues(response.brand_status) : values, { keepFieldsRef: true });
        Toast.success("연도별 실적을 저장했어요.");
      },
    });
  };

  // 처음엔 올해가 오른쪽 끝에 오게 최근 6년을 보여준다
  const lastStart = Math.max(0, YEARS.length - VISIBLE_YEARS);
  const [start, setStart] = useState(lastStart);
  const visibleYears = YEARS.slice(start, start + VISIBLE_YEARS);

  // 저장 때 화면 밖 연도에 오류가 있으면 그해가 보이게 옮긴다 — 그래야 빨간 칸에 포커스가 간다
  const onInvalid = (invalid: FieldErrors<YearlyFormValues>) => {
    const index = YEARS.findIndex(year => invalid.years?.[yearKey(year)]);
    if (index !== -1 && (index < start || index >= start + VISIBLE_YEARS)) {
      setStart(Math.min(Math.max(0, index - VISIBLE_YEARS + 1), lastStart));
    }
  };

  // 칸 안에 문구를 넣을 자리가 없어 표 아래에 모아 보여준다 — 첫 오류 하나.
  // 화면 밖 연도의 오류도 알 수 있게 전체 연도에서 찾는다(문구에 연도가 들어간다)
  const firstError = YEARS.flatMap(year =>
    ROWS.map(row => ({ year, row, message: errors.years?.[yearKey(year)]?.[row.name]?.message })),
  ).find(item => item.message);

  return (
    <SettingsSection
      title="연도별 실적"
      description="가맹점 수와 가맹점 한 곳의 연평균 매출을 연도별로 적어 주세요"
      isDirty={isDirty}
      isPending={isPending}
      errorMessage={error?.message}
      onSubmit={handleSubmit(onSubmit, onInvalid)}
    >
      {/* 좁은 화면에선 표를 옆으로 넘겨 본다. 항목 이름 칸은 왼쪽에 붙여 둔다.
          넘기는 영역을 카드 여백까지 넓히면(-mx px) 고정된 이름 칸 왼쪽 여백으로 지나가는 칸이 비쳐 보여서, 본문 폭 안에서만 넘긴다 */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[960px] sm:min-w-[1040px] border-collapse">
          <caption className="sr-only">연도별 실적 입력 표</caption>
          <thead>
            <tr className="border-border border-b">
              <th scope="col" className="sticky left-0 z-10 bg-white pb-2">
                <span className="sr-only">항목</span>
              </th>
              <td className="w-9 pb-2">
                <div className="flex justify-center">
                  <YearNavButton direction="prev" disabled={start === 0} onClick={() => setStart(start - 1)} />
                </div>
              </td>
              {visibleYears.map(year => (
                <th key={year} scope="col" className="w-32 pb-2">
                  <span className="text-text-secondary text-sm font-bold tracking-[-0.7px]">{year}</span>
                  {year === CURRENT_YEAR && (
                    <span className="text-text-disabled ml-1 text-[11px] font-medium">올해</span>
                  )}
                </th>
              ))}
              <td className="w-9 pb-2">
                <div className="flex justify-center">
                  <YearNavButton direction="next" disabled={start >= lastStart} onClick={() => setStart(start + 1)} />
                </div>
              </td>
            </tr>
          </thead>
          <tbody>
            {ROWS.map(row => (
              <tr key={row.name} className="border-border/60 border-b">
                {/* 좁은 화면에선 항목 이름을 두 줄로 접어 연도 칸이 하나라도 더 보이게 한다 */}
                <th
                  scope="row"
                  className="sticky left-0 z-10 w-[120px] bg-white py-3 pr-3 text-left break-keep sm:w-auto sm:pr-4"
                >
                  <p className="text-text-primary text-sm font-bold tracking-[-0.7px] sm:whitespace-nowrap">
                    {row.title}
                  </p>
                  <p className="text-text-tertiary mt-0.5 text-xs font-medium sm:whitespace-nowrap">{row.caption}</p>
                </th>
                <td aria-hidden />
                {visibleYears.map(year => {
                  const name = `years.${yearKey(year)}.${row.name}` as const;
                  const message = errors.years?.[yearKey(year)]?.[row.name]?.message;
                  return (
                    <td key={year} className="px-1.5 py-3">
                      <Controller
                        name={name}
                        control={control}
                        render={({ field }) => (
                          <CommaNumberInput
                            id={name}
                            size="md"
                            aria-label={`${year}년 ${row.title}`}
                            placeholder="—"
                            // 시안: 40px 칸, 가운데 정렬, 빈칸 표시 「—」는 연한 회색
                            className="h-10 rounded-lg bg-white text-center font-medium tracking-[-0.7px] placeholder:text-gray-300"
                            error={Boolean(message)}
                            {...field}
                          />
                        )}
                      />
                    </td>
                  );
                })}
                <td aria-hidden />
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {firstError && (
        <p role="alert" className="text-destructive text-xs">
          {firstError.year}년 {firstError.row.title.replace(/ \(.+\)$/, "")}: {firstError.message}
        </p>
      )}

      <ul className="text-text-tertiary flex flex-col gap-1 text-xs font-medium">
        <li>· 빈 칸에 숫자를 입력하고 [저장]을 누르면 돼요.</li>
        <li>
          · ‹ › 로 {FIRST_YEAR}년부터 올해까지 한 해씩 옮겨 볼 수 있어요. 올해 칸은 지금 기준이에요 — 가맹점 수는 현재
          수, 매출은 올해 평균.
        </li>
      </ul>
    </SettingsSection>
  );
}
