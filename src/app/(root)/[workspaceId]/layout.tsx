import { BaseRootLayout, GlobalFooter, GlobalHeader, GlobalSideNav } from "@components/layout";

import WorkspaceGuard from "./_components/WorkspaceGuard";

type WorkspaceLayoutProps = {
  children: React.ReactNode;
};

// 워크스페이스별 공통 껍데기 — 사이드바의 집
// TODO(Phase 3): async 로 전환해 params.workspaceId 검증 후 GlobalSideNav에 전달
export default function WorkspaceLayout({ children }: WorkspaceLayoutProps) {
  return (
    <WorkspaceGuard>
      <main className="flex h-full w-full justify-center">
        <BaseRootLayout
          header={<GlobalHeader />}
          sideNav={<GlobalSideNav />}
          content={children}
          footer={<GlobalFooter />}
        />
      </main>
    </WorkspaceGuard>
  );
}
