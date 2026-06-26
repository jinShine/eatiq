/**
 * 숫자를 지정된 로케일의 형식으로 포맷팅합니다.
 * 단위를 지정하면 숫자 뒤에 단위가 추가됩니다.
 * @param num - 포맷할 숫자
 * @param options - 포맷팅 옵션
 * @param options.locale - 로케일 문자열 (기본값: "ko-KR")
 * @param options.unit - 통화 단위 (선택사항)
 * @returns 포맷된 숫자 문자열 (단위가 지정되면 단위 포함)
 * @example
 * formatNumber(1000000) // "1,000,000"
 * formatNumber(1000000, { locale: "en-US" }) // "1,000,000"
 * formatNumber(1000000, { unit: "원" }) // "1,000,000원"
 * formatNumber(1000000, { locale: "en-US", unit: "$" }) // "1,000,000$"
 */
export function formatNumber(
  num: number,
  options: { locale?: string; unit?: string } = { locale: "ko-KR", unit: "원" },
): string {
  const locale = options?.locale ?? "ko-KR";
  const unit = options?.unit ?? "원";

  if (!Number.isFinite(num)) {
    return unit ? `0${unit}` : "0";
  }
  const formatted = new Intl.NumberFormat(locale).format(num);
  return unit ? `${formatted}${unit}` : formatted;
}

/**
 * 숫자를 한국어 단위(억, 만, 천)로 축약하여 변환합니다.
 * @param num - 변환할 숫자
 * @param decimals - 소수점 자릿수 (기본값: 1)
 * @returns 한국어 단위로 축약된 문자열
 * @example
 * formatCompact(1234567) // "123.5만"
 * formatCompact(123456789) // "1.2억"
 */
export function formatCompact(num: number, decimals: number = 0): string {
  const isNegative = num < 0;
  const absNum = Math.abs(num);

  const removeTrailingZero = (str: string): string => {
    return str.endsWith(".0") ? str.slice(0, -2) : str;
  };

  let result: string;

  if (absNum >= 100000000) {
    result = `${removeTrailingZero((absNum / 100000000).toFixed(decimals))}억`;
  } else if (absNum >= 10000) {
    result = `${removeTrailingZero((absNum / 10000).toFixed(decimals))}만`;
  } else if (absNum >= 1000) {
    result = `${removeTrailingZero((absNum / 1000).toFixed(decimals))}천`;
  } else {
    result = absNum.toString();
  }

  return isNegative ? `-${result}` : result;
}

/**
 * 숫자를 한국어 화폐 단위로 변환합니다.
 * 1만원 미만은 천단위 구분자로 표시하고, 이상은 만/억/조 단위로 표시합니다.
 * @param amount - 변환할 금액 (음수도 허용)
 * @param options - 포맷팅 옵션
 * @param options.showDecimal - 소수점 표시 여부 (기본값: true). true면 "8,208.6만원", false면 "8,208만원" (소수점 제거)
 * @returns 단위가 포함된 문자열 (예: "1,000원", "1만원", "1억원", "1조원")
 * @example
 * formatKRW(1000) // "1,000원"
 * formatKRW(10000) // "1만원"
 * formatKRW(82086000) // "8,208.6만원"
 * formatKRW(82086000, { showDecimal: false }) // "8,208만원"
 * formatKRW(123456789) // "1억 2,345만원"
 */
export function formatKRW(amount: number, options?: { showDecimal?: boolean }): string {
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);
  const sign = isNegative ? "-" : "";
  const showDecimal = options?.showDecimal ?? true;

  const formatNum = (num: number): string => {
    return new Intl.NumberFormat("ko-KR").format(num);
  };

  if (absAmount < 10000) {
    // 1만원 미만: 1,000원
    return `${sign}${formatNum(absAmount)}원`;
  } else if (absAmount < 100000000) {
    // 1억원 미만: x만원
    const man = Math.floor(absAmount / 10000);
    const remainder = absAmount % 10000;

    if (remainder === 0) {
      return `${sign}${formatNum(man)}만원`;
    }

    if (showDecimal) {
      return `${sign}${formatNum(absAmount / 10000)}만원`;
    }
    // showDecimal: false일 때는 소수점 제거하고 정수만 표시
    return `${sign}${formatNum(man)}만원`;
  } else if (absAmount < 1000000000000) {
    // 1조원 미만: x억 y만원
    const eok = Math.floor(absAmount / 100000000);
    const man = Math.floor((absAmount % 100000000) / 10000);

    if (man === 0) {
      return `${sign}${formatNum(eok)}억원`;
    }
    return `${sign}${formatNum(eok)}억 ${formatNum(man)}만원`;
  } else {
    // 1조원 이상: x조 y억 z만원
    const jo = Math.floor(absAmount / 1000000000000);
    const eok = Math.floor((absAmount % 1000000000000) / 100000000);
    const man = Math.floor((absAmount % 100000000) / 10000);

    let result = `${sign}${formatNum(jo)}조`;
    if (eok > 0) {
      result += ` ${formatNum(eok)}억`;
    }
    if (man > 0) {
      result += ` ${formatNum(man)}만`;
    }
    return result + "원";
  }
}

/**
 * 숫자를 SNS 스타일로 포맷팅 (Instagram/Thread 완벽 재현)
 * @param num - 포맷할 숫자
 * @param options - 포맷팅 옵션
 * @param options.locale - 로케일 문자열 (기본값: "ko")
 * @returns 포맷된 숫자 문자열 (예: "1K", "1M", "1B")
 * @example
 * // 한국어 (기본값)
 * formatSocialNumber(999)        // "999"
 * formatSocialNumber(1000)       // "1천"
 * formatSocialNumber(1234)       // "1.2천"
 * formatSocialNumber(10000)      // "1만"
 * formatSocialNumber(12345)      // "1.2만"
 * formatSocialNumber(100000000)  // "1억"
 *
 * // 영어
 * formatSocialNumber(1000, { locale: "en" })       // "1K"
 * formatSocialNumber(1234, { locale: "en" })       // "1.2K"
 * formatSocialNumber(1000000, { locale: "en" })    // "1M"
 * formatSocialNumber(1000000000, { locale: "en" }) // "1B"
 */
