// "use client" 없이 둔다 — page.tsx(서버)가 toDocumentsTabKey를 직접 부른다

/** 피그마 「회사 문서 작성」(2262:9924) 탭 순서 */
export const DOCUMENTS_TABS = [
  { key: "intro", label: "소개 문서 생성" },
  { key: "video", label: "소개 영상 생성" },
  { key: "mou", label: "MOU 초안" },
  { key: "loi", label: "LOI 초안" },
] as const;
export type DocumentsTabKey = (typeof DOCUMENTS_TABS)[number]["key"];

/** 주소의 tab 값이 목록에 없으면(오타·옛 링크) 첫 탭으로 */
export function toDocumentsTabKey(tab: string | undefined): DocumentsTabKey {
  return DOCUMENTS_TABS.find(item => item.key === tab)?.key ?? "intro";
}
