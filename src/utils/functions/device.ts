/**
 * 현재 기기가 모바일 디바이스인지 확인하는 유틸리티 함수
 * @returns {boolean} 모바일 디바이스일 경우 true, 아닐 경우 false
 */
export function isMobile(): boolean {
  if (typeof navigator === "undefined") {
    return false;
  }
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
 * 현재 브라우저 정보를 반환하는 유틸리티 함수
 * @returns {{ browser: string, version: string }} 브라우저 이름과 버전 정보
 * @example
 * const { browser, version } = getBrowserInfo();
 *    => { browser: "Chrome", version: "120" }
 */
export function getBrowserInfo(): { browser: string; version: string } {
  if (typeof navigator === "undefined") {
    return { browser: "Unknown", version: "Unknown" };
  }

  const ua = navigator.userAgent;
  let browser = "Unknown";
  let version = "Unknown";

  // Edge (Chrome 기반이므로 먼저 체크)
  if (ua.indexOf("Edg") > -1) {
    const match = ua.match(/Edg\/(\d+)/);
    browser = "Edge";
    version = match ? match[1] : "Unknown";
  }
  // Opera
  else if (ua.indexOf("OPR") > -1 || ua.indexOf("Opera") > -1) {
    const match = ua.match(/(?:OPR|Opera)\/(\d+)/);
    browser = "Opera";
    version = match ? match[1] : "Unknown";
  }
  // Chrome (Safari와 Edge를 제외)
  else if (ua.indexOf("Chrome") > -1 && ua.indexOf("Edg") === -1) {
    const match = ua.match(/Chrome\/(\d+)/);
    browser = "Chrome";
    version = match ? match[1] : "Unknown";
  }
  // Firefox
  else if (ua.indexOf("Firefox") > -1) {
    const match = ua.match(/Firefox\/(\d+)/);
    browser = "Firefox";
    version = match ? match[1] : "Unknown";
  }
  // Safari (Chrome이 아닌 경우)
  else if (ua.indexOf("Safari") > -1) {
    const match = ua.match(/Version\/(\d+)/);
    browser = "Safari";
    version = match ? match[1] : "Unknown";
  }

  return { browser, version };
}

/**
 * 현재 사용자의 디바이스 타입을 반환하는 유틸리티 함수
 * @returns {"tablet" | "mobile" | "desktop"} 디바이스 타입
 * @example
 * const deviceType = getDeviceType();
 *    => "mobile", "tablet", "desktop" 중 하나 반환
 */
export function getDeviceType(): "tablet" | "mobile" | "desktop" {
  if (typeof navigator === "undefined") {
    return "desktop";
  }

  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return "tablet";
  }
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    return "mobile";
  }
  return "desktop";
}
