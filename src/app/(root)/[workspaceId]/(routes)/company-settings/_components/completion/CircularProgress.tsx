"use client";

import { useEffect, useRef } from "react";

import { animate, motion, useAnimate, useMotionValue, useReducedMotion, useTransform } from "motion/react";

type CircularProgressProps = {
  rate: number; // 0~100
  size?: number;
  strokeWidth?: number;
  label?: string; // 스크린리더용 설명
};

export default function CircularProgress({
  rate,
  size = 80,
  strokeWidth = 8,
  label = "완성률",
}: CircularProgressProps) {
  const shouldReduceMotion = useReducedMotion();
  const [scope, animateScope] = useAnimate();
  const isFirstRender = useRef(true);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // 0 → rate 로 흐르는 모션 값 (원 그리기 + 숫자 카운트업 공용 소스)
  const progress = useMotionValue(shouldReduceMotion ? rate : 0);
  const dashOffset = useTransform(progress, value => circumference * (1 - value / 100));
  const displayRate = useTransform(progress, value => Math.round(value));

  useEffect(() => {
    const controls = animate(progress, rate, {
      duration: shouldReduceMotion ? 0 : 1.1,
      ease: [0.22, 1, 0.36, 1], // easeOutQuint — 처음 빠르고 끝에 부드럽게
    });
    return () => controls.stop();
  }, [rate, progress, shouldReduceMotion]);

  // 진행률이 "변했을 때"만 살짝 펄스 (최초 마운트는 원 그리기 애니메이션으로 충분)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (shouldReduceMotion || !scope.current) {
      return;
    }
    animateScope(scope.current, { scale: [1, 1.05, 1] }, { duration: 0.45, ease: "easeOut" });
  }, [rate, shouldReduceMotion, animateScope, scope]);

  return (
    <div
      ref={scope}
      className="relative shrink-0"
      style={{ width: size, height: size }}
      role="progressbar"
      aria-label={label}
      aria-valuenow={rate}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuetext={`${rate}%`}
    >
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        {/* 트랙 */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          className="stroke-primary-light"
        />
        {/* 진행 */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          style={{ strokeDashoffset: dashOffset }}
          className="stroke-primary"
        />
      </svg>

      {/* 중앙 숫자 — 실제 값은 aria-valuetext가 전달하므로 시각 전용 */}
      <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
        <span className="text-text-primary text-lg font-bold">
          <motion.span>{displayRate}</motion.span>%
        </span>
      </div>
    </div>
  );
}
