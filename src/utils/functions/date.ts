import dayjs, { type Dayjs } from "dayjs";
import "dayjs/locale/ko";
import duration from "dayjs/plugin/duration";
import isBetweenPlugin from "dayjs/plugin/isBetween";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isTodayPlugin from "dayjs/plugin/isToday";
import isTomorrowPlugin from "dayjs/plugin/isTomorrow";
import isYesterdayPlugin from "dayjs/plugin/isYesterday";
import relativeTime from "dayjs/plugin/relativeTime";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

// dayjs 플러그인 확장
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);
dayjs.extend(isBetweenPlugin);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(isTodayPlugin);
dayjs.extend(isTomorrowPlugin);
dayjs.extend(isYesterdayPlugin);
dayjs.extend(duration);

// 한국어 로케일 설정
dayjs.locale("ko");

/**
 * 주어진 날짜를 지정된 형식의 문자열로 변환합니다.
 * @param date - 변환할 Date 객체, 날짜 문자열, 또는 Dayjs 객체
 * @param format - 날짜 형식 문자열 (기본값: "YYYY-MM-DD")
 * @returns 형식에 맞게 변환된 날짜 문자열
 * @example
 * formatDate(new Date("2024-03-20"), "YYYY-MM-DD HH:mm:ss")
 *    => 결과: "2024-03-20 14:30:00"
 * formatDate("2024-03-20", "YYYY년 MM월 DD일")
 *    => 결과: "2024년 03월 20일"
 */
export function formatDate(date: Date | string | Dayjs, format = "YYYY-MM-DD"): string {
  const dateObj = dayjs(date);

  if (!dateObj.isValid()) {
    throw new Error("Invalid date");
  }

  return dateObj.format(format);
}

/**
 * 주어진 날짜를 현재 시점 기준으로 상대적인 시간 표현으로 변환합니다.
 * @param date - 변환할 Date 객체, 날짜 문자열, 또는 Dayjs 객체
 * @returns 상대적 시간 표현 (예: "3일 전", "2시간 전", "방금 전", "3일 후")
 * @example
 * formatRelativeTime(new Date(Date.now() - 3600000))
 *    => 결과: "1시간 전"
 */
export function formatRelativeTime(date: Date | string | Dayjs): string {
  const dateObj = dayjs(date);

  if (!dateObj.isValid()) {
    throw new Error("Invalid date");
  }

  const now = dayjs();
  const diffDays = dateObj.diff(now, "day");

  // 7일 이상 차이나면 날짜 형식으로 반환
  if (Math.abs(diffDays) > 7) {
    return formatDate(dateObj);
  }

  return dateObj.fromNow();
}

/**
 * 초 단위의 시간을 시간/분/초 형식의 문자열로 변환합니다.
 * @param seconds - 변환할 시간(초), 음수도 허용
 * @returns 변환된 시간 문자열 (예: "2시간 30분 15초")
 * @example
 * formatDuration(3665) // "1시간 1분 5초"
 * formatDuration(-3665) // "-1시간 1분 5초"
 * formatDuration(0) // "0초"
 */
export function formatDuration(seconds: number): string {
  const isNegative = seconds < 0;
  const absSeconds = Math.abs(seconds);
  const dur = dayjs.duration(absSeconds, "seconds");

  const hours = Math.floor(dur.asHours());
  const minutes = dur.minutes();
  const secs = dur.seconds();

  const parts: string[] = [];
  if (hours > 0) {
    parts.push(`${hours}시간`);
  }
  if (minutes > 0) {
    parts.push(`${minutes}분`);
  }
  if (secs > 0 || parts.length === 0) {
    parts.push(`${secs}초`);
  }

  const result = parts.join(" ");
  return isNegative ? `-${result}` : result;
}

/**
 * 날짜가 유효한지 확인합니다.
 * @param date - 확인할 Date 객체, 날짜 문자열, 또는 Dayjs 객체
 * @returns 유효한 날짜이면 true, 아니면 false
 * @example
 * isValidDate(new Date()) // true
 * isValidDate("invalid") // false
 * isValidDate("2024-03-20") // true
 */
