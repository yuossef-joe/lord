"use client";

import { useCallback, useRef } from "react";
import { useInView } from "react-intersection-observer";

interface UseAnimatedCounterOptions {
  end: number;
  duration?: number;
  startOnView?: boolean;
}

export function useAnimatedCounter({
  end,
  duration = 2000,
  startOnView = true,
}: UseAnimatedCounterOptions) {
  const countRef = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  const animate = useCallback(() => {
    if (hasAnimated.current || !countRef.current) return;
    hasAnimated.current = true;

    const startTime = performance.now();
    const startVal = 0;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startVal + (end - startVal) * eased);

      if (countRef.current) {
        countRef.current.textContent = current.toLocaleString();
      }

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    };

    requestAnimationFrame(tick);
  }, [end, duration]);

  const { ref: inViewRef } = useInView({
    threshold: 0.5,
    triggerOnce: true,
    onChange: (inView) => {
      if (inView && startOnView) animate();
    },
  });

  return { countRef, inViewRef, animate };
}
