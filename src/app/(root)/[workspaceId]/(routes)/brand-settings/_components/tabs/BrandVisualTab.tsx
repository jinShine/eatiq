import CompletionStatusCard from "../completion/CompletionStatusCard";

type BrandVisualTabProps = {
  workspaceId: string;
};

export default function BrandVisualTab({ workspaceId }: BrandVisualTabProps) {
  return (
    <div>
      <CompletionStatusCard workspaceId={workspaceId} tab="visual" tabLabel="브랜드 비주얼" />
      <div className="px-6 py-6">
        <p className="text-text-tertiary text-sm">브랜드 비주얼 폼 (다음 단계)</p>
      </div>
    </div>
  );
}
