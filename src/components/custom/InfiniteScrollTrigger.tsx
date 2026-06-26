"use client";

import { useEffect } from "react";

import { Loader2 } from "lucide-react";
import { motion } from "motion/react";

import { Text } from "@components/ui";

import { useInView } from "@hooks/commons";

type Props = {
  /** 다음 페이지 존재 여부 */
  hasNextPage: boolean;
  /** 다음 페이지 로딩 중 여부 */
  isFetchingNextPage: boolean;
  /** 다음 페이지 로드 함수 */
  fetchNextPage: () => void;
  /** 현재 아이템 개수 (0이면 완료 메시지 숨김) */
  itemCount?: number;
  /** 완료 메시지 */
  completedMessage?: string;
  /** 로딩 중 메시지 */
  loadingHintMessage?: string;
  /** 완료 메시지 자동 숨김 딜레이 (초). undefined면 계속 표시 */
  autoHideDelay?: number;
};

/**
 * 무한 스크롤 트리거 컴포넌트
 * - 화면에 보이면 자동으로 다음 페이지 로드
 * - 로딩 스피너, 완료 메시지 표시
 */
export default function InfiniteScrollTrigger({
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  itemCount = 0,
  completedMessage = "모두 불러왔습니다",
  loadingHintMessage = "스크롤하여 더 보기",
  autoHideDelay,
}: Props) {
  const { ref, inView } = useInView({ threshold: 0.1 });
  const shouldAutoHide = autoHideDelay !== undefined;

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // 완료 메시지 애니메이션 variants
  const completedMessageVariants = shouldAutoHide
    ? {
        initial: { opacity: 0 },
        animate: { opacity: [0, 1, 1, 0] },
        transition: {
          delay: 0.5,
          duration: autoHideDelay + 0.6,
          times: [0, 0.15, 0.85, 1], // 페이드인 → 유지 → 페이드아웃
        },
      }
    : {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.3 },
      };

  return (
    <div ref={ref} className="w-full py-4 flex justify-center">
      {isFetchingNextPage ? (
        <Loader2 className="size-5 animate-spin text-gray-400" />
      ) : hasNextPage ? (
        <Text variant="xs" className="text-gray-400">
          {loadingHintMessage}
        </Text>
      ) : itemCount > 0 ? (
        <motion.div key={itemCount} {...completedMessageVariants}>
          <Text variant="xs" className="text-gray-400">
            {completedMessage}
          </Text>
        </motion.div>
      ) : null}
    </div>
  );
}
