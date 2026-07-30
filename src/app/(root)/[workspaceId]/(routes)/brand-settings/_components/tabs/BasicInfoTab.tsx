import CompletionStatusCard from "../completion/CompletionStatusCard";
import BasicInfoSection from "../sections/BasicInfoSection";

type BasicInfoTabProps = {
  workspaceId: string;
};

export default function BasicInfoTab({ workspaceId }: BasicInfoTabProps) {
  return (
    <div>
      <CompletionStatusCard workspaceId={workspaceId} tab="basic" tabLabel="기본 정보" />
      <div className="px-6 py-6">
        <BasicInfoSection workspaceId={workspaceId} />
      </div>
    </div>
  );
}
