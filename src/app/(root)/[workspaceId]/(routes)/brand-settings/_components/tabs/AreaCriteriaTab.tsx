import CompletionStatusCard from "../completion/CompletionStatusCard";

type AreaCriteriaTabProps = {
  workspaceId: string;
};

export default function AreaCriteriaTab({ workspaceId }: AreaCriteriaTabProps) {
  return (
    <div className="space-y-6">
      <CompletionStatusCard workspaceId={workspaceId} tab="area" tabLabel="상권분석 기준" />
      <p className="text-text-tertiary text-sm">상권분석 기준 폼 (다음 단계)</p>
    </div>
  );
}
