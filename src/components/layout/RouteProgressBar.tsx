"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";

type RouteProgressBarProps = {
  isNavigating: boolean;
};

/**
 * 라우트 전환 진행 바.
 *
 * 스켈레톤을 그릴 만큼 무겁지 않은 전환(탭 이동 등)에서는 화면을 바꾸지 않고
 * "눌린 걸 받았다"는 신호만 준다. 스켈레톤과 겹치지 않고 서로를 보완한다.
 *
 * 끝나는 시점을 모르는 채로 차오르므로 90%에서 멈춰 세운다. 100%까지 갔다가
 * 기다리게 하면 다 됐다고 해놓고 안 끝나는 꼴이라 더 답답하다.
 * width 대신 scaleX를 쓴다 — width는 매 프레임 레이아웃을 다시 계산한다.
 */
export default function RouteProgressBar({ isNavigating }: RouteProgressBarProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <AnimatePresence>
      {isNavigating && (
        <motion.div
          role="progressbar"
          aria-label="화면을 불러오는 중"
          className="bg-primary fixed inset-x-0 top-0 z-[60] h-0.5 origin-left"
          initial={{ scaleX: 0, opacity: 1 }}
          animate={{ scaleX: 0.9 }}
          // 끝날 때는 남은 구간을 빠르게 채우고 사라진다
          exit={{
            scaleX: 1,
            opacity: 0,
            transition: { scaleX: { duration: 0.2 }, opacity: { duration: 0.3, delay: 0.15 } },
          }}
          transition={shouldReduceMotion ? { duration: 0 } : { duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
        />
      )}
    </AnimatePresence>
  );
}
