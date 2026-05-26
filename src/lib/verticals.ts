export type VerticalKey = "dental" | "beauty" | "pubs" | "construction";

export const VERTICAL_KEYS: VerticalKey[] = ["dental", "beauty", "pubs", "construction"];

export function isVerticalKey(v: string): v is VerticalKey {
  return (VERTICAL_KEYS as string[]).includes(v);
}
