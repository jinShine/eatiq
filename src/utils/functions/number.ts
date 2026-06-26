/**
 * 숫자를 지정된 범위로 제한합니다.
 * @param value - 제한할 값
 * @param min - 최소값
 * @param max - 최대값
 * @returns 제한된 값
 * @example
 * clamp(150, 0, 100) // 100
 * clamp(-10, 0, 100) // 0
 * clamp(50, 0, 100) // 50
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * 숫자를 지정된 소수점 자릿수로 반올림합니다.
 * @param value - 반올림할 값
 * @param decimals - 소수점 자릿수 (기본값: 0)
 * @returns 반올림된 값
 * @example
 * roundTo(3.14159, 2) // 3.14
 * roundTo(3.14159, 0) // 3
 */
export function roundTo(value: number, decimals: number = 0): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

/**
 * 숫자를 지정된 소수점 자릿수로 내림합니다.
 * @param value - 내림할 값
 * @param decimals - 소수점 자릿수 (기본값: 0)
 * @returns 내림된 값
 * @example
 * floorTo(3.14159, 2) // 3.14
 * floorTo(3.9, 0) // 3
 */
export function floorTo(value: number, decimals: number = 0): number {
  const factor = Math.pow(10, decimals);
  return Math.floor(value * factor) / factor;
}

/**
 * 숫자를 지정된 소수점 자릿수로 올림합니다.
 * @param value - 올림할 값
 * @param decimals - 소수점 자릿수 (기본값: 0)
 * @returns 올림된 값
 * @example
 * ceilTo(3.14159, 2) // 3.15
 * ceilTo(3.1, 0) // 4
 */
export function ceilTo(value: number, decimals: number = 0): number {
  const factor = Math.pow(10, decimals);
  return Math.ceil(value * factor) / factor;
}

/**
 * 랜덤 숫자를 생성합니다 (min 이상 max 미만).
 * @param min - 최소값 (기본값: 0)
 * @param max - 최대값 (기본값: 1)
 * @returns 랜덤 숫자
 * @example
 * random(0, 10) // 0 이상 10 미만의 랜덤 숫자
 * random() // 0 이상 1 미만의 랜덤 숫자
 */
export function random(min: number = 0, max: number = 1): number {
  return Math.random() * (max - min) + min;
}

/**
 * 랜덤 정수를 생성합니다 (min 이상 max 이하).
 * @param min - 최소값 (기본값: 0)
 * @param max - 최대값 (기본값: 100)
 * @returns 랜덤 정수
 * @example
 * randomInt(1, 10) // 1 이상 10 이하의 랜덤 정수
 * randomInt(0, 100) // 0 이상 100 이하의 랜덤 정수
 */
export function randomInt(min: number = 0, max: number = 100): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 숫자 범위를 생성합니다.
 * @param start - 시작값
 * @param end - 끝값
 * @param step - 증가값 (기본값: 1)
 * @returns 숫자 배열
 * @example
 * range(0, 5) // [0, 1, 2, 3, 4]
 * range(0, 10, 2) // [0, 2, 4, 6, 8]
 * range(5, 0, -1) // [5, 4, 3, 2, 1]
 */
export function range(start: number, end: number, step: number = 1): number[] {
  const result: number[] = [];

  if (step === 0) {
    return result;
  }

  if (step > 0) {
    for (let i = start; i < end; i += step) {
      result.push(i);
    }
  } else {
    for (let i = start; i > end; i += step) {
      result.push(i);
    }
  }

  return result;
}

/**
 * 값을 안전하게 숫자로 변환합니다.
 * @param value - 변환할 값
 * @param defaultValue - 변환 실패 시 기본값 (기본값: 0)
 * @returns 변환된 숫자 또는 기본값
 * @example
 * toNumber("123") // 123
 * toNumber("abc", 0) // 0
 * toNumber(null, 10) // 10
 */
export function toNumber(value: any, defaultValue: number = 0): number {
  if (typeof value === "number" && !isNaN(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = parseFloat(value);
    if (!isNaN(parsed)) {
      return parsed;
    }
  }

  return defaultValue;
}

/**
 * 천 단위 구분자가 포함된 문자열을 숫자로 변환합니다.
 * @param str - 변환할 문자열 (예: "1,234.56")
 * @param defaultValue - 변환 실패 시 기본값 (기본값: 0)
 * @returns 변환된 숫자 또는 기본값
 * @example
 * parseNumber("1,234.56") // 1234.56
 * parseNumber("1,000") // 1000
 */
export function parseNumber(str: string, defaultValue: number = 0): number {
  if (!str || typeof str !== "string") {
    return defaultValue;
  }

  const cleaned = str.replace(/,/g, "");
  const parsed = parseFloat(cleaned);

  return isNaN(parsed) ? defaultValue : parsed;
}

/**
 * 숫자가 범위 내에 있는지 확인합니다.
 * @param value - 확인할 값
 * @param min - 최소값
 * @param max - 최대값
 * @returns 범위 내에 있으면 true, 아니면 false
 * @example
 * isInRange(50, 0, 100) // true
 * isInRange(150, 0, 100) // false
 */
export function isInRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
}

/**
 * 숫자가 짝수인지 확인합니다.
 * @param value - 확인할 값
 * @returns 짝수이면 true, 아니면 false
 * @example
 * isEven(2) // true
 * isEven(3) // false
 */
export function isEven(value: number): boolean {
  return value % 2 === 0;
}

/**
 * 숫자가 홀수인지 확인합니다.
 * @param value - 확인할 값
 * @returns 홀수이면 true, 아니면 false
 * @example
 * isOdd(3) // true
 * isOdd(2) // false
 */
export function isOdd(value: number): boolean {
  return value % 2 !== 0;
}
