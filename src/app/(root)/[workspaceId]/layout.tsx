import { BaseRootLayout, GlobalFooter, GlobalSideNav } from "@components/layout";

import WorkspaceGuard from "./_components/WorkspaceGuard";

type WorkspaceLayoutProps = {
  children: React.ReactNode;
};

// 워크스페이스별 공통 껍데기 — 사이드바의 집. 헤더는 각 페이지가 PageHeader로 렌더
export default function WorkspaceLayout({ children }: WorkspaceLayoutProps) {
  return (
    <WorkspaceGuard>
      <main className="flex h-full w-full justify-center">
        <BaseRootLayout sideNav={<GlobalSideNav />} content={children} footer={<GlobalFooter />} />
      </main>
    </WorkspaceGuard>
  );
}