export function isValidDate(date: Date | string | Dayjs | null | undefined): boolean {
  if (date == null) {
    return false;
  }
  return dayjs(date).isValid();
}

/**
 * 두 날짜 사이의 일수 차이를 계산합니다.
 * @param date1 - 첫 번째 날짜
 * @param date2 - 두 번째 날짜 (기본값: 현재 날짜)
 * @returns 일수 차이 (양수 또는 음수)
 * @example
 * diffDays("2024-03-20", "2024-03-25") // 5
 * diffDays("2024-03-25", "2024-03-20") // -5
 */
export function diffDays(date1: Date | string | Dayjs, date2: Date | string | Dayjs = dayjs()): number {
  return dayjs(date1).diff(dayjs(date2), "day");
}

/**
 * 두 날짜 사이의 시간 차이를 계산합니다.
 * @param date1 - 첫 번째 날짜
 * @param date2 - 두 번째 날짜 (기본값: 현재 날짜)
 * @returns 시간 차이 (양수 또는 음수)
 * @example
 * diffHours("2024-03-20 10:00", "2024-03-20 14:00") // 4
 */
export function diffHours(date1: Date | string | Dayjs, date2: Date | string | Dayjs = dayjs()): number {
  return dayjs(date1).diff(dayjs(date2), "hour");
}

/**
 * 두 날짜 사이의 분 차이를 계산합니다.
 * @param date1 - 첫 번째 날짜
 * @param date2 - 두 번째 날짜 (기본값: 현재 날짜)
 * @returns 분 차이 (양수 또는 음수)
 * @example
 * diffMinutes("2024-03-20 10:00", "2024-03-20 10:30") // 30
 */
export function diffMinutes(date1: Date | string | Dayjs, date2: Date | string | Dayjs = dayjs()): number {
  return dayjs(date1).diff(dayjs(date2), "minute");
}

/**
 * 날짜에 일수를 더합니다.
 * @param date - 기준 날짜
 * @param days - 더할 일수 (음수 가능)
 * @returns 더해진 날짜의 Dayjs 객체
 * @example
 * addDays("2024-03-20", 5) // "2024-03-25"
 * addDays("2024-03-20", -5) // "2024-03-15"
 */
export function addDays(date: Date | string | Dayjs, days: number): Dayjs {
  return dayjs(date).add(days, "day");
}

/**
 * 날짜에 개월수를 더합니다.
 * @param date - 기준 날짜
 * @param months - 더할 개월수 (음수 가능)
 * @returns 더해진 날짜의 Dayjs 객체
 * @example
 * addMonths("2024-03-20", 2) // "2024-05-20"
 */
export function addMonths(date: Date | string | Dayjs, months: number): Dayjs {
  return dayjs(date).add(months, "month");
}

/**
 * 날짜에 연수를 더합니다.
 * @param date - 기준 날짜
 * @param years - 더할 연수 (음수 가능)
 * @returns 더해진 날짜의 Dayjs 객체
 * @example
 * addYears("2024-03-20", 1) // "2025-03-20"
 */
export function addYears(date: Date | string | Dayjs, years: number): Dayjs {
  return dayjs(date).add(years, "year");
}

/**
 * 날짜에 시간을 더합니다.
 * @param date - 기준 날짜
 * @param hours - 더할 시간 (음수 가능)
 * @returns 더해진 날짜의 Dayjs 객체
 * @example
 * addHours("2024-03-20 10:00", 3) // "2024-03-20 13:00"
 */
export function addHours(date: Date | string | Dayjs, hours: number): Dayjs {
  return dayjs(date).add(hours, "hour");
}

/**
 * 날짜에 분을 더합니다.
 * @param date - 기준 날짜
 * @param minutes - 더할 분 (음수 가능)
 * @returns 더해진 날짜의 Dayjs 객체
 * @example
 * addMinutes("2024-03-20 10:00", 30) // "2024-03-20 10:30"
 */
export function addMinutes(date: Date | string | Dayjs, minutes: number): Dayjs {
  return dayjs(date).add(minutes, "minute");
}

