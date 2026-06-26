import { useEffect, useState } from "react";

/**
 * 특정 키보드 키 입력을 감지하는 hook입니다.
 * 키보드 단축키, 접근성 기능 구현에 유용합니다.
 *
 * @param targetKey - 감지할 키 (예: "Enter", "Escape", "ArrowUp")
 * @param options - 옵션 객체
 * @param options.eventType - 이벤트 타입 ("keydown" | "keyup", 기본값: "keydown")
 * @returns 키가 눌렸는지 여부
 *
 * @example
 * ```tsx
 * const SearchInput = () => {
 *   const [searchTerm, setSearchTerm] = useState("");
 *   const enterPressed = useKeyPress("Enter");
 *   const escapePressed = useKeyPress("Escape");
 *
 *   useEffect(() => {
 *     if (enterPressed) {
 *       handleSearch(searchTerm);
 *     }
 *   }, [enterPressed, searchTerm]);
 *
 *   useEffect(() => {
 *     if (escapePressed) {
 *       setSearchTerm("");
 *     }
 *   }, [escapePressed]);
 *
 *   return (
 *     <input
 *       value={searchTerm}
 *       onChange={(e) => setSearchTerm(e.target.value)}
 *       placeholder="검색... (Enter: 검색, Esc: 초기화)"
 *     />
 *   );
 * };
 * ```
 */
export default function useKeyPress(targetKey: string, options: { eventType?: "keydown" | "keyup" } = {}): boolean {
  const { eventType = "keydown" } = options;
  const [keyPressed, setKeyPressed] = useState(false);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === targetKey) {
        setKeyPressed(true);
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === targetKey) {
        setKeyPressed(false);
      }
    };

    if (eventType === "keydown") {
      window.addEventListener("keydown", handleKeyPress);
      window.addEventListener("keyup", handleKeyUp);
    } else {
      window.addEventListener("keyup", handleKeyPress);
    }

    return () => {
      if (eventType === "keydown") {
        window.removeEventListener("keydown", handleKeyPress);
        window.removeEventListener("keyup", handleKeyUp);
      } else {
        window.removeEventListener("keyup", handleKeyPress);
      }
    };
  }, [targetKey, eventType]);

  return keyPressed;
}
