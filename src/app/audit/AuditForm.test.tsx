import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { AuditForm } from "./AuditForm";

describe("AuditForm", () => {
  it("renders 4 fields and a submit button", () => {
    render(<AuditForm initialSegment={null} />);
    expect(screen.getByLabelText(/Your business website/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Work email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/what % of calls do you miss/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Your industry/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Get my audit/i })).toBeInTheDocument();
  });

  it("preselects the segment when provided via initialSegment", () => {
    render(<AuditForm initialSegment="dental" />);
    const select = screen.getByLabelText(/Your industry/i) as HTMLSelectElement;
    expect(select.value).toBe("dental");
  });

  it("swaps to confirmation message on submit", async () => {
    const user = userEvent.setup();
    render(<AuditForm initialSegment="beauty" />);
    await user.type(screen.getByLabelText(/Your business website/i), "https://example.com");
    await user.type(screen.getByLabelText(/Work email/i), "test@example.com");
    await user.type(screen.getByLabelText(/what % of calls do you miss/i), "30");
    await user.click(screen.getByRole("button", { name: /Get my audit/i }));
    expect(screen.getByText(/Your audit is being prepared/i)).toBeInTheDocument();
  });
});
