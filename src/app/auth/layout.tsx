import { type Metadata } from "next";

import { BaseRootLayout } from "@components/layout";

import { configureSEOMetadata } from "@configs/seo/config";

const PAGE_TITLE = "";

type LayoutProps = {
  children: React.ReactNode;
};

export const metadata: Metadata = configureSEOMetadata({ title: PAGE_TITLE });

/**
 * 로그인·매직링크 검증 화면 — 초대 화면(InviteCard)과 같은 배치로 화면 가운데에 놓는다.
 * 각 화면이 안쪽 여백(p-6)을 가지고 있어 바깥은 세로 여백만 준다.
 */
export default function layout({ children }: LayoutProps) {
  return (
    <BaseRootLayout
      content={
        <div className="flex min-h-[100dvh] items-center justify-center py-16">
          <div className="w-full max-w-[420px]">{children}</div>
        </div>
      }
    />
  );
}
