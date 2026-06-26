/**
 * 요소를 지정된 위치로 스크롤합니다.
 * @param element - 스크롤할 요소
 * @param options - 스크롤 옵션
 * @example
 * scrollTo(document.getElementById('target'), { behavior: 'smooth', block: 'start' });
 */
export function scrollTo(element: HTMLElement, options: ScrollToOptions = {}): void {
  element.scrollIntoView({
    behavior: "smooth",
    block: "start",
    ...options,
  });
}

/**
 * 페이지를 맨 위로 스크롤합니다.
 * @param options - 스크롤 옵션
 * @example
 * scrollToTop({ behavior: 'smooth' });
 */
export function scrollToTop(options: ScrollToOptions = {}): void {
  if (typeof window === "undefined") {
    return;
  }
  window.scrollTo({
    top: 0,
    behavior: "smooth",
    ...options,
  });
}

/**
 * 페이지를 맨 아래로 스크롤합니다.
 * @param options - 스크롤 옵션
 * @example
 * scrollToBottom({ behavior: 'smooth' });
 */
export function scrollToBottom(options: ScrollToOptions = {}): void {
  if (typeof window === "undefined") {
    return;
  }
  window.scrollTo({
    top: document.documentElement.scrollHeight,
    behavior: "smooth",
    ...options,
  });
}

/**
 * 요소의 위치 정보를 가져옵니다.
 * @param element - 요소
 * @returns 요소의 위치 정보 (DOMRect)
 * @example
 * const rect = getElementPosition(document.getElementById('target'));
 * console.log(rect.top, rect.left);
 */
export function getElementPosition(element: HTMLElement): DOMRect {
  return element.getBoundingClientRect();
}

/**
 * 텍스트를 클립보드에 복사합니다.
 * @param text - 복사할 텍스트
 * @returns 복사 성공 여부
 * @example
 * await copyToClipboard("Hello World");
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (typeof navigator === "undefined" || !navigator.clipboard) {
    // Fallback for older browsers
    return fallbackCopyToClipboard(text);
  }

  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return fallbackCopyToClipboard(text);
  }
}

////////////////////////////////////////////////////
/** Helper function */

/**
 * 클립보드 복사 fallback (구형 브라우저용)
 */
function fallbackCopyToClipboard(text: string): boolean {
  if (typeof document === "undefined") {
    return false;
  }

  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed";
  textArea.style.left = "-999999px";
  textArea.style.top = "-999999px";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    const successful = document.execCommand("copy");
    document.body.removeChild(textArea);
    return successful;
  } catch {
    document.body.removeChild(textArea);
    return false;
  }
}
