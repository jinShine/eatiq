import { useEffect } from "react";

/** 칸이 그려지기를 기다리는 최대 시간 — 섹션 값은 데이터를 받은 뒤에 채워진다 */
const WAIT_LIMIT_MS = 3000;
const POLL_MS = 100;

/**
 * 다른 화면(대시보드)에서 「#섹션/필드」로 들어오면 그 섹션으로 스크롤하고 칸에 포커스한다.
 *
 * 섹션 id는 완성도 API의 section_key, 칸은 field_key(=폼 필드 이름)다 — 저니 패널의 「입력」과 같은 규칙.
 * 브라우저 기본 해시 스크롤은 섹션이 그려지기 전에 일어나 쓸 수 없어, 칸이 생길 때까지 잠깐 기다린다.
 * 칸을 못 찾으면(아직 연결 안 된 칸 등) 섹션까지만 스크롤한다.
 */
export function useJumpToHash() {
  useEffect(() => {
    const [sectionId, fieldKey] = decodeURIComponent(window.location.hash.slice(1)).split("/");
    if (!sectionId) {
      return;
    }

    const startedAt = Date.now();
    let timer: ReturnType<typeof setTimeout>;

    const tryJump = () => {
      const section = document.getElementById(sectionId);
      const field = fieldKey
        ? section?.querySelector<HTMLElement>(`[name="${fieldKey}"], [name$=".${fieldKey}"]`)
        : null;
      const isTimeUp = Date.now() - startedAt > WAIT_LIMIT_MS;

      if (section && (field || !fieldKey || isTimeUp)) {
        section.scrollIntoView({ block: "start" });
        field?.focus({ preventScroll: true });
        return;
      }
      if (!isTimeUp) {
        timer = setTimeout(tryJump, POLL_MS);
      }
    };

    tryJump();
    return () => clearTimeout(timer);
  }, []);
}
