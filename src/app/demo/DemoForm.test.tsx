import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { DemoForm } from "./DemoForm";

describe("DemoForm", () => {
  it("renders 4 fields and a submit button", () => {
    render(<DemoForm initialSegment={null} />);
    expect(screen.getByLabelText(/Your name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Business name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Work email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Your industry/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Book my demo/i })).toBeInTheDocument();
  });

  it("preselects the segment when provided via initialSegment", () => {
    render(<DemoForm initialSegment="fitness" />);
    const select = screen.getByLabelText(/Your industry/i) as HTMLSelectElement;
    expect(select.value).toBe("fitness");
  });

  it("swaps to confirmation message on submit", async () => {
    const user = userEvent.setup();
    render(<DemoForm initialSegment="dental" />);
    await user.type(screen.getByLabelText(/Your name/i), "Test User");
    await user.type(screen.getByLabelText(/Business name/i), "Test Co");
    await user.type(screen.getByLabelText(/Work email/i), "test@example.com");
    await user.click(screen.getByRole("button", { name: /Book my demo/i }));
    expect(screen.getByText(/We'll be in touch within the hour/i)).toBeInTheDocument();
  });
});
