import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { PhoneDemoPanel } from "./PhoneDemoPanel";

describe("PhoneDemoPanel", () => {
  it("renders PlayButton and Waveform primitives", () => {
    const { container } = render(<PhoneDemoPanel segment="dental" />);
    // PlayButton renders a <button> with aria-label including "Play"
    const playBtn = container.querySelector('button[aria-label*="lay" i]');
    expect(playBtn).not.toBeNull();
    // Waveform renders an SVG or container with data-testid="waveform" — we accept either
    const waveform =
      container.querySelector('[data-testid="waveform"]') ?? container.querySelector("svg");
    expect(waveform).not.toBeNull();
  });

  it("renders segment-aware transcript when no audio src configured", () => {
    render(<PhoneDemoPanel segment="beauty" />);
    // Beauty phone turn 1: "Can I book a balayage with Jess for Saturday?"
    expect(screen.getByText(/balayage with Jess/i)).toBeInTheDocument();
    // Last turn meta: "Audio sample available at launch"
    expect(screen.getByText(/Audio sample available at launch/i)).toBeInTheDocument();
  });

  it("renders all 4 turns of the construction phone transcript", () => {
    render(<PhoneDemoPanel segment="construction" />);
    expect(screen.getByText(/Boiler leaking, water everywhere/i)).toBeInTheDocument();
    expect(screen.getByText(/Is the stop-tap off\?/i)).toBeInTheDocument();
    expect(screen.getByText(/Just turned it/i)).toBeInTheDocument();
    expect(screen.getByText(/Mark D in your postcode/i)).toBeInTheDocument();
  });
});
