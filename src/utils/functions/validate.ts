import REG_EXPRESSION from "../reg-expression";

/**
 * 문자열 입력 검증 헬퍼 함수
 * @param value - 검증할 값
 * @returns 유효한 문자열이면 true, 아니면 false
 */
const validateString = (value: unknown): value is string => {
  return typeof value === "string" && value.length > 0;
};

/**
 * 정규식으로 문자열 검증하는 헬퍼 함수
 * @param value - 검증할 값
 * @param regex - 검증할 정규식
 * @returns 정규식에 매치되면 true, 아니면 false
 */
const testRegex = (value: unknown, regex: RegExp): boolean => {
  if (!validateString(value)) {
    return false;
  }
  return regex.test(value);
};

/**
 * 문자열에 영문자가 포함되어 있는지 확인
 * @param value - 확인할 문자열
 * @returns 영문자가 포함되어 있으면 true, 없으면 false
 * @example
 * hasEnglish("Hello123") // true
 * hasEnglish("123") // false
 */
export const hasEnglish = (value: string): boolean => {
  if (!validateString(value)) {
    return false;
  }
  const rgx = /[a-zA-Z]/;
  return rgx.test(value);
};

/**
 * 문자열에 한글이 포함되어 있는지 확인
 * @param value - 확인할 문자열
 * @returns 한글이 포함되어 있으면 true, 없으면 false
 * @example
 * hasKorean("안녕123") // true
 * hasKorean("hello123") // false
 */
export function hasKorean(value: string): boolean {
  if (!validateString(value)) {
    return false;
  }
  const koreanPattern = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
  return koreanPattern.test(value);
}

/**
 * 문자열에 숫자가 포함되어 있는지 확인
 * @param value - 확인할 문자열
 * @returns 숫자가 포함되어 있으면 true, 없으면 false
 * @example
 * hasNumber("abc123") // true
 * hasNumber("abc") // false
 */
export const hasNumber = (value: string): boolean => {
  if (!validateString(value)) {
    return false;
  }
  const rgx = /[0-9]/;
  return rgx.test(value);
};

/**
 * 문자열에 특수문자가 포함되어 있는지 확인
 * @param value - 확인할 문자열
 * @returns 특수문자가 포함되어 있으면 true, 없으면 false
 * @example
 * hasSpecial("abc!@#") // true
 * hasSpecial("abc123") // false
 */
