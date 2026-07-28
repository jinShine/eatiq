"use client";

import { useEffect, useState } from "react";

import { SparklesIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

// 순환 노출할 예시 프롬프트 (추후 모달 트리거로 확장 예정)
const EXAMPLES = [
  "이번 주 마감 예정 다음 액션 보여줘",
  "우리 브랜드 강점 3가지 요약해줘",
  "경쟁사 대비 차별점 정리해줘",
  "바이어에게 어필할 포인트 알려줘",
  "해외 진출에 필요한 서류 알려줘",
  "우리 브랜드 소개문 초안 써줘",
  "타겟 상권을 추천해줘",
  "바이어 미팅 예상 질문 뽑아줘",
  "대표 메뉴 영문 설명 만들어줘",
];

const ROTATE_INTERVAL = 2800;

export default function AiAskButton() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex(prev => (prev + 1) % EXAMPLES.length);
    }, ROTATE_INTERVAL);
    return () => clearInterval(id);
  }, []);

  return (
    <button
      type="button"
      className="border-border hover:bg-accent flex shrink-0 items-center gap-2 rounded-full border py-2 pr-4 pl-3 text-sm transition-colors"
    >
      <SparklesIcon className="text-primary size-4 shrink-0" />
      <span className="text-text-secondary shrink-0 font-medium">AI에게 물어보세요</span>

      {/* 예시 문구가 아래→위로 슬라이드되며 순환 (데스크톱만) */}
      <span className="text-text-tertiary relative hidden h-5 w-[220px] overflow-hidden text-left md:block">
        <AnimatePresence mode="wait">
          <motion.span
            key={index}
            initial={{ y: "110%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            exit={{ y: "-110%", opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="absolute inset-0 truncate"
          >
            예: “{EXAMPLES[index]}”
          </motion.span>
        </AnimatePresence>
      </span>
    </button>
  );
}
