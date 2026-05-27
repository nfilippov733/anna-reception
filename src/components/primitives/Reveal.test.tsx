import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, act, screen } from "@testing-library/react";
import { Reveal } from "./Reveal";

describe("Reveal", () => {
  let observerCallback: IntersectionObserverCallback | null;

  beforeEach(() => {
    observerCallback = null;
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })) as unknown as typeof window.matchMedia;

    global.IntersectionObserver = vi.fn(function (
      this: IntersectionObserver,
      cb: IntersectionObserverCallback
    ) {
      observerCallback = cb;
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
  });

  it("renders children", () => {
    render(<Reveal><span>hello</span></Reveal>);
    expect(screen.getByText("hello")).toBeInTheDocument();
  });

  it("starts hidden (opacity-0 translate-y-4) and reveals on intersection", () => {
    const { container } = render(<Reveal><span>hi</span></Reveal>);
    const wrapper = container.firstElementChild as HTMLElement;

    expect(wrapper.className).toMatch(/opacity-0/);
    expect(wrapper.className).toMatch(/translate-y-4/);

    act(() => {
      observerCallback!(
        [{ isIntersecting: true, intersectionRatio: 0.3, target: wrapper } as unknown as IntersectionObserverEntry],
        {} as IntersectionObserver
      );
    });

    expect(wrapper.className).toMatch(/opacity-100/);
    expect(wrapper.className).toMatch(/translate-y-0/);
  });

  it("applies delayMs as inline transition-delay style", () => {
    const { container } = render(<Reveal delayMs={120}><span>x</span></Reveal>);
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.style.transitionDelay).toBe("120ms");
  });

  it("under reduced-motion, renders immediately with no transition", () => {
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })) as unknown as typeof window.matchMedia;

    const { container } = render(<Reveal><span>x</span></Reveal>);
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.className).toMatch(/opacity-100/);
    expect(wrapper.className).toMatch(/translate-y-0/);
  });

  it("forces visible state when a descendant has focus (focus-within)", () => {
    const { container } = render(
      <Reveal>
        <button>focusable</button>
      </Reveal>
    );
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.className).toMatch(/focus-within:opacity-100/);
    expect(wrapper.className).toMatch(/focus-within:translate-y-0/);
  });

  it("skips transition when fast-scroll guard fires (intersectionRatio >= 0.6)", () => {
    const { container } = render(<Reveal><span>x</span></Reveal>);
    const wrapper = container.firstElementChild as HTMLElement;

    act(() => {
      observerCallback!(
        [{ isIntersecting: true, intersectionRatio: 0.85, target: wrapper } as unknown as IntersectionObserverEntry],
        {} as IntersectionObserver
      );
    });

    expect(wrapper.className).toMatch(/opacity-100/);
    expect(wrapper.className).not.toMatch(/duration-\[480ms\]/);
  });
});
