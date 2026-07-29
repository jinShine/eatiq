"use client";

import { useEffect } from "react";

import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "motion/react";

type CircularProgressProps = {
  rate: number; // 0~100
  size?: number;
  strokeWidth?: number;
};

export default function CircularProgress({ rate, size = 80, strokeWidth = 8 }: CircularProgressProps) {
  const shouldReduceMotion = useReducedMotion();

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

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
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

      {/* 중앙 숫자 */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-text-primary text-lg font-bold">
          <motion.span>{displayRate}</motion.span>%
        </span>
      </div>
    </div>
  );
}
