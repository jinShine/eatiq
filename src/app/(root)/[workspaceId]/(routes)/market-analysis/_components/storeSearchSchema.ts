import z from "zod";

import { type ExecuteStoreSearchRequest } from "@services/api/store-search/store-search.type";

import { ANY_FLOOR } from "./storeSearchView";

const numberField = z.string().refine(v => !v || /^\d+$/.test(v), { message: "숫자만 입력해주세요" });

/** 최소가 최대보다 크면 최대 칸에 알린다 — 서버는 거꾸로 된 범위를 그대로 받아 0건을 준다 */
const checkRange = (
  values: Record<string, string>,
  ctx: z.RefinementCtx,
  minKey: string,
  maxKey: string,
  message: string,
) => {
  const min = values[minKey];
  const max = values[maxKey];
  if (min && max && Number(min) > Number(max)) {
    ctx.addIssue({ code: "custom", path: [maxKey], message });
  }
};

/**
 * 기본 조건(시안 961:11665). 평형은 평, 임대료는 만원 단위로 입력받는다(시안 예시 「15평」 「300만원」).
 * 상세 조건 탭은 서버가 쓰지 않아(스펙 「상세 조건 미사용」) 두지 않는다.
 */
export const storeSearchSchema = z
  .object({
    country: z.string().min(1, "탐색 국가를 선택해주세요"),
    city: z.string().min(1, "탐색 도시를 선택해주세요"),
    areaMin: numberField,
    areaMax: numberField,
    rentMinManwon: numberField,
    rentMaxManwon: numberField,
    floor: z.string(),
  })
  .superRefine((values, ctx) => {
    checkRange(values, ctx, "areaMin", "areaMax", "최대 평형이 최소보다 작아요");
    checkRange(values, ctx, "rentMinManwon", "rentMaxManwon", "최대 임대료가 최소보다 작아요");
  });

export type StoreSearchFormValues = z.infer<typeof storeSearchSchema>;

export const EMPTY_STORE_SEARCH: StoreSearchFormValues = {
  country: "",
  city: "",
  areaMin: "",
  areaMax: "",
  rentMinManwon: "",
  rentMaxManwon: "",
  floor: ANY_FLOOR,
};

const toNumber = (value: string) => (value ? Number(value) : undefined);
const manwonToWon = (value: string) => (value ? Number(value) * 10_000 : undefined);

/** 폼 → 실행 요청. 빈 칸·「전체」 층은 보내지 않는다 */
export const toExecuteRequest = (values: StoreSearchFormValues): Omit<ExecuteStoreSearchRequest, "workspace_uid"> => ({
  country: values.country,
  city: values.city,
  target_floor: values.floor === ANY_FLOOR ? undefined : (values.floor as ExecuteStoreSearchRequest["target_floor"]),
  area_min: toNumber(values.areaMin),
  area_max: toNumber(values.areaMax),
  area_unit: "pyeong",
  rent_fee_min: manwonToWon(values.rentMinManwon),
  rent_fee_max: manwonToWon(values.rentMaxManwon),
  rent_currency: "KRW",
});
