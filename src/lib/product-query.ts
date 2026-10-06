import type { ProductFilters, ProductSort } from "@/types/shop";

export type RawSearchParams = Record<string, string | string[] | undefined>;

export const SORTS: ProductSort[] = [
  "newest",
  "popular",
  "rating",
  "price-asc",
  "price-desc",
];
export const PAGE_SIZE = 12;

export type ListingState = {
  q?: string;
  category?: string;
  min?: number;
  max?: number;
  inStock: boolean;
  sale: boolean;
  sort: ProductSort;
  page: number;
};

export type Patch = Partial<
  Record<
    "q" | "category" | "min" | "max" | "inStock" | "sale" | "sort" | "page",
    string | number | boolean | null | undefined
  >
>;

const first = (v: string | string[] | undefined) =>
  Array.isArray(v) ? v[0] : v;

// বাংলা সংখ্যা (১২৩) থেকে ইংরেজি সংখ্যায়
export function toAsciiDigits(s: string) {
  return s.replace(/[০-৯]/g, (d) => String("০১২৩৪৫৬৭৮৯".indexOf(d)));
}

export function toNumber(v?: string | null) {
  if (!v) return undefined;
  const digits = toAsciiDigits(v).replace(/[^\d]/g, "");
  return digits ? Number(digits) : undefined;
}

/** URL এর query থেকে নিরাপদভাবে ফিল্টার স্টেট বানায় */
export function parseListing(sp: RawSearchParams): ListingState {
  let min = toNumber(first(sp.min));
  let max = toNumber(first(sp.max));
  if (min != null && max != null && min > max) [min, max] = [max, min];

  const sortRaw = first(sp.sort);
  const sort = SORTS.includes(sortRaw as ProductSort)
    ? (sortRaw as ProductSort)
    : "newest";

  return {
    q: first(sp.q)?.trim().slice(0, 80) || undefined,
    category: first(sp.category) || undefined,
    min,
    max,
    inStock: first(sp.inStock) === "1",
    sale: first(sp.sale) === "1",
    sort,
    page: Math.max(1, toNumber(first(sp.page)) ?? 1),
  };
}

/** স্টেট থেকে URL query (ডিফল্ট মান বাদ দিয়ে) */
export function serialize(s: ListingState): Record<string, string> {
  const out: Record<string, string> = {};
  if (s.q) out.q = s.q;
  if (s.category) out.category = s.category;
  if (s.min != null) out.min = String(s.min);
  if (s.max != null) out.max = String(s.max);
  if (s.inStock) out.inStock = "1";
  if (s.sale) out.sale = "1";
  if (s.sort !== "newest") out.sort = s.sort;
  if (s.page > 1) out.page = String(s.page);
  return out;
}

export function hasFilters(s: ListingState) {
  return Boolean(
    s.q || s.category || s.min != null || s.max != null || s.inStock || s.sale,
  );
}

/** fixed = পেজ নিজে যা ঠিক করে দেয় (যেমন ক্যাটাগরি পেজে category) */
export function toFilters(
  s: ListingState,
  fixed: Partial<ProductFilters> = {},
): ProductFilters {
  return {
    q: s.q,
    category: s.category,
    minPrice: s.min,
    maxPrice: s.max,
    inStock: s.inStock || undefined,
    onSale: s.sale || undefined,
    sort: s.sort,
    page: s.page,
    pageSize: PAGE_SIZE,
    ...fixed,
  };
}

/** বর্তমান query এর ওপর patch বসিয়ে নতুন লিংক বানায়। ফিল্টার বদলালে page রিসেট হয় */
export function buildHref(
  basePath: string,
  current: Record<string, string>,
  patch: Patch,
) {
  const next: Record<string, string> = { ...current };
  for (const [k, v] of Object.entries(patch)) {
    if (v === undefined || v === null || v === false || v === "")
      delete next[k];
    else next[k] = v === true ? "1" : String(v);
  }
  if (!("page" in patch)) delete next.page;
  if (next.sort === "newest") delete next.sort;
  const qs = new URLSearchParams(next).toString();
  return qs ? `${basePath}?${qs}` : basePath;
}
