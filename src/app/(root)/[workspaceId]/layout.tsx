import { BaseRootLayout, GlobalFooter, GlobalSideNav } from "@components/layout";

import WorkspaceGuard from "./_components/WorkspaceGuard";

type WorkspaceLayoutProps = {
  children: React.ReactNode;
};

// 워크스페이스별 공통 껍데기 — 사이드바의 집. 헤더는 각 페이지가 PageHeader로 렌더
//
// 가드는 껍데기 "안"에 둔다. 밖에 두면 멤버십을 확인하는 동안 사이드바까지 사라져
// 화면이 통째로 깜빡인다. 안에 두면 사이드바는 그대로 있고 콘텐츠 자리만 기다린다.
export default function WorkspaceLayout({ children }: WorkspaceLayoutProps) {
  return (
    <main className="flex h-full w-full justify-center">
      <BaseRootLayout
        sideNav={<GlobalSideNav />}
        content={<WorkspaceGuard>{children}</WorkspaceGuard>}
        footer={<GlobalFooter />}
      />
    </main>
  );
}
