import { products } from "@/data/products";
import { reviews } from "@/data/reviews";
import type { Review } from "@/types/shop";

export type ReviewWithProduct = Review & {
  productSlug: string;
  productName: string;
};

export async function getReviewsByProduct(
  productId: string,
): Promise<Review[]> {
  return reviews.filter((r) => r.productId === productId);
}

// হোমপেজের "ক্রেতারা কী বলছেন" এর জন্য: ৫ স্টার, যাচাইকৃত, প্রতি পণ্যের একটা করে
export async function getTopReviews(limit = 3): Promise<ReviewWithProduct[]> {
  const seen = new Set<string>();
  const out: ReviewWithProduct[] = [];
  for (const r of reviews) {
    if (r.rating < 5 || !r.verified || seen.has(r.productId)) continue;
    const p = products.find((x) => x.id === r.productId);
    if (!p) continue;
    seen.add(r.productId);
    out.push({ ...r, productSlug: p.slug, productName: p.name });
    if (out.length >= limit) break;
  }
  return out;
}
