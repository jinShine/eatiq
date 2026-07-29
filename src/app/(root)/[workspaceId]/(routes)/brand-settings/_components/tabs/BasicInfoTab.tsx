import CompletionStatusCard from "../completion/CompletionStatusCard";

type BasicInfoTabProps = {
  workspaceId: string;
};

export default function BasicInfoTab({ workspaceId }: BasicInfoTabProps) {
  return (
    <div>
      <CompletionStatusCard workspaceId={workspaceId} tab="basic" tabLabel="기본 정보" />
      <div className="px-6 py-6">
        <p className="text-text-tertiary text-sm">기본 정보 폼 (다음 단계)</p>
      </div>
    </div>
  );
}
