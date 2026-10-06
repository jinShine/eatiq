import CompletionStatusCard from "../completion/CompletionStatusCard";
import VisualIdentitySection from "../sections/VisualIdentitySection";

type BrandVisualTabProps = {
  workspaceId: string;
};

export default function BrandVisualTab({ workspaceId }: BrandVisualTabProps) {
  return (
    <div>
      <CompletionStatusCard workspaceId={workspaceId} tab="visual" tabLabel="브랜드 비주얼" />
      {/* id = 완성도 API의 section_key. 저니 패널의 「입력」이 이 id로 섹션을 찾아 이동한다.
          대표 매장(visual_store)은 저장 API가 없어 아직 만들지 않는다(백엔드 확인 중) */}
      <div className="space-y-6 px-6 py-6">
        <section id="visual_identity" className="scroll-mt-24">
          <VisualIdentitySection workspaceId={workspaceId} />
        </section>
        <section id="visual_menu" className="scroll-mt-24">
          <p className="text-text-tertiary text-sm">대표 메뉴 (다음 단계)</p>
        </section>
      </div>
    </div>
  );
}
