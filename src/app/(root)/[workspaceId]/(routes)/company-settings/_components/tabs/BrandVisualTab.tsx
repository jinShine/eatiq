import CompletionStatusCard from "../completion/CompletionStatusCard";
import MenuSection from "../sections/MenuSection";
import StoreSection from "../sections/StoreSection";
import VisualIdentitySection from "../sections/VisualIdentitySection";

type BrandVisualTabProps = {
  workspaceId: string;
};

export default function BrandVisualTab({ workspaceId }: BrandVisualTabProps) {
  return (
    <div>
      <CompletionStatusCard workspaceId={workspaceId} tab="visual" tabLabel="브랜드 비주얼" />
      {/* id = 완성도 API의 section_key. 저니 패널의 「입력」이 이 id로 섹션을 찾아 이동한다.
          순서는 시안(769:3837)대로 이미지 자산 → 대표 매장 → 대표 메뉴 */}
      <div className="space-y-6 px-6 py-6">
        <section id="visual_identity" className="scroll-mt-24">
          <VisualIdentitySection workspaceId={workspaceId} />
        </section>
        <section id="visual_store" className="scroll-mt-24">
          <StoreSection workspaceId={workspaceId} />
        </section>
        <section id="visual_menu" className="scroll-mt-24">
          <MenuSection workspaceId={workspaceId} />
        </section>
      </div>
    </div>
  );
}
