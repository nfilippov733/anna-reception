import { isVerticalKey, type VerticalKey } from "./verticals";

export function readVerticalFromUrl(url: URL): VerticalKey | null {
  const raw = url.searchParams.get("v");
  if (!raw) return null;
  const normalised = raw.toLowerCase();
  return isVerticalKey(normalised) ? normalised : null;
}
