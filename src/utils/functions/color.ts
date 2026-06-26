/**
 * HEX 컬러 코드를 RGB 값으로 변환합니다.
 * @param hex - '#' 포함 또는 미포함된 6자리 또는 3자리 HEX 컬러 코드 (예: '#ff0000', 'ff0000', '#f00', 'f00')
 * @returns RGB 객체 {r, g, b} 또는 잘못된 형식일 경우 null
 * @example
 * hexToRgb('#ff0000') // returns { r: 255, g: 0, b: 0 }
 * hexToRgb('#f00') // returns { r: 255, g: 0, b: 0 }
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  if (!hex || typeof hex !== "string") {
    return null;
  }

  // 3자리 HEX 코드 처리 (#f00 -> #ff0000)
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  const fullHex = hex.replace(shorthandRegex, (_, r, g, b) => r + r + g + g + b + b);

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * RGB 값을 HEX 컬러 코드로 변환합니다.
 * @param r - Red 값 (0-255)
 * @param g - Green 값 (0-255)
 * @param b - Blue 값 (0-255)
 * @returns '#'로 시작하는 6자리 HEX 컬러 코드
 * @example
 * rgbToHex(255, 0, 0) // returns '#ff0000'
 * rgbToHex(255, 255, 255) // returns '#ffffff'
 */
export function rgbToHex(r: number, g: number, b: number): string {
  // RGB 값 범위 제한 (0-255)
  const clamp = (value: number) => Math.max(0, Math.min(255, Math.round(value)));
  return `#${[clamp(r), clamp(g), clamp(b)].map(x => x.toString(16).padStart(2, "0")).join("")}`;
}