/**
 * 하루의 시작 시간(00:00:00)을 반환합니다.
 * @param date - 기준 날짜 (기본값: 오늘)
 * @returns 하루의 시작 시간 Dayjs 객체
 * @example
 * getStartOfDay("2024-03-20 14:30:00") // "2024-03-20 00:00:00"
 */
export function getStartOfDay(date: Date | string | Dayjs = dayjs()): Dayjs {
  return dayjs(date).startOf("day");
}

/**
 * 하루의 끝 시간(23:59:59)을 반환합니다.
 * @param date - 기준 날짜 (기본값: 오늘)
 * @returns 하루의 끝 시간 Dayjs 객체
 * @example
 * getEndOfDay("2024-03-20 14:30:00") // "2024-03-20 23:59:59"
 */
export function getEndOfDay(date: Date | string | Dayjs = dayjs()): Dayjs {
  return dayjs(date).endOf("day");
}

/**
 * 주의 시작 날짜(월요일 00:00:00)를 반환합니다.
 * @param date - 기준 날짜 (기본값: 오늘)
 * @returns 주의 시작 날짜 Dayjs 객체
 * @example
 * getStartOfWeek("2024-03-20") // 해당 주의 월요일
 */
export function getStartOfWeek(date: Date | string | Dayjs = dayjs()): Dayjs {
  return dayjs(date).startOf("week");
}

/**
 * 주의 끝 날짜(일요일 23:59:59)를 반환합니다.
 * @param date - 기준 날짜 (기본값: 오늘)
 * @returns 주의 끝 날짜 Dayjs 객체
 * @example
 * getEndOfWeek("2024-03-20") // 해당 주의 일요일
 */
export function getEndOfWeek(date: Date | string | Dayjs = dayjs()): Dayjs {
  return dayjs(date).endOf("week");
}

/**
 * 월의 시작 날짜(1일 00:00:00)를 반환합니다.
 * @param date - 기준 날짜 (기본값: 오늘)
 * @returns 월의 시작 날짜 Dayjs 객체
 * @example
 * getStartOfMonth("2024-03-20") // "2024-03-01 00:00:00"
 */
export function getStartOfMonth(date: Date | string | Dayjs = dayjs()): Dayjs {
  return dayjs(date).startOf("month");
}

/**
 * 월의 끝 날짜(마지막 일 23:59:59)를 반환합니다.
 * @param date - 기준 날짜 (기본값: 오늘)
 * @returns 월의 끝 날짜 Dayjs 객체
 * @example
 * getStartOfMonth("2024-03-20") // "2024-03-31 23:59:59"
 */
export function getEndOfMonth(date: Date | string | Dayjs = dayjs()): Dayjs {
  return dayjs(date).endOf("month");
}

/**
 * 연도의 시작 날짜(1월 1일 00:00:00)를 반환합니다.
 * @param date - 기준 날짜 (기본값: 오늘)
 * @returns 연도의 시작 날짜 Dayjs 객체
 * @example
 * getStartOfYear("2024-03-20") // "2024-01-01 00:00:00"
 */
export function getStartOfYear(date: Date | string | Dayjs = dayjs()): Dayjs {
  return dayjs(date).startOf("year");
}

/**
 * 연도의 끝 날짜(12월 31일 23:59:59)를 반환합니다.
 * @param date - 기준 날짜 (기본값: 오늘)
 * @returns 연도의 끝 날짜 Dayjs 객체
 * @example
 * getEndOfYear("2024-03-20") // "2024-12-31 23:59:59"
 */
export function getEndOfYear(date: Date | string | Dayjs = dayjs()): Dayjs {
  return dayjs(date).endOf("year");
}

/**
 * 두 날짜가 같은 날인지 확인합니다.
 * @param date1 - 첫 번째 날짜
 * @param date2 - 두 번째 날짜 (기본값: 오늘)
 * @returns 같은 날이면 true, 아니면 false
 * @example
 * isSameDay("2024-03-20", "2024-03-20 14:30") // true
 */
