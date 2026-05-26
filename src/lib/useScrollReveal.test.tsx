import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, act } from "@testing-library/react";
import { useScrollReveal } from "./useScrollReveal";

describe("useScrollReveal", () => {
  let observerCallback: IntersectionObserverCallback | null;

  beforeEach(() => {
    observerCallback = null;

    // Default: no reduced-motion preference
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })) as unknown as typeof window.matchMedia;

    // Capture the IntersectionObserver callback so the test can fire it manually.
    // Use a real function (not arrow) so `new IntersectionObserver(...)` works.
    global.IntersectionObserver = vi.fn(function (this: IntersectionObserver, cb: IntersectionObserverCallback) {
      observerCallback = cb;
      this.observe = vi.fn();
      this.unobserve = vi.fn();
      this.disconnect = vi.fn();
      this.takeRecords = vi.fn(() => []);
      (this as unknown as { root: null }).root = null;
      (this as unknown as { rootMargin: string }).rootMargin = "";
      (this as unknown as { thresholds: number[] }).thresholds = [];
    }) as unknown as typeof IntersectionObserver;
  });

  function TestHost() {
    const [ref, revealed] = useScrollReveal<HTMLDivElement>();
    return <div ref={ref} data-testid="target" data-revealed={revealed ? "true" : "false"} />;
  }

  it("returns a ref + boolean; flips to true on intersection (one-shot)", () => {
    const { getByTestId } = render(<TestHost />);
    const el = getByTestId("target");

    expect(el.getAttribute("data-revealed")).toBe("false");
    expect(observerCallback).not.toBeNull();

    act(() => {
      observerCallback!(
        [{ isIntersecting: true, target: el } as unknown as IntersectionObserverEntry],
        {} as IntersectionObserver
      );
    });

    expect(el.getAttribute("data-revealed")).toBe("true");
  });

  it("respects prefers-reduced-motion (immediate reveal, no observer)", () => {
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })) as unknown as typeof window.matchMedia;

    const { getByTestId } = render(<TestHost />);
    const el = getByTestId("target");

    expect(el.getAttribute("data-revealed")).toBe("true");
  });
});
