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
      {/* id는 완성도 API의 section_key와 같다 — 저니 패널의 「입력」이 이 자리로 스크롤한다.
          scroll-mt는 위에 붙어 있는 PageHeader에 가리지 않게 하는 여백이다 */}
      <div className="space-y-6 px-6 py-6">
        <div id="brand_basic" className="scroll-mt-24">
          <BasicInfoSection workspaceId={workspaceId} />
        </div>
        <div id="brand_intro" className="scroll-mt-24">
          <IntroSection workspaceId={workspaceId} />
        </div>
        <div id="brand_status" className="scroll-mt-24">
          <OperationSection workspaceId={workspaceId} />
        </div>
        <div id="brand_contact" className="scroll-mt-24">
          <ContactSection workspaceId={workspaceId} />
        </div>
      </div>
    </div>
  );
}
