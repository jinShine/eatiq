import CompletionStatusCard from "../completion/CompletionStatusCard";

type BrandVisualTabProps = {
  workspaceId: string;
};

export default function BrandVisualTab({ workspaceId }: BrandVisualTabProps) {
  return (
    <div className="space-y-6">
      <CompletionStatusCard workspaceId={workspaceId} tab="visual" tabLabel="브랜드 비주얼" />
      <p className="text-text-tertiary text-sm">브랜드 비주얼 폼 (다음 단계)</p>
    </div>
  );
}
