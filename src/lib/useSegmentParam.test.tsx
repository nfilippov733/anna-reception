import { render, act } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { useEffect } from "react";
import { useSegmentParam } from "./useSegmentParam";
import type { VerticalKey } from "./verticals";

function Probe({
  initial,
  onState,
}: {
  initial: VerticalKey;
  onState: (
    active: VerticalKey,
    select: (k: VerticalKey) => void
  ) => void;
}) {
  const [active, select] = useSegmentParam(initial);
  useEffect(() => {
    onState(active, select);
  });
  return null;
}

describe("useSegmentParam", () => {
  beforeEach(() => {
    window.history.replaceState({}, "", "/");
  });

  it("returns the initial segment if URL has no ?v= param", () => {
    let lastActive: VerticalKey | undefined;
    render(<Probe initial="dental" onState={(a) => (lastActive = a)} />);
    expect(lastActive).toBe("dental");
  });

  it("reads ?v= from URL on mount if present and valid", () => {
    window.history.replaceState({}, "", "/?v=beauty");
    let lastActive: VerticalKey | undefined;
    render(<Probe initial="dental" onState={(a) => (lastActive = a)} />);
    expect(lastActive).toBe("beauty");
  });

  it("ignores invalid ?v= values", () => {
    window.history.replaceState({}, "", "/?v=bogus");
    let lastActive: VerticalKey | undefined;
    render(<Probe initial="dental" onState={(a) => (lastActive = a)} />);
    expect(lastActive).toBe("dental");
  });

  it("select() updates state and URL", () => {
    let select: ((k: VerticalKey) => void) | undefined;
    let lastActive: VerticalKey | undefined;
    render(
      <Probe
        initial="dental"
        onState={(a, s) => {
          lastActive = a;
          select = s;
        }}
      />
    );
    act(() => select!("fitness"));
    expect(lastActive).toBe("fitness");
    expect(window.location.search).toBe("?v=fitness");
  });
});
