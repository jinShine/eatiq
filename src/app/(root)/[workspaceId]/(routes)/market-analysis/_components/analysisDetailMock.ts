// TODO(API): 매물 상세 리포트 API가 준비되면 이 파일을 삭제하고 useQuery로 교체한다.

/** 적합성 판단 등급 — 진행 관리의 STAGE_META와 같은 방식으로 색을 상수화한다 */
export type FitLevel = "strength" | "good" | "normal" | "review";

export const FIT_LEVEL_META: Record<FitLevel, { label: string; className: string }> = {
  strength: { label: "강점", className: "bg-[#059669] text-white" },
  good: { label: "양호", className: "bg-[#34d399] text-white" },
  normal: { label: "보통", className: "bg-[#e5e7eb] text-[#6b7280]" },
  review: { label: "검토 필요", className: "bg-[#d97706] text-white" },
};

export type PropertyDetail = {
  id: string;
  name: string;
  /** 갤러리 — 사진이 없어 시안처럼 배경색 + 이모지로 채운다 */
  gallery: { emoji: string; background: string }[];
  /** 기본 임대 정보 — 라벨 / 값 / 보조 표기 */
  lease: { label: string; value: string; note?: string }[];
  /** 적합성 판단 */
  fitAssessments: { label: string; value: string; level: FitLevel }[];
  /** EATIQ LINK의 발견 */
  findings: { title: string; note: string }[];
  /** 계약 전 반드시 검토 필요한 항목 */
  checkPoints: { title: string; note: string }[];
  /** 위치 정보 */
  address: string;
  /** 설비 요건 진단 */
  facilities: { label: string; value: string }[];
  /** 출처 */
  sources: { label: string; url: string }[];
  /** 담당자 연락처 */
  contact: { name: string; role: string };
};

const TORITSUDAIGAKU_DETAIL: PropertyDetail = {
  id: "prop-toritsudaigaku",
  name: "도립대학역",
  gallery: [
    { emoji: "🍗", background: "#efe5d3" },
    { emoji: "🪑", background: "#e6e2dc" },
    { emoji: "🍽️", background: "#e9e4de" },
    { emoji: "📐", background: "#eceff3" },
  ],
  lease: [
    { label: "월 임대료", value: "¥777,480", note: "약 7,290천원" },
    { label: "보증금", value: "¥3,800,000", note: "약 3,566천원" },
    { label: "전용 면적", value: "58.85평" },
    { label: "층", value: "지하 1층" },
  ],
  fitAssessments: [
    { label: "상권", value: "도심 · 저녁 수요 강세", level: "strength" },
    { label: "면적", value: "넓은 폭 · 좌석 확보 여유", level: "good" },
    { label: "임대료", value: "기준 범위 상단", level: "normal" },
    { label: "입지", value: "지하 1층 · 외부 노출 제한 가능", level: "review" },
    { label: "설비", value: "기존 주방 · 배기 승계 가능성 확인", level: "strength" },
  ],
  findings: [
    { title: "기존 야키니쿠 점포라 업종 전환 부담이 낮음", note: "매물 설명서 기준" },
    { title: "58.85평은 넓은 면적으로 브랜드 공간 경험 구현 가능", note: "실측 도면 확인" },
    { title: "저녁 중심 상권 대비 매출 잔재와 입지", note: "상권 데이터 기준" },
  ],
  checkPoints: [
    { title: "지하층 간판 노출", note: "지상 사인물 설치 범위 · 건물주 승인 범위 필요" },
    { title: "주차 공간 확보", note: "인근 공영 주차 · 계약 가능 여부 확인" },
    { title: "임대료 검토", note: "기준 최상단, 인테리어 대비 초기 3개월 임대료 협상 여지 확인" },
  ],
  address: "東京都目黒区八雲一丁目4-3",
  facilities: [
    { label: "가스", value: "인입 가능" },
    { label: "급배수", value: "양호" },
    { label: "배기", value: "기존 설비 승계 가능" },
    { label: "전기 용량", value: "용량 확인 필요" },
  ],
  sources: [
    { label: "LOOPNET.COM", url: "https://www.loopnet.com" },
    { label: "GoogleMaps", url: "https://maps.google.com" },
  ],
  contact: { name: "Cynthia Park", role: "LoopNet 등록 중개인" },
};

export const PROPERTY_DETAIL_MOCK: Record<string, PropertyDetail> = {
  [TORITSUDAIGAKU_DETAIL.id]: TORITSUDAIGAKU_DETAIL,
};

/** 상세 목업이 없는 매물은 시안 구조를 유지한 기본값으로 채운다 */
export const buildFallbackPropertyDetail = (id: string, name: string): PropertyDetail => ({
  ...TORITSUDAIGAKU_DETAIL,
  id,
  name,
});
