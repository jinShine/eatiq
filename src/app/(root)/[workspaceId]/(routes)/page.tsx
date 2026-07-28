import { redirect } from "next/navigation";

type WorkspaceIndexPageProps = {
  params: Promise<{ workspaceId: string }>;
};

// 워크스페이스 루트(/{workspaceId})로 진입하면 대시보드로 보냄
export default async function WorkspaceIndexPage({ params }: WorkspaceIndexPageProps) {
  const { workspaceId } = await params;
  redirect(`/${workspaceId}/dashboard`);
}
