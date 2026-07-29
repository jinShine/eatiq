import CompletionStatusCard from "../completion/CompletionStatusCard";

type PolicyTabProps = {
  workspaceId: string;
};

export default function PolicyTab({ workspaceId }: PolicyTabProps) {
  return (
    <div className="space-y-6">
      <CompletionStatusCard workspaceId={workspaceId} tab="policy" tabLabel="계약 및 정책" />
      <p className="text-text-tertiary text-sm">계약 정보 폼 (다음 단계)</p>
    </div>
  );
}