export const hasSpecial = (value: string): boolean => {
  if (!validateString(value)) {
    return false;
  }
  const rgx = /[~!@#$%^&*()_+|<>?:{}]/;
  return rgx.test(value);
};

/**
 * 문자열에 이모지가 포함되어 있는지 확인
 * @param str - 확인할 문자열
 * @returns 이모지가 포함되어 있으면 true, 없으면 false
 * @example
 * hasEmoji("Hello 😊") // true
 * hasEmoji("Hello") // false
 */
export const hasEmoji = (str: string): boolean => {
  if (!validateString(str)) {
    return false;
  }
  // REG_EXPRESSION.EMOJI는 이모지가 없는 경우에만 매치되므로, test 결과를 반전
  return !REG_EXPRESSION.EMOJI.test(str);
};

/**
 * 이메일 형식이 유효한지 검증
 * @param email - 확인할 이메일 문자열
 * @returns 유효한 이메일이면 true, 아니면 false
 * @example
 * isEmail("test@example.com") // true
 * isEmail("invalid-email") // false
 */
export const isEmail = (email: string): boolean => {
  return testRegex(email, REG_EXPRESSION.EMAIL);
};

/**
 * URL 형식이 유효한지 검증
 * @param value - 확인할 URL 문자열
 * @returns 유효한 URL이면 true, 아니면 false
 * @example
 * isUrl("https://www.example.com") // true
 * isUrl("http://example.com") // true
 * isUrl("example.com") // true
 * isUrl("invalid-url") // false
 */
export const isUrl = (value: string): boolean => {
  if (!validateString(value)) {
    return false;
  }

  try {
    // URL 생성자로 검증 (더 정확함)
    new URL(value);
    return true;
  } catch {
    // 상대 URL도 허용
    const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/i;
    return urlPattern.test(value);
  }
};

/**
 * 전화번호 형식이 유효한지 검증 (하이픈 포함/미포함 모두 가능)
 * @param phone - 확인할 전화번호 문자열
 * @returns 유효한 전화번호이면 true, 아니면 false
 * @example
 * isPhoneNumber("010-1234-5678") // true
 * isPhoneNumber("01012345678") // true
 * isPhoneNumber("123-456") // false
 */
export const isPhoneNumber = (phone: string): boolean => {
  if (!validateString(phone)) {
    return false;
  }
  const numberOnly = phone.replace(/-/g, "");
  return REG_EXPRESSION.PHONE_NUMBER_ONLY.test(numberOnly);
};

/**
 * 사업자등록번호 형식이 유효한지 검증 (하이픈 포함/미포함 모두 가능)
 * @param number - 확인할 사업자등록번호 문자열
 * @returns 유효한 사업자등록번호이면 true, 아니면 false
 * @example
 * isBusinessNumber("123-45-67890") // true
 * isBusinessNumber("1234567890") // true
 * isBusinessNumber("12-3456789") // false
 */
export const isBusinessNumber = (number: string): boolean => {
  if (!validateString(number)) {
    return false;
  }
  const numberOnly = number.replace(/-/g, "");
  return REG_EXPRESSION.BUSINESS_NUMBER.test(numberOnly);
};

/**
 * 값이 비어있는지 확인 (null, undefined, 빈 배열, 빈 객체 포함)
 * @param val - 확인할 값
 * @returns 비어있으면 true, 아니면 false
 * @example
 * isEmpty(null) // true
 * isEmpty([]) // true
 * isEmpty({}) // true
 * isEmpty("") // true
 * isEmpty("hello") // false
 * isEmpty([1, 2, 3]) // false
 */
export const isEmpty = (val: unknown): boolean => {
  if (val == null) {
    return true;
  }
  if (typeof val === "string") {
    return val.length === 0;
  }
  if (Array.isArray(val)) {
    return val.length === 0;
  }
  if (typeof val === "object") {
    return Object.keys(val).length === 0;
  }
  return false;
};

/**
 * 비밀번호 유효성 검사를 위한 정규식 생성기
 * @param rules - 비밀번호 규칙 설정 객체
 * @example
 * const passwordValidator = createPasswordValidator({
 *   minLength: 8,
 *   maxLength: 20,
 *   requireNumbers: true,
 *   requireLowercase: true,
 *   requireUppercase: true,
 *   requireSpecialChars: true
 * });
 *
 * passwordValidator.test("Password123!") // true
 * passwordValidator.test("weakpwd") // false
 */
export const createPasswordValidator = (rules: {
  minLength?: number;
  maxLength?: number;
  requireNumbers?: boolean;
  requireLowercase?: boolean;
  requireUppercase?: boolean;
  requireSpecialChars?: boolean;
  allowedSpecialChars?: string;
}) => {
  const {
    minLength = 8,
    maxLength = 20,
    requireNumbers = true,
    requireLowercase = true,
    requireUppercase = true,
    requireSpecialChars = true,
    allowedSpecialChars = "!@#$%^&*()_+{}[]:;<>,.?~\\-",
  } = rules;

  const conditions: string[] = [];

  if (requireNumbers) {
    conditions.push("(?=.*[0-9])");
  }
  if (requireLowercase) {
    conditions.push("(?=.*[a-z])");
  }
  if (requireUppercase) {
    conditions.push("(?=.*[A-Z])");
  }
  if (requireSpecialChars) {
    conditions.push(`(?=.*[${allowedSpecialChars}])`);
  }

  const lengthCondition = `{${minLength},${maxLength === Infinity ? "" : maxLength}}`;

  return new RegExp(`^${conditions.join("")}[A-Za-z0-9${allowedSpecialChars}]${lengthCondition}$`);
};

/**
 * 비밀번호 형식이 유효한지 검증 (기본 규칙: 숫자, 영문자 포함 8자 이상)
 * @param password - 확인할 비밀번호 문자열
 * @returns 유효한 비밀번호이면 true, 아니면 false
 * @example
 * isPassword("Password123") // true
 * isPassword("weakpwd") // false
 */
export const isPassword = (password: string): boolean => {
  return testRegex(password, REG_EXPRESSION.PASSWORD);
};

/**
 * 강력한 비밀번호 형식이 유효한지 검증 (숫자, 영문 대소문자, 특수문자 모두 포함 8자 이상)
 * @param password - 확인할 비밀번호 문자열
 * @returns 유효한 강력한 비밀번호이면 true, 아니면 false
 * @example
 * isPasswordStrong("Password123!") // true
 * isPasswordStrong("password123") // false (대문자 없음)
 */
export const isPasswordStrong = (password: string): boolean => {
  return testRegex(password, REG_EXPRESSION.PASSWORD_STRONG);
};

/**
 * 주민등록번호 형식이 유효한지 검증 (하이픈 포함/미포함 모두 가능)
 * @param number - 확인할 주민등록번호 문자열
 * @returns 유효한 주민등록번호이면 true, 아니면 false
 * @example
 * isResidentNumber("123456-1234567") // true
 * isResidentNumber("1234561234567") // true
 */
export const isResidentNumber = (number: string): boolean => {
  return testRegex(number, REG_EXPRESSION.RESIDENT_NUMBER);
};

/**
 * 카드번호 형식이 유효한지 검증 (하이픈 포함/미포함 모두 가능)
 * @param number - 확인할 카드번호 문자열
 * @returns 유효한 카드번호이면 true, 아니면 false
 * @example
 * isCardNumber("1234-5678-9012-3456") // true
 * isCardNumber("1234567890123456") // true
 */
export const isCardNumber = (number: string): boolean => {
  return testRegex(number, REG_EXPRESSION.CARD_NUMBER);
};

/**
 * 우편번호 형식이 유효한지 검증 (한국 우편번호 5자리)
 * @param code - 확인할 우편번호 문자열
 * @returns 유효한 우편번호이면 true, 아니면 false
 * @example
 * isPostalCode("12345") // true
 * isPostalCode("1234") // false
 */
export const isPostalCode = (code: string): boolean => {
  return testRegex(code, REG_EXPRESSION.POSTAL_CODE);
};

/**
 * 계좌번호 형식이 유효한지 검증 (10-14자리 숫자)
 * @param number - 확인할 계좌번호 문자열
 * @returns 유효한 계좌번호이면 true, 아니면 false
 * @example
 * isAccountNumber("1234567890") // true
 * isAccountNumber("123456789") // false
 */
export const isAccountNumber = (number: string): boolean => {
  return testRegex(number, REG_EXPRESSION.ACCOUNT_NUMBER);
};

/**
 * Base64 인코딩 문자열인지 확인
 * @param str - 확인할 문자열
 * @returns Base64 형식이면 true, 아니면 false
 * @example
 * isBase64("SGVsbG8gV29ybGQ=") // true
 * isBase64("Hello World") // false
 */
export const isBase64 = (str: string): boolean => {
  return testRegex(str, REG_EXPRESSION.BASE64);
};

/**
 * Base64 이미지 데이터 URL인지 확인
 * @param str - 확인할 문자열
 * @returns Base64 이미지 형식이면 true, 아니면 false
 * @example
 * isBase64Image("data:image/png;base64,iVBORw0KG...") // true
 */
export const isBase64Image = (str: string): boolean => {
  return testRegex(str, REG_EXPRESSION.BASE64_IMAGE);
};

/**
 * UUID 형식이 유효한지 검증
 * @param uuid - 확인할 UUID 문자열
 * @returns 유효한 UUID이면 true, 아니면 false
 * @example
 * isUUID("550e8400-e29b-41d4-a716-446655440000") // true
 */
export const isUUID = (uuid: string): boolean => {
  return testRegex(uuid, REG_EXPRESSION.UUID);
};

/**
 * MAC 주소 형식이 유효한지 검증
 * @param mac - 확인할 MAC 주소 문자열
 * @returns 유효한 MAC 주소이면 true, 아니면 false
 * @example
 * isMacAddress("00:1B:44:11:3A:B7") // true
 * isMacAddress("00-1B-44-11-3A-B7") // true
 */
export const isMacAddress = (mac: string): boolean => {
  return testRegex(mac, REG_EXPRESSION.MAC_ADDRESS);
};

/**
 * 카드번호에서 공백과 하이픈 제거 헬퍼 함수
 * @param number - 카드번호 문자열
 * @returns 숫자만 남은 문자열
 */
const cleanCardNumber = (number: string): string => {
  return number.replace(/\s|-/g, "");
};

/**
 * Visa 카드번호인지 확인
 * @param number - 확인할 카드번호 문자열
 * @returns Visa 카드번호이면 true, 아니면 false
 * @example
 * isCreditCardVisa("4111111111111111") // true
 */
export const isCreditCardVisa = (number: string): boolean => {
  if (!validateString(number)) {
    return false;
  }
  return REG_EXPRESSION.CREDIT_CARD_VISA.test(cleanCardNumber(number));
};

/**
 * Mastercard 카드번호인지 확인
 * @param number - 확인할 카드번호 문자열
 * @returns Mastercard 카드번호이면 true, 아니면 false
 * @example
 * isCreditCardMastercard("5555555555554444") // true
 */
export const isCreditCardMastercard = (number: string): boolean => {
  if (!validateString(number)) {
    return false;
  }
  return REG_EXPRESSION.CREDIT_CARD_MASTERCARD.test(cleanCardNumber(number));
};

/**
 * American Express 카드번호인지 확인
 * @param number - 확인할 카드번호 문자열
 * @returns American Express 카드번호이면 true, 아니면 false
 * @example
 * isCreditCardAmex("378282246310005") // true
 */
export const isCreditCardAmex = (number: string): boolean => {
  if (!validateString(number)) {
    return false;
  }
  return REG_EXPRESSION.CREDIT_CARD_AMEX.test(cleanCardNumber(number));
};

/**
 * 국가번호 포함 전화번호 형식이 유효한지 검증
 * @param phone - 확인할 전화번호 문자열
 * @returns 유효한 전화번호이면 true, 아니면 false
 * @example
 * isPhoneWithCountry("+82-10-1234-5678") // true
 * isPhoneWithCountry("+821012345678") // true
 */
export const isPhoneWithCountry = (phone: string): boolean => {
  return testRegex(phone, REG_EXPRESSION.PHONE_WITH_COUNTRY);
};

/**
 * 유선 전화번호 형식이 유효한지 검증 (하이픈 포함/미포함 모두 가능)
 * @param phone - 확인할 전화번호 문자열
 * @returns 유효한 유선 전화번호이면 true, 아니면 false
 * @example
 * isLandlinePhone("02-123-4567") // true
 * isLandlinePhone("021234567") // true
 */
export const isLandlinePhone = (phone: string): boolean => {
  return testRegex(phone, REG_EXPRESSION.유선전화번호);
};

/**
 * 대표 전화번호 형식이 유효한지 검증 (하이픈 포함/미포함 모두 가능)
 * @param phone - 확인할 전화번호 문자열
 * @returns 유효한 대표 전화번호이면 true, 아니면 false
 * @example
 * isRepresentativePhone("1588-1234") // true
 * isRepresentativePhone("15881234") // true
 */
export const isRepresentativePhone = (phone: string): boolean => {
  return testRegex(phone, REG_EXPRESSION.대표전화번호);
};

/**
 * 유선 전화 또는 휴대폰 번호 형식이 유효한지 검증 (하이픈 포함/미포함 모두 가능)
 * @param phone - 확인할 전화번호 문자열
 * @returns 유효한 전화번호이면 true, 아니면 false
 * @example
 * isPhoneOrLandline("010-1234-5678") // true
 * isPhoneOrLandline("02-123-4567") // true
 */
export const isPhoneOrLandline = (phone: string): boolean => {
  return testRegex(phone, REG_EXPRESSION.유선전화_휴대폰번호);
};

/**
 * 영어와 숫자만 포함하는지 확인
 * @param value - 확인할 문자열
 * @returns 영어와 숫자만 포함하면 true, 아니면 false
 * @example
 * isOnlyAlphabetNumber("abc123") // true
 * isOnlyAlphabetNumber("abc-123") // false
 */
export const isOnlyAlphabetNumber = (value: string): boolean => {
  return testRegex(value, REG_EXPRESSION.ONLY_ALPHABET_NUMBER);
};

/**
 * 한글만 포함하는지 확인
 * @param value - 확인할 문자열
 * @returns 한글만 포함하면 true, 아니면 false
 * @example
 * isOnlyKor("안녕하세요") // true
 * isOnlyKor("안녕123") // false
 */
export const isOnlyKor = (value: string): boolean => {
  return testRegex(value, REG_EXPRESSION.ONLY_KOR);
};

/**
 * 한글이 없는지 확인
 * @param value - 확인할 문자열
 * @returns 한글이 없으면 true, 있으면 false
 * @example
 * isNoKor("Hello123") // true
 * isNoKor("안녕하세요") // false
 */
export const isNoKor = (value: string): boolean => {
  return testRegex(value, REG_EXPRESSION.NO_KOR);
};

/**
 * 영어만 포함하는지 확인
 * @param value - 확인할 문자열
 * @returns 영어만 포함하면 true, 아니면 false
 * @example
 * isOnlyEnglish("Hello") // true
 * isOnlyEnglish("Hello123") // false
 */
export const isOnlyEnglish = (value: string): boolean => {
  return testRegex(value, REG_EXPRESSION.ONLY_ENGLISH);
};

/**
 * 숫자만 포함하는지 확인
 * @param value - 확인할 문자열
 * @returns 숫자만 포함하면 true, 아니면 false
 * @example
 * isOnlyNumber("123456") // true
 * isOnlyNumber("123abc") // false
 */
export const isOnlyNumber = (value: string): boolean => {
  return testRegex(value, REG_EXPRESSION.ONLY_NUMBER);
};

/**
 * 숫자가 없는지 확인
 * @param value - 확인할 문자열
 * @returns 숫자가 없으면 true, 있으면 false
 * @example
 * isNoNumber("Hello") // true
 * isNoNumber("Hello123") // false
 */
export const isNoNumber = (value: string): boolean => {
  return testRegex(value, REG_EXPRESSION.NO_NUMBER);
};

/**
 * 공백이 없는지 확인
 * @param value - 확인할 문자열
 * @returns 공백이 없으면 true, 있으면 false
 * @example
 * isNoWhiteSpace("HelloWorld") // true
 * isNoWhiteSpace("Hello World") // false
 */
export const isNoWhiteSpace = (value: string): boolean => {
  return testRegex(value, REG_EXPRESSION.NO_WHITE_SPACE);
};

/**
 * URL 형식이 유효한지 검증 (HTTP/HTTPS 필수)
 * @param url - 확인할 URL 문자열
 * @returns 유효한 URL이면 true, 아니면 false
 * @example
 * isUrlStrict("https://www.example.com") // true
 * isUrlStrict("example.com") // false
 */
export const isUrlStrict = (url: string): boolean => {
  return testRegex(url, REG_EXPRESSION.URL);
};
