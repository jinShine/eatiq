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
        {/* id = 완성도 API의 section_key. 저니 패널의 「입력」이 이 id로 섹션을 찾아 이동한다 */}
        <div id="location_standard" className="scroll-mt-24">
          <LocationCriteriaSection workspaceId={workspaceId} />
        </div>
        <div id="size_criteria" className="scroll-mt-24">
          <StoreSizeSection workspaceId={workspaceId} />
        </div>
        <div id="facility_req" className="scroll-mt-24">
          <FacilitySection workspaceId={workspaceId} />
        </div>
      </div>
    </div>
  );
}
