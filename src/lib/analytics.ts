// Thin wrapper around the GTM dataLayer. Never throws; safe to call in SSR.
import type { VerticalKey } from "./verticals";

export type AnalyticsEvent =
  | { event: "hero_cta_demo_clicked" }
  | { event: "hero_cta_audit_clicked" }
  | { event: "header_cta_call_clicked" }
  | { event: "audio_demo_played" }
  | { event: "audio_demo_completed_30s" }
  | { event: "roi_calculator_started"; vertical: VerticalKey }
  | { event: "roi_calculator_completed"; vertical: VerticalKey; leakValue: number }
  | { event: "vertical_tile_expanded"; vertical: VerticalKey }
  | { event: "segment_tab_changed"; segment: VerticalKey }
  | { event: "pricing_teaser_clicked" }
  | { event: "demo_submitted"; vertical: VerticalKey; source: "A" | "B" }
  | { event: "final_cta_demo_clicked" }
  | { event: "final_cta_audit_clicked" }
  | { event: "demo_form_submitted"; segment: string }
  | { event: "demo_form_submit_click" }
  | { event: "audit_form_submitted"; segment: string }
  | { event: "audit_form_submit_click" }
  | { event: "about_cta_demo_clicked" }
  | { event: "about_cta_audit_clicked" }
  | { event: "contact_cta_demo_clicked" }
  | { event: "contact_cta_audit_clicked" };

export function track(event: AnalyticsEvent["event"], properties?: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  try {
    const w = window as unknown as { dataLayer?: Array<Record<string, unknown>> };
    if (!Array.isArray(w.dataLayer)) return;
    w.dataLayer.push({ event, ...properties });
  } catch {
    // swallow — analytics must never break the page
  }
}
