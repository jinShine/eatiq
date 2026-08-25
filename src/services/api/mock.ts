/**
 * 목 모드 스위치.
 *
 * 백엔드 서버가 없는 동안(2026-08-24 확인) API 호출 대신 목 데이터를 돌려주어
 * UI 작업을 이어가기 위한 장치다. `NEXT_PUBLIC_USE_MOCK=true`일 때만 동작한다.
 *
 * 새 백엔드 URL을 받으면 .env에서 플래그를 끄면 즉시 실제 API로 돌아간다.
 * (API·타입 파일은 손대지 않았으므로 코드 복구가 필요 없다)
 */
export const IS_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

/** 네트워크 지연을 흉내 내 스켈레톤·로딩 UI를 실제처럼 확인할 수 있게 한다 */
const MOCK_DELAY_MS = 300;

/**
 * 실제 API처럼 **매번 새 객체**를 돌려준다.
 * 같은 참조를 반환하면 React Query가 "데이터 변경 없음"으로 보고 리렌더하지 않아,
 * 저장 후 폼의 `values`가 갱신되지 않고 dirty가 풀리지 않는다.
 */
export const mockResolve = <T>(data: T): Promise<T> =>
  new Promise(resolve => setTimeout(() => resolve(structuredClone(data)), MOCK_DELAY_MS));

/**
 * 목 모드에서 mutation을 "성공한 척" 처리한다.
 * 서버 저장은 일어나지 않으므로, 저장 버튼·Toast·dirty 해제 흐름만 확인용으로 동작한다.
 */
export const mockMutation = <TBody, TResult>(
  real: (body: TBody) => Promise<TResult>,
  /** 목 저장 시 목 데이터에 반영할 병합 처리. 저장 → refetch → dirty 해제 흐름을 실제와 맞춘다 */
  onMockSave?: (body: TBody) => void,
) =>
  IS_MOCK
    ? (((body: TBody) => {
        onMockSave?.(body);
        return mockResolve({} as TResult);
      }) as (body: TBody) => Promise<TResult>)
    : real;
