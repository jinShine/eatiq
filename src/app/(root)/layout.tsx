import { type Metadata } from "next";

import { configureSEOMetadata } from "@configs/seo/config";

const PAGE_TITLE = "";

type RootLayoutProps = {
  children: React.ReactNode;
};

export const metadata: Metadata = configureSEOMetadata({ title: PAGE_TITLE });

// 인증 영역 껍데기 — 사이드바는 [workspaceId]/layout 으로 이사
// TODO: 클라이언트 인증 가드 추가 (토큰 없으면 /auth/sign-in) — 토큰이 localStorage라 middleware 불가
export default function RootLayout({ children }: RootLayoutProps) {
  return <>{children}</>;
}
