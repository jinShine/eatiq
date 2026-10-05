"use client";

import { useEffect, useState } from "react";

import { SparklesIcon } from "lucide-react";
import { AnimatePresence, type Variants, motion } from "motion/react";

// 순환 노출할 예시 프롬프트 (추후 모달 트리거로 확장 예정)
const EXAMPLES = [
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

const SPARKLE_ICON_VARIANTS: Variants = {
  rest: {
    filter: "drop-shadow(0 0 0 rgba(99, 102, 241, 0))",
    rotate: 0,
    scale: 1,
  },
  hover: {
    filter: [
      "drop-shadow(0 0 0 rgba(99, 102, 241, 0))",
      "drop-shadow(0 0 8px rgba(99, 102, 241, 0.55))",
      "drop-shadow(0 0 0 rgba(99, 102, 241, 0))",
    ],
    rotate: [0, -12, 12, -6, 0],
    scale: [1, 1.22, 0.98, 1.1, 1],
    transition: {
      duration: 0.9,
      ease: "easeInOut",
    },
  },
};

const getRandomExampleIndex = () => Math.floor(Math.random() * EXAMPLES.length);

export default function AiAskButton() {
  const [index, setIndex] = useState<number | null>(null);

  useEffect(() => {
    const initialIndex = getRandomExampleIndex();

    setIndex(initialIndex);

    const id = setInterval(() => {
      setIndex(prev => ((prev ?? initialIndex) + 1) % EXAMPLES.length);
    }, ROTATE_INTERVAL);

    return () => clearInterval(id);
  }, []);

  return (
    <motion.button
      type="button"
      initial="rest"
      whileHover="hover"
      // 모바일은 아이콘만 있는 동그란 버튼 — 글자 버튼이 헤더 폭의 절반을 차지해 화면 설명이 잘렸다
      className="border-border hover:bg-accent flex size-10 shrink-0 items-center justify-center gap-2 rounded-full border text-sm transition-colors md:size-auto md:py-2 md:pr-4 md:pl-3"
    >
      <motion.span className="flex size-4 shrink-0 items-center justify-center" variants={SPARKLE_ICON_VARIANTS}>
        <SparklesIcon className="text-primary size-4" />
      </motion.span>
      {/* 모바일에서는 화면에 숨기되 화면 낭독기에는 버튼 이름으로 남긴다 */}
      <span className="text-text-secondary sr-only shrink-0 font-medium md:not-sr-only">AI에게 물어보세요</span>

      {/* 예시 문구가 아래→위로 슬라이드되며 순환 (데스크톱만) */}
      <span className="text-text-tertiary relative hidden h-5 w-[220px] overflow-hidden text-left md:block">
        <AnimatePresence mode="wait">
          {index !== null && (
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
          )}
        </AnimatePresence>
      </span>
    </motion.button>
  );
}