export function isSameDay(date1: Date | string | Dayjs, date2: Date | string | Dayjs = dayjs()): boolean {
  return dayjs(date1).isSame(dayjs(date2), "day");
}

/**
 * 두 날짜가 같은 달인지 확인합니다.
 * @param date1 - 첫 번째 날짜
 * @param date2 - 두 번째 날짜 (기본값: 오늘)
 * @returns 같은 달이면 true, 아니면 false
 * @example
 * isSameMonth("2024-03-20", "2024-03-15") // true
 */
export function isSameMonth(date1: Date | string | Dayjs, date2: Date | string | Dayjs = dayjs()): boolean {
  return dayjs(date1).isSame(dayjs(date2), "month");
}

/**
 * 두 날짜가 같은 연도인지 확인합니다.
 * @param date1 - 첫 번째 날짜
 * @param date2 - 두 번째 날짜 (기본값: 오늘)
 * @returns 같은 연도이면 true, 아니면 false
 * @example
 * isSameYear("2024-03-20", "2024-12-25") // true
 */
export function isSameYear(date1: Date | string | Dayjs, date2: Date | string | Dayjs = dayjs()): boolean {
  return dayjs(date1).isSame(dayjs(date2), "year");
}

/**
 * 날짜가 오늘인지 확인합니다.
 * @param date - 확인할 날짜
 * @returns 오늘이면 true, 아니면 false
 * @example
 * isToday("2024-03-20") // 오늘이 2024-03-20이면 true
 */
export function isToday(date: Date | string | Dayjs): boolean {
  return dayjs(date).isToday();
}

/**
 * 날짜가 내일인지 확인합니다.
 * @param date - 확인할 날짜
 * @returns 내일이면 true, 아니면 false
 * @example
 * isTomorrow("2024-03-21") // 오늘이 2024-03-20이면 true
 */
export function isTomorrow(date: Date | string | Dayjs): boolean {
  return dayjs(date).isTomorrow();
}

/**
 * 날짜가 어제인지 확인합니다.
 * @param date - 확인할 날짜
 * @returns 어제이면 true, 아니면 false
 * @example
 * isYesterday("2024-03-19") // 오늘이 2024-03-20이면 true
 */
export function isYesterday(date: Date | string | Dayjs): boolean {
  return dayjs(date).isYesterday();
}

/**
 * 날짜가 미래인지 확인합니다.
 * @param date - 확인할 날짜
 * @param compareDate - 비교할 날짜 (기본값: 오늘)
 * @returns 미래이면 true, 아니면 false
 * @example
 * isFuture("2024-03-25") // 오늘이 2024-03-20이면 true
 */
export function isFuture(date: Date | string | Dayjs, compareDate: Date | string | Dayjs = dayjs()): boolean {
  return dayjs(date).isAfter(dayjs(compareDate));
}

/**
 * 날짜가 과거인지 확인합니다.
 * @param date - 확인할 날짜
 * @param compareDate - 비교할 날짜 (기본값: 오늘)
 * @returns 과거이면 true, 아니면 false
 * @example
 * isPast("2024-03-15") // 오늘이 2024-03-20이면 true
 */
export function isPast(date: Date | string | Dayjs, compareDate: Date | string | Dayjs = dayjs()): boolean {
  return dayjs(date).isBefore(dayjs(compareDate));
}

/**
 * 날짜가 특정 날짜 범위 내에 있는지 확인합니다.
 * @param date - 확인할 날짜
 * @param startDate - 시작 날짜
 * @param endDate - 끝 날짜
 * @param unit - 비교 단위 (기본값: "day")
 * @returns 범위 내에 있으면 true, 아니면 false
 * @example
 * isBetween("2024-03-20", "2024-03-15", "2024-03-25") // true
 */
export function isBetween(
  date: Date | string | Dayjs,
  startDate: Date | string | Dayjs,
  endDate: Date | string | Dayjs,
  unit: "day" | "month" | "year" | "hour" | "minute" = "day",
): boolean {
  return dayjs(date).isBetween(dayjs(startDate), dayjs(endDate), unit, "[]");
}

