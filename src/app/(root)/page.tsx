import { redirect } from "next/navigation";

// TODO(Phase 3): GET /api/brands/current 의 last_brand_id 로 대체
const FALLBACK_WORKSPACE_ID = "ws-1";

// "/" 진입 → 기본(마지막) 워크스페이스 대시보드로 리다이렉트
export default function RootPage() {
  redirect(`/${FALLBACK_WORKSPACE_ID}/dashboard`);
}
