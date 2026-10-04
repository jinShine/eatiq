import { useEffect } from "react";
import { type FieldValues, type UseFormWatch } from "react-hook-form";

/**
 * 폼 값이 하나라도 바뀌면 clear를 부른다. 섹션의 저장 실패 문구를 지우는 데 쓴다.
 *
 * mutation의 error는 다음 저장 전까지 남는다. 그대로 두면 사용자가 값을 고쳐도
 * 옛 서버 문구가 계속 보인다(값을 원래대로 되돌리면 저장 버튼까지 비활성화돼 지울 방법이 없다).
 *
 * watch(callback)은 구독이라 리렌더를 일으키지 않는다. register·Controller 필드 모두에서 불린다.
 */
export default function useClearOnFormChange<T extends FieldValues>(watch: UseFormWatch<T>, clear: () => void) {
  useEffect(() => {
    const subscription = watch(() => clear());
    return () => subscription.unsubscribe();
  }, [watch, clear]);
}
