import { SpinLoader } from "@components/ui";

/**
 * 최상위 로딩 — 아직 어떤 화면으로 갈지 모르는 구간(인증 판정 전)에서만 보인다.
 *
 * 목적지를 모르니 스켈레톤을 그려봐야 도착한 화면과 어긋난다.
 * 여기서는 레이아웃을 흉내 내지 않고 조용히 비워두는 편이 덜 튄다.
 */
export default function Loading() {
  return (
    <div role="status" aria-label="불러오는 중" className="flex min-h-[100dvh] items-center justify-center">
      <SpinLoader className="text-text-disabled" />
    </div>
  );
}
