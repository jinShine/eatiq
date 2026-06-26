/**
 * 문자열을 지정된 길이로 자르고 말줄임표를 추가하는 함수
 * @param text - 대상 문자열
 * @param maxLength - 최대 길이
 * @param suffix - 말줄임표 문자열 (기본값: "...")
 * @returns 잘린 문자열 또는 원본 문자열
 * @example
 * truncateText('Hello World', 5) // 'Hello...'
 * truncateText('Hi', 5) // 'Hi'
 * truncateText('Hello World', 5, '..') // 'Hel..'
 */
export function truncateText(text: string, maxLength: number, suffix: string = "..."): string {
  if (!text || typeof text !== "string") {
    return "";
  }
  if (maxLength <= 0) {
    return suffix;
  }
  return text.length > maxLength ? `${text.slice(0, maxLength)}${suffix}` : text;
}

/**
 * 이메일 주소를 마스킹하는 함수
 * @param email - 마스킹할 이메일 주소
 * @returns 마스킹된 이메일 주소
 * @example
 * maskEmail('test@example.com') // 't**t@example.com'
 * maskEmail('john.doe@email.com') // 'j*****e@email.com'
 * maskEmail('a@example.com') // 'a@example.com'
 */
export function maskEmail(email: string): string {
  if (!email || typeof email !== "string") {
    return "";
  }

  const parts = email.split("@");
  if (parts.length !== 2) {
    return email;
  } // 유효하지 않은 이메일 형식

  const [name, domain] = parts;

  // 이름이 1자 이하면 마스킹하지 않음
  if (name.length <= 1) {
    return email;
  }

  // 이름이 2자면 첫 글자만 표시
  if (name.length === 2) {
    return `${name.charAt(0)}*@${domain}`;
  }

  const maskedName = `${name.charAt(0)}${"*".repeat(name.length - 2)}${name.charAt(name.length - 1)}`;
  return `${maskedName}@${domain}`;
}

/**
 * 전화번호를 마스킹하는 함수
 * @param phoneNumber - 마스킹할 전화번호
 * @returns 마스킹된 전화번호 문자열, 입력이 없으면 빈 문자열
 * @example
 * maskPhoneNumber('010-1234-5678') // '010-****-5678'
 * maskPhoneNumber('01012345678') // '010****5678'
 * maskPhoneNumber('02-1234-5678') // '02-****-5678'
 */
export const maskPhoneNumber = (phoneNumber?: string): string => {
  if (!phoneNumber || typeof phoneNumber !== "string") {
    return "";
  }

  if (isHyphenSeparated(phoneNumber)) {
    return phoneNumber.replace(/^(\d{2,3})-(\d{3,4})-(\d{4})$/, (_, p1, p2, p3) => `${p1}-${maskAll(p2)}-${p3}`);
  }

  const match = phoneNumber.match(/^(\d{2,3})(\d{3,4})(\d{4})/);
  if (match) {
    return `${match[1]}${maskAll(match[2])}${match[3]}`;
  }

  return phoneNumber;
};

/**
 * 특수문자를 제거하는 함수 (한글은 유지)
 * @param str - 대상 문자열
 * @returns 특수문자가 제거된 문자열
 * @example
 * removeSpecialChar('Hello@World!') // 'HelloWorld'
 * removeSpecialChar('123-456-789') // '123456789'
 * removeSpecialChar('안녕@하세요!') // '안녕하세요'
 */
export function removeSpecialChar(str: string): string {
  if (!str || typeof str !== "string") {
    return "";
  }
  // 한글, 영문, 숫자, 공백만 유지
  return str.replace(/[^가-힣ㄱ-ㅎㅏ-ㅣa-zA-Z0-9 ]/g, "");
}

/**
 * 문자열에서 특정 문자를 제거하는 함수
 * @param str 대상 문자열
 * @param target 제거할 문자
 * @returns 특정 문자가 제거된 문자열
 * @example
 * removeChar('hello-world', '-') // 'helloworld'
 * removeChar('hello_world', '_') // 'helloworld'
 * removeChar(undefined, '-') // ''
 */
export function removeChar(str: string | undefined, target: string): string {
  if (!str || typeof str !== "string") {
    return "";
  }
  if (!target || typeof target !== "string") {
    return str;
  }
  return str.replaceAll(target, "");
}

/** Helpers */

const isHyphenSeparated = (phoneNumber: string) => {
  return /^\d{2,3}-\d{3,4}-\d{4}$/.test(phoneNumber);
};

const maskAll = (str: string) => {
  return str.replace(/./g, "*");
};
