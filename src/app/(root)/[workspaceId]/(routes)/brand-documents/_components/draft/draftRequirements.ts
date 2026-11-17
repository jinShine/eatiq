import { type CrmSummaryItem, type DraftDocType } from "@services/api/document/document.type";
import { type WorkspaceDetailResponse } from "@services/api/workspace/workspace.type";

/**
 * MOU·LOI 「필수 자료 / 선택 자료」 행 (피그마 2262:10257 · 10613, 변수 표 2262:10991 · 11076).
 *
 * 판정은 지금 있는 값으로 화면이 한다. 서버는 빈 값을 거절하지 않고 문서에 빈칸으로 넣으므로
 * 화면 판정과 서버가 어긋나 생성이 실패하는 일은 없다.
 * 본사 상호는 저장할 칸이 없어 뺐다(회사 정보 설정에 칸이 생기면 필수로 추가).
 *
 * 진행 건에서 오는 값(상대 법인명·국가·도시·계약 방식)은 「입력」 링크를 걸지 않는다 —
 * 진행 건은 만든 뒤 고칠 화면이 없다(수정 API 없음). API가 생기면 진행 건 상세로 다시 건다.
 */

type BrandSections = NonNullable<WorkspaceDetailResponse["brand"]>;
type BrandBasic = BrandSections["brand_basic"];
type BrandSignature = BrandSections["brand_signature"];

/**
 * 보유 — 값이 있다 / 미보유 — 채우러 갈 곳이 있으면 「입력」, 아직 없으면 「준비 중」 / 문서에서 — 화면에서 채울 곳이 없어 DOCX에서 쓴다 /
 * 자동 — 사용자가 채우는 칸 없이 서버가 모은다(소개 문서 연혁)
 */
export type RequirementStatus = "have" | "missing" | "document" | "auto";

export type RequirementRow = {
  key: string;
  label: string;
  /** 문서 속 쓰이는 곳 */
  usedIn: string;
  status: RequirementStatus;
  /** 미보유일 때 채우러 갈 주소 — 채울 화면이 아직 없으면 비운다(「준비 중」으로 보인다) */
  fillHref?: string;
  /** 행 아래 안내 — 미보유 이유 또는 빠졌을 때 결과 */
  message?: string;
};

export type DraftRequirements = {
  required: RequirementRow[];
  optional: RequirementRow[];
  missingRequiredCount: number;
};

type Sources = {
  workspaceId: string;
  docType: DraftDocType;
  crm: CrmSummaryItem;
  basic: BrandBasic | null | undefined;
  signature: BrandSignature | null | undefined;
};

const hasText = (value: string | null | undefined) => Boolean(value?.trim());

export function buildDraftRequirements({ workspaceId, docType, crm, basic, signature }: Sources): DraftRequirements {
  const signatureHref = `/${workspaceId}/company-settings?tab=policy#signature_manager/name_ko`;
  const basicHref = (field: "official_address" | "official_email") =>
    `/${workspaceId}/company-settings?tab=basic#brand_basic/${field}`;

  const signatory = (usedIn: string): RequirementRow => {
    const isHave = hasText(signature?.name_ko) && hasText(signature?.position);
    return {
      key: "signatory",
      label: "서명권자 이름 · 직책",
      usedIn,
      status: isHave ? "have" : "missing",
      fillHref: signatureHref,
      message: isHave ? undefined : "회사 정보 설정에서 서명권자를 넣어 주세요",
    };
  };

  const partnerName = (usedIn: string): RequirementRow => ({
    key: "partner_name",
    label: "상대 법인명",
    usedIn,
    // 진행 기록은 이름 없이 만들 수 없다
    status: hasText(crm.company_name) ? "have" : "missing",
  });

  const targetCountry = (usedIn: string): RequirementRow => {
    const isHave = hasText(crm.country);
    return {
      key: "target_country",
      label: "대상 국가",
      usedIn,
      status: isHave ? "have" : "missing",
      message: isHave ? undefined : "국가를 넣어 진행 건을 다시 추가해 주세요",
    };
  };

  const cityAndContract = (usedIn: string): RequirementRow => {
    const isHave = hasText(crm.city) && hasText(crm.contract_type);
    return {
      key: "city_contract",
      label: "대상 도시 · 계약 방식",
      usedIn,
      status: isHave ? "have" : "missing",
      // 서버는 빈 값을 「추후 협의」로 바꾸지 않고 `{{대상 도시·지역}}` 같은 빈칸으로 둔다(11-17 문서 실측)
      message: isHave ? undefined : "진행 건을 추가할 때 넣는 값이에요 · 없으면 빈칸으로 남겨요",
    };
  };

  if (docType === "mou") {
    const hasAddressAndEmail = hasText(basic?.official_address) && hasText(basic?.official_email);
    return withCount({
      required: [signatory("서명란"), partnerName("당사자 · 서명란"), targetCountry("협력 국가")],
      optional: [
        cityAndContract("협력 범위"),
        {
          key: "address_email",
          label: "본사 주소 · 대표 이메일",
          usedIn: "서명란 · 통지처",
          status: hasAddressAndEmail ? "have" : "missing",
          fillHref: basicHref(hasText(basic?.official_address) ? "official_email" : "official_address"),
          message: hasAddressAndEmail ? undefined : "비어 있으면 문서에 빈칸으로 남겨요",
        },
        {
          key: "partner_signatory",
          label: "상대 서명란 정보",
          usedIn: "서명란 · 통지처",
          status: "document",
          message: "원장에 없는 값은 빈칸으로 나가요",
        },
      ],
    });
  }

  // LOI — 회신받을 주소라 대표 이메일이 필수다(담당자 이메일로 채우지 않는다)
  const hasEmail = hasText(basic?.official_email);
  const hasAddress = hasText(basic?.official_address);
  return withCount({
    required: [
      signatory("서명란"),
      {
        key: "official_email",
        label: "본사 대표 이메일",
        usedIn: "회신 수신처",
        status: hasEmail ? "have" : "missing",
        fillHref: basicHref("official_email"),
        message: hasEmail ? undefined : "회신받을 대표 이메일을 넣어 주세요",
      },
      partnerName("수신"),
      targetCountry("제안 국가"),
    ],
    optional: [
      cityAndContract("제안 내용"),
      {
        key: "official_address",
        label: "본사 주소",
        usedIn: "서명란",
        status: hasAddress ? "have" : "missing",
        fillHref: basicHref("official_address"),
        message: hasAddress ? undefined : "비어 있으면 문서에 빈칸으로 남겨요",
      },
    ],
  });
}

function withCount(rows: Omit<DraftRequirements, "missingRequiredCount">): DraftRequirements {
  return { ...rows, missingRequiredCount: rows.required.filter(row => row.status === "missing").length };
}
