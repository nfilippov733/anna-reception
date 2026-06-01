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
  | { event: "trial_cta_clicked" }
  | { event: "pricing_tier_expanded"; plan: string }
  | { event: "pricing_tier_cta_clicked"; plan: string }
  | { event: "hiring_comparison_changed"; salary: number }
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
  | { event: "contact_cta_audit_clicked" }
  | { event: "not_found_home_clicked" }
  | { event: "not_found_demo_clicked" }
  | { event: "header_cta_demo_clicked" }
  | { event: "sticky_cta_demo_clicked" }
  | { event: "roi_cta_audit_clicked" }
  | { event: "channel_tab_changed"; segment: VerticalKey; channel: "phone" | "whatsapp" | "instagram" | "web" }
  | { event: "channel_demos_demo_clicked"; segment: VerticalKey; channel: "phone" | "whatsapp" | "instagram" | "web" }
  | { event: "channel_demos_audit_clicked"; segment: VerticalKey; channel: "phone" | "whatsapp" | "instagram" | "web" };

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
