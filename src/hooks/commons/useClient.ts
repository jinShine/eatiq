import { useEffect, useState } from "react";

/**
 * 클라이언트 사이드에서 실행 중인지 확인하는 hook입니다.
 * SSR(Server-Side Rendering) 환경에서 클라이언트 전용 코드를 실행하기 전에 확인할 때 사용합니다.
 *
 * @returns 클라이언트 사이드에서 실행 중인지 여부
 *
 * @example
 * ```tsx
 * const MyComponent = () => {
 *   const isClient = useClient();
 *
 *   if (!isClient) {
 *     return <div>로딩 중...</div>;
 *   }
 *
 *   // 클라이언트 전용 코드 (예: localStorage 접근)
 *   const data = localStorage.getItem("key");
 *
 *   return <div>{data}</div>;
 * };
 * ```
 */
export default function useClient() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
}
