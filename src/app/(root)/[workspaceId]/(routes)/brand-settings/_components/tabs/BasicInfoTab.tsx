import CompletionStatusCard from "../completion/CompletionStatusCard";

type BasicInfoTabProps = {
  workspaceId: string;
};

export default function BasicInfoTab({ workspaceId }: BasicInfoTabProps) {
  return (
    <div className="space-y-6">
      <CompletionStatusCard workspaceId={workspaceId} tab="basic" tabLabel="기본 정보" />
      <p className="text-text-tertiary text-sm">기본 정보 폼 (다음 단계)</p>
    </div>
  );
}
