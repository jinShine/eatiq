import CompletionStatusCard from "../completion/CompletionStatusCard";
import FacilitySection from "../sections/FacilitySection";
import LocationCriteriaSection from "../sections/LocationCriteriaSection";
import StoreSizeSection from "../sections/StoreSizeSection";

type AreaCriteriaTabProps = {
  workspaceId: string;
};

export default function AreaCriteriaTab({ workspaceId }: AreaCriteriaTabProps) {
  return (
    <div>
      <CompletionStatusCard workspaceId={workspaceId} tab="area" tabLabel="상권분석 기준" />
      <div className="space-y-6 px-6 py-6">
        <LocationCriteriaSection workspaceId={workspaceId} />
        <StoreSizeSection workspaceId={workspaceId} />
        <FacilitySection workspaceId={workspaceId} />
      </div>
    </div>
  );
}