export const formatSocialNumber = (num: number, options?: { locale?: "ko" | "en" }): string => {
  const locale = options?.locale ?? "ko";

  if (num < 0) {
    return `-${formatSocialNumber(Math.abs(num), options)}`;
  }

  if (locale === "en") {
    // 영어 스타일 (K, M, B)
    if (num >= 1000000000) {
      const value = num / 1000000000;
      return `${value.toFixed(1).replace(/\.0$/, "")}B`;
    }
    if (num >= 1000000) {
      const value = num / 1000000;
      return `${value.toFixed(1).replace(/\.0$/, "")}M`;
    }
    if (num >= 1000) {
      const value = num / 1000;
      return `${value.toFixed(1).replace(/\.0$/, "")}K`;
    }
    return num.toString();
  }

  // 한국어 스타일 (천, 만, 억)
  if (num >= 100000000) {
    const value = num / 100000000;
    return `${value.toFixed(1).replace(/\.0$/, "")}억`;
  }

  if (num >= 10000) {
    const value = num / 10000;
    return `${value.toFixed(1).replace(/\.0$/, "")}만`;
  }

  if (num >= 1000) {
    const value = num / 1000;
    return `${value.toFixed(1).replace(/\.0$/, "")}천`;
  }

  return num.toString();
};

/**
 * 숫자를 퍼센트 형식으로 변환합니다.
 * @param value - 변환할 숫자 (0-1 사이의 값 또는 0-100 사이의 값)
 * @param decimals - 소수점 자릿수 (기본값: 0)
 * @param isDecimal - value가 0-1 사이의 소수인지 여부 (기본값: true)
 * @returns 퍼센트 형식의 문자열
 * @example
 * formatPercent(0.5) // "50%"
 * formatPercent(0.123, 1) // "12.3%"
 * formatPercent(50, 0, false) // "50%"
 */
export function formatPercent(value: number, decimals = 0, isDecimal = true): string {
  const percentValue = isDecimal ? value * 100 : value;
  return `${percentValue.toFixed(decimals)}%`;
}

/**
 * 전화번호를 하이픈이 포함된 형식으로 포맷팅합니다.
 * 지역번호(02)와 휴대폰 번호를 자동으로 구분하여 처리합니다.
 * @param phone - 포맷할 전화번호 문자열
 * @returns 하이픈이 포함된 전화번호 문자열
 * @example
 * formatPhoneNumber("021234567") // "02-123-4567"
 * formatPhoneNumber("01012345678") // "010-1234-5678"
 * formatPhoneNumber("0212345678") // "02-1234-5678"
 */
export const formatPhoneNumber = (phone: string): string => {
  if (!phone || typeof phone !== "string") {
    return "";
  }

  const phoneNumber = phone.replace(/[^0-9]/g, "");
  if (!phoneNumber) {
    return "";
  }

  const { length } = phoneNumber;

  // 서울 지역번호 (02) 처리
  if (phoneNumber.startsWith("02")) {
    if (length === 9) {
      // 02-123-4567 (9자리)
      return phoneNumber.replace(/(\d{2})(\d{3})(\d{4})/, "$1-$2-$3");
    } else if (length === 10) {
      // 02-1234-5678 (10자리)
      return phoneNumber.replace(/(\d{2})(\d{4})(\d{4})/, "$1-$2-$3");
    } else if (length >= 3 && length <= 6) {
      return phoneNumber.replace(/(\d{2})(\d)/, "$1-$2");
    } else if (length > 6 && length < 9) {
      return phoneNumber.replace(/(\d{2})(\d{3})(\d)/, "$1-$2-$3");
    }
  }

  // 휴대폰 번호 (010, 011, 016, 017, 018, 019) - 11자리
  if (length === 11 && phoneNumber.startsWith("01")) {
    return phoneNumber.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
  }

  // 일반 전화번호 (지역번호 3자리) - 10자리
  if (length === 10) {
    return phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
  }

  // 부분 입력 처리
  if (length >= 3 && length <= 6) {
    return phoneNumber.replace(/(\d{3})(\d)/, "$1-$2");
  }

  if (length > 6 && length < 10) {
    return phoneNumber.replace(/(\d{3})(\d{3})(\d)/, "$1-$2-$3");
  }

  if (length >= 11) {
    return phoneNumber.slice(0, 11).replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
  }

  return phoneNumber;
};

/**
 * 사업자 등록번호를 하이픈이 포함된 형식으로 포맷팅합니다.
 * @param businessNumber - 포맷할 사업자 등록번호 문자열
 * @returns 하이픈이 포함된 사업자 등록번호 문자열
 * @example
 * formatBusinessNumber("1234567890") // "123-45-67890"
 * formatBusinessNumber("123456") // "123-45-6"
 * formatBusinessNumber("123") // "123"
 */
export function formatBusinessNumber(businessNumber: string): string {
  const cleanedStr = businessNumber.replace(/[^0-9]/g, "");

  if (cleanedStr.length <= 3) {
    return cleanedStr;
  }

  if (cleanedStr.length <= 5) {
    return `${cleanedStr.slice(0, 3)}-${cleanedStr.slice(3)}`;
  }

  return `${cleanedStr.slice(0, 3)}-${cleanedStr.slice(3, 5)}-${cleanedStr.slice(5, 10)}`;
}
