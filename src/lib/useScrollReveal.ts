"use client";
import { useEffect, useRef, useState } from "react";

type State = { revealed: boolean; instant: boolean };

export function useScrollReveal<T extends Element>(): [React.RefObject<T>, State] {
  const ref = useRef<T>(null);
  const [state, setState] = useState<State>({ revealed: false, instant: false });

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mql.matches) {
      setState({ revealed: true, instant: true });
      return;
    }
    const node = ref.current;
    if (!node) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const instant = entry.intersectionRatio >= 0.6;
            setState({ revealed: true, instant });
            io.disconnect();
            return;
          }
        }
      },
      { threshold: [0.15, 0.6], rootMargin: "0px 0px -10% 0px" }
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  return [ref, state];
}
