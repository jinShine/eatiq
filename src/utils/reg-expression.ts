const REG_EXPRESSION = {
  /** EMAIL: 숫자 또는 알파벳 문자로 시작, [하이픈, 밑줄, 점, 또는 문자와 숫]자의 조합, @, 최상위 도메인(TLD) */
  EMAIL: /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/,

  /** PASSWORD_STRONG: 숫자, 영문자(대소문자), 특수문자를 모두 포함하여 8글자 이상 (강력한 비밀번호) */
  PASSWORD_STRONG: /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}[\]:;<>,.?~\\-]).{8,}$/,

  /** PASSWORD: 기본 비밀번호 (숫자, 영문자 포함 8글자 이상) */
  PASSWORD: /^(?=.*[0-9])(?=.*[a-zA-Z]).{8,}$/,

  /** PHONE_NUMBER_ONLY: 휴대폰 번호 11자리 (010으로 시작) */
  PHONE_NUMBER_ONLY: /^01[0-9]{9}$/,

  /** PHONE: 휴대폰 번호 하이픈 포함 형식 (010-0000-0000) */
  PHONE: /^01[0-9]{1}-[0-9]{4}-[0-9]{4}$/,

  /** 유선전화번호: 지역번호 포함 유선 전화 번호 (하이픈 포함/미포함) */
  유선전화번호: /^(0[2-8][0-5]?)-?([1-9]{1}[0-9]{2,3})-?([0-9]{4})$/,

  /** 유선전화_휴대폰번호: 유선 전화 + 휴대폰 번호 (하이픈 포함/미포함) */
  유선전화_휴대폰번호: /^(0[2-8][0-5]?|01[01346-9])-?([1-9]{1}[0-9]{2,3})-?([0-9]{4})$/,

  /** 대표전화번호: 1588, 1544 등 대표 전화번호 (하이픈 포함/미포함) */
  대표전화번호: /^(1544|1566|1577|1588|1644|1688)-?([0-9]{4})$/,

  /** BUSINESS_NUMBER: 사업자등록번호 10자리 (하이픈 포함/미포함) */
  BUSINESS_NUMBER: /^([0-9]{3})-?([0-9]{2})-?([0-9]{5})$/,

  /** NO_WHITE_SPACE: 공백 불가 */
  NO_WHITE_SPACE: /^\S+$/,

  /** ONLY_ALPHABET_NUMBER: 영어와 숫자만 입력 (alnum) */
  ONLY_ALPHABET_NUMBER: /^[0-9a-zA-Z]+$/,

  /** ONLY_KOR: 한글만 입력 */
  ONLY_KOR: /^[ㄱ-힣]+$/,

  /** NO_KOR: 한국어 불가 */
  NO_KOR:
    /^[^\u3131-\uD79D\uAC00-\uD7A3\uFFA1-\uFFDC\u1100-\u11FF\u3130-\u318F\uAC00-\uD7AF\uFF00-\uFFEF\u2000-\u206F\u3000-\u303F]*$/,

  /** ONLY_ENGLISH: 영어만 입력 */
  ONLY_ENGLISH: /^[a-zA-Z]+$/,

  /** ONLY_NUMBER: 숫자만 입력 */
  ONLY_NUMBER: /^[0-9]+$/,

  /** NO_NUMBER: 숫자 불가 */
  NO_NUMBER: /^[^0-9]*$/,

  /** EMOJI: 이모지가 없는 문자열만 매칭 (hasEmoji 함수에서 반전하여 사용) */
  EMOJI:
    /^[^\uD800-\uDFFF\u2700-\u27BF\u2B50-\u2B55\u23E9-\u23FA\u23ED-\u23F3\u25AA-\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u26FF\u231A-\u231B\u23E9-\u23EC\u23F0\u23F3\u267F\u2693\u26A1\u26F5\u26FA\u26FD\u2705\u270A-\u270B\u2728\u274C\u274E\u2753-\u2755\u2757\u2795-\u2797\u27B0\u27BF]+$/g,

  /** URL: HTTP/HTTPS URL 형식 */
  URL: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/,

  /** RESIDENT_NUMBER: 주민등록번호 13자리 (하이픈 포함/미포함) */
  RESIDENT_NUMBER: /^([0-9]{2})(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])-?[1-4][0-9]{6}$/,

  /** CARD_NUMBER: 카드번호 16자리 (하이픈 포함/미포함) */
  CARD_NUMBER: /^[0-9]{4}-?[0-9]{4}-?[0-9]{4}-?[0-9]{4}$/,

  /** POSTAL_CODE: 한국 우편번호 5자리 */
  POSTAL_CODE: /^[0-9]{5}$/,

  /** ACCOUNT_NUMBER: 계좌번호 (숫자만, 10-14자리) */
  ACCOUNT_NUMBER: /^[0-9]{10,14}$/,

  /** BASE64: Base64 인코딩 문자열 */
  BASE64: /^[A-Za-z0-9+/]*={0,2}$/,

  /** BASE64_IMAGE: Base64 이미지 데이터 URL */
  BASE64_IMAGE: /^data:image\/(png|jpg|jpeg|gif|webp|svg\+xml);base64,[A-Za-z0-9+/=]+$/,

  /** UUID: UUID 형식 */
  UUID: /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,

  /** MAC_ADDRESS: MAC 주소 형식 */
  MAC_ADDRESS: /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/,

  /** CREDIT_CARD_VISA: Visa 카드번호 */
  CREDIT_CARD_VISA: /^4[0-9]{12}(?:[0-9]{3})?$/,

  /** CREDIT_CARD_MASTERCARD: Mastercard 카드번호 */
  CREDIT_CARD_MASTERCARD: /^5[1-5][0-9]{14}$/,

  /** CREDIT_CARD_AMEX: American Express 카드번호 */
  CREDIT_CARD_AMEX: /^3[47][0-9]{13}$/,

  /** PHONE_WITH_COUNTRY: 국가번호 포함 전화번호 (+82-10-1234-5678) */
  PHONE_WITH_COUNTRY: /^\+\d{1,3}-?\d{1,4}-?\d{1,4}-?\d{1,9}$/,
};

export default REG_EXPRESSION;
