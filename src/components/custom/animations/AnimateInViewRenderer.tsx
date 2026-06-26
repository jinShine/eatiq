"use client";

import { useEffect, useMemo, useRef } from "react";

import { type MotionProps, motion, useAnimation, useInView } from "motion/react";

type UseInViewOptions = Parameters<typeof useInView>[1];

type AnimateInViewRendererProps = Omit<MotionProps, "viewport"> & {
  animation?: "fade-up" | "fade-left" | "fade-right";
  delay?: number;
  index?: number;
  viewport?: UseInViewOptions;
};

export default function AnimateInViewRenderer({
  animation,
  delay = 0.2,
  index,
  children,
  viewport = { once: true },
  ...props
}: AnimateInViewRendererProps) {
  const ref = useRef<HTMLDivElement>(null);

  const inInView = useInView(ref, viewport);
  const controlAnimation = useAnimation();

  const variants = useMemo(() => {
    if (!animation) {
      return props.variants;
    }

    const _delay = index ? index * delay : delay;

    switch (animation) {
      case "fade-up":
        return fadeUpAnimation(_delay);
      case "fade-left":
        return fadeFromLeftAnimation(delay);
      case "fade-right":
        return fadeFromRightAnimation(delay);

      default:
        return props.variants;
    }
  }, [animation, delay, props.variants]);

  useEffect(() => {
    if (inInView) {
      controlAnimation.start("animate");
    } else if (viewport?.once === false) {
      controlAnimation.start("initial");
    }
  }, [inInView, controlAnimation, viewport?.once]);

  return (
    <motion.div
      ref={ref}
      initial={props.initial ?? "initial"}
      animate={controlAnimation}
      variants={variants}
      {...props}
      viewport={viewport}
    >
      {children}
    </motion.div>
  );
}

/** Helper Animation Variants */

const fadeUpAnimation = (delay: number = 0.2) => ({
  initial: { opacity: 0, y: 100 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay,
    },
  },
});

const fadeFromLeftAnimation = (delay: number = 0.2) => ({
  initial: { opacity: 0, x: -100 },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      delay,
    },
  },
});

const fadeFromRightAnimation = (delay: number = 0.2) => ({
  initial: { opacity: 0, x: 100 },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      delay,
    },
  },
});
