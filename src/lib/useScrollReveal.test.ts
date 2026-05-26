import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useScrollReveal } from "./useScrollReveal";

describe("useScrollReveal", () => {
  let observed: Element[];
  let observerCallback: IntersectionObserverCallback;

  beforeEach(() => {
    observed = [];
    // @ts-expect-error mock
    global.IntersectionObserver = vi.fn((cb) => {
      observerCallback = cb;
      return {
        observe: (el: Element) => observed.push(el),
        unobserve: vi.fn(),
        disconnect: vi.fn(),
      };
    });
  });

  it("returns a ref + boolean; flips to true on intersection (one-shot)", () => {
    const { result } = renderHook(() => useScrollReveal<HTMLDivElement>());
    const el = document.createElement("div");
    act(() => {
      // @ts-expect-error attach ref
      result.current[0].current = el;
    });

    // Initial state: not revealed
    expect(result.current[1]).toBe(false);

    // Simulate IntersectionObserver firing
    act(() => {
      observerCallback(
        [{ isIntersecting: true, target: el } as IntersectionObserverEntry],
        // @ts-expect-error mock
        {}
      );
    });

    expect(result.current[1]).toBe(true);
  });

  it("respects prefers-reduced-motion (immediate reveal, no observer)", () => {
    const mql = vi.fn(() => ({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() }));
    // @ts-expect-error mock
    window.matchMedia = mql;

    const { result } = renderHook(() => useScrollReveal<HTMLDivElement>());
    // With reduced motion, should be true immediately
    expect(result.current[1]).toBe(true);
  });
});
