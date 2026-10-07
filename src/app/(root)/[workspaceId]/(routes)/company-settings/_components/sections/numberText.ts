/**
 * 저장된 숫자 → 입력칸 문자열.
 *
 * String()은 10^21 이상을 지수 표기("1e+38")로 바꾼다. 그러면 쉼표도 안 붙고 상한 대신
 * "정수를 입력해주세요"가 떠서, 지수 없이 펼친다(상한 이전에 저장된 큰 값 대비).
 */
export const toNumberText = (value?: number | null) =>
  value === null || value === undefined
    ? ""
    : value.toLocaleString("en-US", { useGrouping: false, maximumFractionDigits: 20 });
