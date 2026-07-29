import CompletionStatusCard from "../completion/CompletionStatusCard";

type PolicyTabProps = {
  workspaceId: string;
};

export default function PolicyTab({ workspaceId }: PolicyTabProps) {
  return (
    <div>
      <CompletionStatusCard workspaceId={workspaceId} tab="policy" tabLabel="계약 및 정책" />
      <div className="px-6 py-6">
        <p className="text-text-tertiary text-sm">계약 정보 폼 (다음 단계)</p>
      </div>
    </div>
  );
}
