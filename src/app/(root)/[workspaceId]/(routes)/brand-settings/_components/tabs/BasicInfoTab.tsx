import CompletionStatusCard from "../completion/CompletionStatusCard";
import BasicInfoSection from "../sections/BasicInfoSection";
import ContactSection from "../sections/ContactSection";
import IntroSection from "../sections/IntroSection";
import OperationSection from "../sections/OperationSection";

type BasicInfoTabProps = {
  workspaceId: string;
};

export default function BasicInfoTab({ workspaceId }: BasicInfoTabProps) {
  return (
    <div>
      <CompletionStatusCard workspaceId={workspaceId} tab="basic" tabLabel="기본 정보" />
      <div className="space-y-6 px-6 py-6">
        <BasicInfoSection workspaceId={workspaceId} />
        <IntroSection workspaceId={workspaceId} />
        <OperationSection workspaceId={workspaceId} />
        <ContactSection workspaceId={workspaceId} />
      </div>
    </div>
  );
}
