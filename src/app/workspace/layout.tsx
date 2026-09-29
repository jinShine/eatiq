import { type Metadata } from "next";

import { BaseRootLayout } from "@components/layout";

import { configureSEOMetadata } from "@configs/seo/config";

const PAGE_TITLE = "";

type LayoutProps = {
  children: React.ReactNode;
};

export const metadata: Metadata = configureSEOMetadata({ title: PAGE_TITLE });

/**
 * (root) 바깥이다. 초대 링크로 들어오는 사람은 대개 아직 계정이 없어
 * AuthGuard가 감싸면 로그인 화면으로 튕긴다. 로그인 여부에 따라 안내가
 * 달라야 하므로 가드 밖에서 직접 판단한다.
 */
export default function WorkspaceLayout({ children }: LayoutProps) {
  return <BaseRootLayout content={children} />;
}
