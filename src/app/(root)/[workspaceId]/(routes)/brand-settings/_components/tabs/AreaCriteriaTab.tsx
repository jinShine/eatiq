import CompletionStatusCard from "../completion/CompletionStatusCard";

type AreaCriteriaTabProps = {
  workspaceId: string;
};

export default function AreaCriteriaTab({ workspaceId }: AreaCriteriaTabProps) {
  return (
    <div>
      <CompletionStatusCard workspaceId={workspaceId} tab="area" tabLabel="상권분석 기준" />
      <div className="px-6 py-6">
        <p className="text-text-tertiary text-sm">상권분석 기준 폼 (다음 단계)</p>
      </div>
    </div>
  );
}
