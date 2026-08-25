// TODO(API): 상권 분석 실행 API가 준비되면 이 파일을 삭제하고 응답으로 교체한다.

export type PropertyCandidate = {
  id: string;
  /** 역·상권 이름 */
  name: string;
  /** 추천 사유 2줄 */
  reason: string;
  /** 월세·보증금 (현지 통화 표기 그대로) */
  cost: string;
  /** 층·전용 면적 */
  spec: string;
  /** 현지 주소 */
  address: string;
  /** 우상단 배지 — 없으면 표시하지 않는다 */
  badge?: string;
  /**
   * 매물 사진 자리.
   * 시안도 사진이 없을 때 배경색 + 이모지로 채우므로 목업은 이 방식만 쓴다.
   */
  thumbnail: { emoji: string; background: string };
};

export const ANALYSIS_PROPERTIES: PropertyCandidate[] = [
  {
    id: "prop-toritsudaigaku",
    name: "도립대학역",
    reason: "야키니쿠 기존 점포와 넓은 면적으로 업종 전환 부담이 낮고 브랜드의 공간 경험을 구현하기 좋은 후보입니다",
    cost: "월세 ¥777,480 · 보증금 ¥3,800,000",
    spec: "지하 1층 · 전용 58.85평",
    address: "東京都目黒区八雲一丁目4-3",
    badge: "독점 매물",
    thumbnail: { emoji: "🍗", background: "#efe5d3" },
  },
  {
    id: "prop-kagurazaka",
    name: "가구라자카역",
    reason: "적당한 면적과 중층식 가능 조건이 갖춰져 있어 브랜드의 매장으로 검토하기 좋은 후보입니다",
    cost: "월세 ¥710,000 · 보증금 ¥6,360,000",
    spec: "지하 1층 · 전용 23.03평",
    address: "東京都新宿区神楽坂六丁目7",
    badge: "독점 대응",
    thumbnail: { emoji: "🍶", background: "#e3e8ef" },
  },
  {
    id: "prop-wakamiyacho",
    name: "가구라자카 · 와카미야초",
    reason: "기존 일본식 인테리어와 주방 설비가 있어 프리미엄 고깃집으로 전환하기 자연스러운 후보입니다.",
    cost: "월세 ¥730,000 · 보증금 ¥4,260,000",
    spec: "지하 1층 · 전용 23.03평",
    address: "東京都新宿区新宿五丁目6",
    thumbnail: { emoji: "🏮", background: "#efdcd8" },
  },
  {
    id: "prop-higashinakano",
    name: "히가시나카노역",
    reason: "넓은 스켈레톤 공간이라 브랜드의 인테리어와 주방 동선을 처음부터 구현하기 좋은 후보입니다",
    cost: "월세 ¥649,000 · 보증금 ¥2,000,000",
    spec: "지하 1~2층 · 전용 41.89평",
    address: "東京都中野区東中野一丁目15-3",
    thumbnail: { emoji: "🏗️", background: "#e6e6e9" },
  },
  {
    id: "prop-azabujuban",
    name: "아자부주반역",
    reason: "프리미엄 상권과 뛰어난 접근성이 강점이며, 소형 플래그십 전략이라면 검토할 가치가 높은 후보입니다.",
    cost: "월세 ¥649,000 · 보증금 ¥2,700,000",
    spec: "4층 · 전용 34.19평",
    address: "東京都港区麻布十番一丁目11-10",
    thumbnail: { emoji: "🥢", background: "#e8eae3" },
  },
  {
    id: "prop-asakusabashi",
    name: "아사쿠사바시역",
    reason: "1층~2층 복층 중층식 가능 조건이 함께 갖춰져 있어 출점 실무 조건의 밸런스가 좋은 후보입니다.",
    cost: "월세 ¥680,000 · 보증금 ¥3,400,000",
    spec: "1층 · 전용 28.46평",
    address: "東京都台東区浅草橋一丁目2-10",
    thumbnail: { emoji: "🌿", background: "#e2ebe4" },
  },
  {
    id: "prop-shinanomachi",
    name: "시나노마치역",
    reason: "냄새나 연기가 강한 업종도 상담 가능하다고 명시되어 있어 실제 허용 조건을 우선 문의해볼 만한 후보입니다.",
    cost: "월세 ¥404,800 · 보증금 ¥1,700,000",
    spec: "지하 1층 · 전용 20.96평",
    address: "東京都新宿区信濃町30",
    thumbnail: { emoji: "🍺", background: "#efe7d6" },
  },
  {
    id: "prop-ochiai",
    name: "오치아이역",
    reason: "2026년 7월에 신축한 건물로 1층에 중층식이 가능하도록 새로 구성했습니다",
    cost: "월세 ¥480,000 · 보증금 ¥2,880,000",
    spec: "1층 · 전용 15.12평",
    address: "東京都中野区中野三丁目17-14",
    badge: "독점 매물",
    thumbnail: { emoji: "🏢", background: "#e4e7ec" },
  },
];
