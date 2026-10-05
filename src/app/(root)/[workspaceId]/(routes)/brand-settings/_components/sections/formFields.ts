import z from "zod";

/**
 * 브랜드 설정 섹션들이 같이 쓰는 검증 조각.
 * 서버 규칙(400 응답으로 확인)에 맞춘다: 선택지는 스펙 값만, 금액은 0 이상 정수.
 */
export const REQUIRED = "입력해주세요";
export const SELECT_REQUIRED = "선택해주세요";

/** 선택 항목 — 비워 둘 수 있다. 목록 밖 값은 불러올 때 pickOption으로 걸러진다 */
export const optionalChoice = <T extends readonly [string, ...string[]]>(values: T) =>
  z.union([z.enum(values), z.literal("")], { errorMap: () => ({ message: "목록에서 다시 선택해주세요" }) });

/** 필수 선택 항목 */
export const requiredChoice = <T extends readonly [string, ...string[]]>(values: T) =>
  optionalChoice(values).refine(value => value !== "", SELECT_REQUIRED);

/** 필수 선택은 검증을 통과했으면 빈 값이 아니다(requiredChoice) — 요청 타입으로 좁힌다 */
export const chosen = <T extends string>(value: T | "") => value as T;

export const INTEGER = /^\d+$/;

/**
 * 금액 상한 — 서버에 상한이 없어(20자리도 정밀도를 잃은 채 저장) 화면에서 막는다.
 * 운영 현황 매출과 같은 기준. TODO(백엔드): 서버 상한이 정해지면 맞춘다
 */
export const MAX_WON = { value: 10_000_000_000_000, label: "10조 원" };

/** 원 단위 금액 칸(쉼표 입력) — 필수, 0 이상 정수, 상한 */
export const wonField = () =>
  z
    .string()
    .min(1, REQUIRED)
    .regex(INTEGER, "0 이상의 정수를 입력해주세요")
    .refine(value => !INTEGER.test(value) || Number(value) <= MAX_WON.value, `${MAX_WON.label} 이하로 입력해주세요`);