/**
 * 요일 이름을 반환합니다.
 * @param date - 날짜
 * @param locale - 로케일 (기본값: "ko")
 * @returns 요일 이름
 * @example
 * getDayName("2024-03-20") // "수요일"
 * getDayName("2024-03-20", "en") // "Wednesday"
 */
export function getDayName(date: Date | string | Dayjs, locale: string = "ko"): string {
  const dateObj = dayjs(date);
  return dateObj.locale(locale).format("dddd");
}

/**
 * 월 이름을 반환합니다.
 * @param date - 날짜
 * @param locale - 로케일 (기본값: "ko")
 * @returns 월 이름
 * @example
 * getMonthName("2024-03-20") // "3월"
 * getMonthName("2024-03-20", "en") // "March"
 */
export function getMonthName(date: Date | string | Dayjs, locale: string = "ko"): string {
  const dateObj = dayjs(date);
  return dateObj.locale(locale).format("MMMM");
}

/**
 * 시간만 포맷팅합니다.
 * @param date - 날짜
 * @param format - 시간 형식 (기본값: "HH:mm:ss")
 * @returns 포맷된 시간 문자열
 * @example
 * formatTime("2024-03-20 14:30:00") // "14:30:00"
 * formatTime("2024-03-20 14:30:00", "HH:mm") // "14:30"
 */
export function formatTime(date: Date | string | Dayjs, format: string = "HH:mm:ss"): string {
  return dayjs(date).format(format);
}

/**
 * 날짜 범위를 포맷팅합니다.
 * @param startDate - 시작 날짜
 * @param endDate - 끝 날짜
 * @param format - 날짜 형식 (기본값: "YYYY-MM-DD")
 * @param separator - 구분자 (기본값: " ~ ")
 * @returns 포맷된 날짜 범위 문자열
 * @example
 * formatDateRange("2024-03-20", "2024-03-25") // "2024-03-20 ~ 2024-03-25"
 * formatDateRange("2024-03-20", "2024-03-25", "YYYY.MM.DD", " - ") // "2024.03.20 - 2024.03.25"
 */
export function formatDateRange(
  startDate: Date | string | Dayjs,
  endDate: Date | string | Dayjs,
  format: string = "YYYY-MM-DD",
  separator: string = " ~ ",
): string {
  const start = formatDate(startDate, format);
  const end = formatDate(endDate, format);
  return `${start}${separator}${end}`;
}

/**
 * Unix 타임스탬프를 날짜로 변환합니다.
 * @param timestamp - Unix 타임스탬프 (초 단위)
 * @returns Dayjs 객체
 * @example
 * fromUnixTimestamp(1710921600) // "2024-03-20"
 */
export function fromUnixTimestamp(timestamp: number): Dayjs {
  return dayjs.unix(timestamp);
}

/**
 * 날짜를 Unix 타임스탬프로 변환합니다.
 * @param date - 날짜
 * @returns Unix 타임스탬프 (초 단위)
 * @example
 * toUnixTimestamp("2024-03-20") // 1710921600
 */
export function toUnixTimestamp(date: Date | string | Dayjs): number {
  return dayjs(date).unix();
}

/**
 * 날짜를 ISO 8601 형식 문자열로 변환합니다.
 * @param date - 날짜
 * @returns ISO 8601 형식 문자열
 * @example
 * toISOString("2024-03-20") // "2024-03-20T00:00:00+09:00"
 */
export function toISOString(date: Date | string | Dayjs): string {
  return dayjs(date).toISOString();
}

/**
 * 현재 날짜/시간을 반환합니다.
 * @returns 현재 날짜/시간의 Dayjs 객체
 * @example
 * now() // 현재 날짜/시간
 */
export function now(): Dayjs {
  return dayjs();
}

/**
 * 오늘 날짜를 반환합니다.
 * @returns 오늘 날짜의 Dayjs 객체 (시간은 00:00:00)
 * @example
 * today() // 오늘 날짜
 */
export function today(): Dayjs {
  return dayjs().startOf("day");
}
