import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

if (typeof window !== "undefined" && !window.matchMedia) {
  window.matchMedia = (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });
}

// Default IntersectionObserver mock for jsdom. Individual tests
// may override globalThis.IntersectionObserver to drive specific behavior.
if (typeof globalThis.IntersectionObserver === "undefined") {
  globalThis.IntersectionObserver = vi.fn(function (
    this: IntersectionObserver
  ) {
    this.observe = vi.fn();
    this.unobserve = vi.fn();
    this.disconnect = vi.fn();
    this.takeRecords = () => [];
    // @ts-expect-error mock fields
    this.root = null;
    // @ts-expect-error mock fields
    this.rootMargin = "";
    // @ts-expect-error mock fields
    this.thresholds = [];
  }) as unknown as typeof IntersectionObserver;
}
