"use client";

import { useEffect, useState } from "react";

export function useReducedMotion(): boolean {
  const [shouldReduce, setShouldReduce] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setShouldReduce(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setShouldReduce(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  return shouldReduce;
}
