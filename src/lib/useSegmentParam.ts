"use client";
import { useEffect, useState } from "react";
import { VERTICAL_KEYS, isVerticalKey, type VerticalKey } from "@/lib/verticals";

const SEGMENT_CHANGED = "anna:segment-changed";

type SegmentChangedDetail = { segment: VerticalKey };

export function useSegmentParam(
  initial: VerticalKey
): [VerticalKey, (k: VerticalKey) => void] {
  const [active, setActive] = useState<VerticalKey>(initial);

  // On mount, read ?v= from URL. If it's a valid key and differs from `initial`,
  // adopt it so client-side hydration honours deep links.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const v = params.get("v");
    if (v && isVerticalKey(v) && v !== active) {
      setActive(v);
    }
    // Intentionally run only once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Listen for sibling-driven segment changes.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<SegmentChangedDetail>).detail;
      if (detail && isVerticalKey(detail.segment) && detail.segment !== active) {
        setActive(detail.segment);
      }
    };
    window.addEventListener(SEGMENT_CHANGED, handler);
    return () => window.removeEventListener(SEGMENT_CHANGED, handler);
  }, [active]);

  const select = (k: VerticalKey) => {
    if (!VERTICAL_KEYS.includes(k)) return;
    setActive(k);
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      params.set("v", k);
      window.history.replaceState({}, "", `${window.location.pathname}?${params.toString()}`);
      // Broadcast. Self-listen is harmless: handler short-circuits on `=== active`.
      window.dispatchEvent(new CustomEvent<SegmentChangedDetail>(SEGMENT_CHANGED, { detail: { segment: k } }));
    }
  };

  return [active, select];
}
