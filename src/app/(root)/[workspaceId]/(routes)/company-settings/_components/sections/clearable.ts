/**
 * 폼 값 → 저장 요청 값.
 *
 * 브랜드 설정 저장은 부분 업데이트다(2026-11-19) — 보내지 않은 필드는 서버가 그대로 둔다.
 * 그래서 사용자가 지운 칸은 undefined(유지)가 아니라 null(지우기)로 보내야 실제로 지워진다.
 * 선택값(enum)에 빈 문자열을 보내면 400이라 빈 칸은 모두 null이다.
 */

/** 글자 — 앞뒤 공백을 지우고, 비면 null */
export const textOrNull = (value: string) => value.trim() || null;

/** 숫자 칸(문자열로 받은 값) — 비면 null */
export const numberOrNull = (value: string) => (value.trim() === "" ? null : Number(value));

/** 선택값 — 고르지 않았으면("") null */
export const optionOrNull = <T extends string>(value: T | "") => (value === "" ? null : value);
