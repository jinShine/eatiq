import { useCallback, useState } from "react";

/**
 * 클립보드에 텍스트를 복사하는 hook입니다.
 * 사용자 경험 개선에 유용합니다.
 *
 * @returns 클립보드 복사 함수와 상태를 포함한 객체
 * @returns returns.copy - 클립보드에 복사하는 함수
 * @returns returns.copied - 복사 성공 여부
 * @returns returns.error - 복사 실패 시 에러 객체
 *
 * @example
 * ```tsx
 * const ShareButton = () => {
 *   const { copy, copied, error } = useCopyToClipboard();
 *   const shareUrl = "https://example.com";
 *
 *   const handleCopy = () => {
 *     copy(shareUrl);
 *   };
 *
 *   return (
 *     <div>
 *       <button onClick={handleCopy}>
 *         {copied ? "복사됨!" : "링크 복사"}
 *       </button>
 *       {error && <p>복사 실패: {error.message}</p>}
 *     </div>
 *   );
 * };
 * ```
 */
export default function useCopyToClipboard() {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const copy = useCallback(async (text: string) => {
    if (!navigator?.clipboard) {
      setError(new Error("Clipboard API를 사용할 수 없습니다"));
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setError(null);

      // 2초 후 복사 상태 초기화
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("복사 실패"));
      setCopied(false);
    }
  }, []);

  return { copy, copied, error };
}
